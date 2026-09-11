import { db, storage } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { dataUrlToBlob, optimizePhotoBatch } from './imageOptimizer';

export type SurpriseData = {
  id: string; // Firestore document ID (which is the short_id)
  short_id: string; // The short URL id
  name: string;
  message: string;
  image_path?: string; // Stored as direct Firebase download URL
  music_path?: string; // Stored as direct Firebase download URL
  created_at: string;
  view_count?: number;
  reactions?: number;
};

export interface AdminMetrics {
  totalCelebrations: number;
  totalViews: number;
  totalReactions: number;
  activeVerses: number;
  expiredVerses: number;
  recentVerses: Array<{
    id: string;
    name: string;
    created_at: string;
    views: number;
    reactions: number;
    status: "Live" | "Expired" | "Kept Forever";
  }>;
  trafficDays: Array<{
    day: string;
    views: number;
  }>;
}

// Helper function to enforce a timeout on asynchronous tasks
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
}

async function uploadFile(file: File | Blob, path: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, `surprises/${path}`);
    const snapshot = await withTimeout(
      uploadBytes(storageRef, file),
      15000,
      "File upload timed out. Please check your Firebase Storage setup and connection."
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Storage upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function getSurpriseData(short_id: string): Promise<SurpriseData | null> {
  try {
    const docRef = doc(db, 'surprises', short_id);
    const docSnap = await withTimeout(
      getDoc(docRef),
      10000,
      "Reading database timed out. Please check your Firebase connection."
    );

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    // Check if creator selected "Keep forever" in message JSON
    let isKeptForever = false;
    try {
      const parsed = JSON.parse(data.message);
      if (parsed?.retentionMode === "forever" || parsed?.keepForever === true) {
        isKeptForever = true;
      }
    } catch {
      // Plain text message
    }

    // 72-Hour Ephemeral Link Auto-Purge Check (unless Kept Forever)
    if (!isKeptForever && data.created_at) {
      const createdTime = new Date(data.created_at).getTime();
      const now = Date.now();
      const seventyTwoHoursMs = 72 * 60 * 60 * 1000;
      if (now - createdTime > seventyTwoHoursMs) {
        // Document has passed 72h ephemeral lifetime
        deleteDoc(docRef).catch((err) => console.error("Error purging expired document:", err));
        return null;
      }
    }

    return {
      id: docSnap.id,
      short_id: data.short_id,
      name: data.name,
      message: data.message,
      image_path: data.image_path || undefined,
      music_path: data.music_path || undefined,
      created_at: data.created_at,
      view_count: data.view_count || 0,
      reactions: data.reactions || 0,
    };
  } catch (error: any) {
    console.error("Error fetching surprise data from Firestore:", error);
    return null;
  }
}

export async function saveSurpriseData(record: {
  name: string;
  message: string;
  imageBase64?: string | null;
  musicFile?: File | null;
  photos?: string[];
}): Promise<string> {
  const short_id = Math.random().toString(36).substring(2, 10);

  try {
    let music_path: string | undefined = undefined;

    // Upload Music if provided
    if (record.musicFile) {
      try {
        const ext = record.musicFile.name.split('.').pop() || 'mp3';
        const fileName = `${short_id}_music.${ext}`;
        music_path = (await uploadFile(record.musicFile, fileName)) || undefined;
      } catch (musicErr) {
        console.warn("Music upload to storage skipped:", musicErr);
      }
    }

    let finalMessage = record.message;
    let image_path: string | null = null;
    let parsedPayload: any = null;

    try {
      parsedPayload = JSON.parse(record.message);
    } catch {
      // plain text message
    }

    const photosList: string[] = (record.photos && record.photos.length > 0)
      ? record.photos
      : (parsedPayload?.photos && Array.isArray(parsedPayload.photos))
        ? parsedPayload.photos
        : (record.imageBase64 ? [record.imageBase64] : []);

    let uploadedUrls: string[] = [];
    let storageSucceeded = false;

    // 1. Attempt uploading photos to Firebase Storage if any are data URLs
    if (photosList.length > 0) {
      try {
        const uploadPromises = photosList.map(async (photoStr, idx) => {
          if (photoStr && photoStr.startsWith("data:image/")) {
            const blob = dataUrlToBlob(photoStr);
            const fileName = `${short_id}_photo_${idx}.jpg`;
            const downloadUrl = await uploadFile(blob, fileName);
            return downloadUrl || photoStr;
          }
          return photoStr;
        });

        // 10s timeout for photo storage upload
        const urls = await withTimeout(
          Promise.all(uploadPromises),
          10000,
          "Storage upload timed out"
        );

        if (urls && urls.length > 0 && urls.some((u) => u && u.startsWith("http"))) {
          uploadedUrls = urls;
          storageSucceeded = true;
          image_path = urls[0];
        }
      } catch (storageErr) {
        console.warn("Firebase Storage photo upload skipped, using optimized inline storage:", storageErr);
        storageSucceeded = false;
      }
    }

    // 2. Assemble the payload safely
    if (parsedPayload && typeof parsedPayload === "object") {
      if (storageSucceeded && uploadedUrls.length > 0) {
        parsedPayload.photos = uploadedUrls;
        image_path = uploadedUrls[0];
      } else {
        // In-line fallback: Ensure all photos are strictly budget-optimized
        if (Array.isArray(parsedPayload.photos) && parsedPayload.photos.length > 0) {
          const hasOversized = parsedPayload.photos.some(
            (p: string) => typeof p === "string" && (p.length > 65000 || p.startsWith("data:"))
          );
          if (hasOversized) {
            parsedPayload.photos = await optimizePhotoBatch(parsedPayload.photos);
          }
        }
        // Never duplicate base64 data in image_path (Surprise.tsx reads photos[0])
        image_path = null;
      }
      finalMessage = JSON.stringify(parsedPayload);
    } else if (storageSucceeded && uploadedUrls[0]) {
      image_path = uploadedUrls[0];
    } else {
      image_path = null;
    }

    // Save surprise details in Firestore surprises collection
    await withTimeout(
      setDoc(doc(db, 'surprises', short_id), {
        short_id,
        name: record.name,
        message: finalMessage,
        image_path: image_path || null,
        music_path: music_path || null,
        created_at: new Date().toISOString(),
        view_count: 0,
        reactions: 0
      }),
      10000,
      "Database save timed out. Please check your Firestore database setup and internet connection."
    );

    return short_id;
  } catch (err: any) {
    console.error("Failed to save surprise data to Firestore:", err);
    throw err;
  }
}

export async function incrementViewCount(short_id: string): Promise<void> {
  try {
    const docRef = doc(db, 'surprises', short_id);
    await updateDoc(docRef, {
      view_count: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}

export async function incrementReactions(short_id: string): Promise<void> {
  try {
    const docRef = doc(db, 'surprises', short_id);
    await updateDoc(docRef, {
      reactions: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing reactions:", error);
  }
}

export async function deleteSurprise(short_id: string): Promise<void> {
  try {
    const docRef = doc(db, 'surprises', short_id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting surprise document:", error);
    throw error;
  }
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  try {
    const surprisesColl = collection(db, 'surprises');
    const q = query(surprisesColl, orderBy('created_at', 'desc'), limit(100));
    const snapshot = await withTimeout(
      getDocs(q),
      10000,
      "Fetching admin metrics timed out."
    );

    let totalViews = 0;
    let totalReactions = 0;
    let activeVerses = 0;
    let expiredVerses = 0;
    const now = Date.now();
    const seventyTwoHoursMs = 72 * 60 * 60 * 1000;

    const recentVerses: AdminMetrics["recentVerses"] = [];
    const viewsByDay: Record<string, number> = {};

    // Initialize 7 days of labels (e.g. "Mon", "Tue", etc.)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      viewsByDay[dayNames[d.getDay()]] = 0;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const views = Number(data.view_count || 0);
      const reactions = Number(data.reactions || 0);
      totalViews += views;
      totalReactions += reactions;

      let isKeptForever = false;
      try {
        const parsed = JSON.parse(data.message);
        if (parsed?.retentionMode === "forever" || parsed?.keepForever === true) {
          isKeptForever = true;
        }
      } catch {
        // Plain text message
      }

      const createdTime = data.created_at ? new Date(data.created_at).getTime() : now;
      const isExpired = !isKeptForever && now - createdTime > seventyTwoHoursMs;

      if (isExpired) {
        expiredVerses++;
      } else {
        activeVerses++;
      }

      // Group views into past 7 days
      const docDate = new Date(createdTime);
      const dayName = dayNames[docDate.getDay()];
      if (dayName in viewsByDay) {
        viewsByDay[dayName] += views;
      }

      recentVerses.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        created_at: data.created_at || new Date().toISOString(),
        views,
        reactions,
        status: isKeptForever ? "Kept Forever" : isExpired ? "Expired" : "Live",
      });
    });

    const trafficDays = Object.entries(viewsByDay).map(([day, views]) => ({
      day,
      views,
    }));

    return {
      totalCelebrations: snapshot.size,
      totalViews,
      totalReactions,
      activeVerses,
      expiredVerses,
      recentVerses: recentVerses.slice(0, 10),
      trafficDays,
    };
  } catch (error) {
    console.error("Error computing admin metrics:", error);
    // Return empty state when database is unreachable or empty
    return {
      totalCelebrations: 0,
      totalViews: 0,
      totalReactions: 0,
      activeVerses: 0,
      expiredVerses: 0,
      recentVerses: [],
      trafficDays: [
        { day: "Mon", views: 0 },
        { day: "Tue", views: 0 },
        { day: "Wed", views: 0 },
        { day: "Thu", views: 0 },
        { day: "Fri", views: 0 },
        { day: "Sat", views: 0 },
        { day: "Sun", views: 0 },
      ],
    };
  }
}

// ── Admin Authentication Helpers ──────────────────────────────────────────────

async function sha256Hex(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const DEFAULT_ADMIN_HASH = "59eafbae0bb4a62bbfb4933f8800482264da9301a8384284f0205704d075a44a"; // Kingkhan@12

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const docRef = doc(db, "_system_settings", "admin_auth");
    const snap = await withTimeout(getDoc(docRef), 5000, "Auth timeout");
    const hash = await sha256Hex(password);
    if (snap.exists() && snap.data()?.hash) {
      return snap.data().hash === hash;
    }
    return hash === DEFAULT_ADMIN_HASH || password === "Kingkhan@12";
  } catch {
    return password === "Kingkhan@12";
  }
}

export async function updateAdminPasswordInDb(currentPassword: string, newPassword: string): Promise<void> {
  const isValid = await verifyAdminPassword(currentPassword);
  if (!isValid) {
    throw new Error("Incorrect current password.");
  }
  const newHash = await sha256Hex(newPassword);
  const docRef = doc(db, "_system_settings", "admin_auth");
  await withTimeout(
    setDoc(docRef, {
      hash: newHash,
      updated_at: new Date().toISOString(),
    }, { merge: true }),
    8000,
    "Database update timed out"
  );
}
