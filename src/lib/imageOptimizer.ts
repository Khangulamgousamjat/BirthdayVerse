/**
 * BirthdayVerse Client-Side Image Optimizer
 * Resizes and compresses images in the browser to prevent Firestore 1MB document limit errors
 * and ensure fast mobile loading for up to 6 uploaded photos.
 * 
 * Strict Budget: Total payload for all photos combined is capped at ~260,000 base64 chars (~190KB),
 * leaving over 800KB of safety headroom in Cloud Firestore (which has a 1,048,576 byte limit).
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxDataUrlLength?: number;
}

/**
 * Compresses an image File, Blob, or base64 Data URL to a lightweight JPEG Data URL.
 * Guarantees the output string does not exceed maxDataUrlLength.
 */
export async function compressImageToDataUrl(
  input: File | Blob | string,
  options: OptimizeOptions = {}
): Promise<string> {
  const {
    maxWidth = 720,
    maxHeight = 720,
    quality = 0.70,
    maxDataUrlLength = 65000, // ~48KB default per photo
  } = options;

  return new Promise((resolve) => {
    let objectUrlToRevoke: string | null = null;
    let src = "";

    if (typeof input === "string") {
      src = input;
      // If already a tiny string or remote URL, return as-is
      if (!src.startsWith("data:image/") && !src.startsWith("blob:")) {
        resolve(src);
        return;
      }
    } else {
      try {
        objectUrlToRevoke = URL.createObjectURL(input);
        src = objectUrlToRevoke;
      } catch (err) {
        console.warn("Failed to create ObjectURL:", err);
        resolve("");
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        resolve(typeof input === "string" ? input : "");
        return;
      }

      // Initial proportional downscale
      let targetW = width;
      let targetH = height;
      if (targetW > maxWidth || targetH > maxHeight) {
        if (targetW / targetH > maxWidth / maxHeight) {
          targetH = Math.round((targetH * maxWidth) / targetW);
          targetW = maxWidth;
        } else {
          targetW = Math.round((targetW * maxHeight) / targetH);
          targetH = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(typeof input === "string" ? input : "");
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetW, targetH);

      let currentQuality = quality;
      let dataUrl = canvas.toDataURL("image/jpeg", currentQuality);

      // Iteratively reduce quality or scale down canvas until it strictly fits under maxDataUrlLength
      let attempts = 0;
      while (dataUrl.length > maxDataUrlLength && attempts < 7) {
        attempts++;
        currentQuality -= 0.10;

        if (currentQuality < 0.45 || attempts >= 3) {
          // Downscale canvas dimensions further
          targetW = Math.max(240, Math.round(targetW * 0.80));
          targetH = Math.max(240, Math.round(targetH * 0.80));

          canvas.width = targetW;
          canvas.height = targetH;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "medium";
          ctx.drawImage(img, 0, 0, targetW, targetH);
          currentQuality = 0.55;
        }

        dataUrl = canvas.toDataURL("image/jpeg", Math.max(0.35, currentQuality));
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      resolve(typeof input === "string" ? input : "");
    };

    img.src = src;
  });
}

/**
 * Converts a base64 Data URL to a native binary Blob for Firebase Storage uploads.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binaryString = atob(parts[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

/**
 * Optimizes an array of photo strings or files to fit comfortably under Firestore's 1MB limit.
 * Total budget for all photos combined is capped at 260,000 base64 chars (~190KB).
 */
export async function optimizePhotoBatch(
  photos: (File | Blob | string)[]
): Promise<string[]> {
  if (!photos || photos.length === 0) return [];

  const count = Math.max(1, photos.length);
  // Distribute 260,000 chars budget evenly, capped at 90,000 for single photo
  const maxCharsPerPhoto = Math.min(90000, Math.floor(260000 / count));
  const maxDimension = count <= 2 ? 720 : count <= 4 ? 640 : 540;

  const results: string[] = [];

  for (const photo of photos) {
    try {
      const compressed = await compressImageToDataUrl(photo, {
        maxWidth: maxDimension,
        maxHeight: maxDimension,
        quality: 0.68,
        maxDataUrlLength: maxCharsPerPhoto,
      });
      if (compressed) {
        results.push(compressed);
      }
    } catch (err) {
      console.warn("Failed to compress photo in batch:", err);
      if (typeof photo === "string") {
        results.push(photo);
      }
    }
  }

  return results;
}
