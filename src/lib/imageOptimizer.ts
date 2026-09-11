/**
 * BirthdayVerse Client-Side Image Optimizer
 * Resizes and compresses images in the browser to prevent Firestore 1MB document limit errors
 * and ensure fast mobile loading for up to 6 uploaded photos.
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxDataUrlLength?: number; // approx bytes limit (e.g. 110,000 chars is ~80KB)
}

/**
 * Compresses an image File, Blob, or base64 Data URL to a lightweight JPEG Data URL.
 */
export async function compressImageToDataUrl(
  input: File | Blob | string,
  options: OptimizeOptions = {}
): Promise<string> {
  const {
    maxWidth = 960,
    maxHeight = 960,
    quality = 0.72,
    maxDataUrlLength = 115000, // ~85KB max per photo
  } = options;

  return new Promise((resolve, reject) => {
    let objectUrlToRevoke: string | null = null;
    let src = "";

    if (typeof input === "string") {
      src = input;
      // If already a tiny string or not a data url, return as is
      if (!src.startsWith("data:image/") && !src.startsWith("blob:") && !src.startsWith("http")) {
        resolve(src);
        return;
      }
    } else {
      try {
        objectUrlToRevoke = URL.createObjectURL(input);
        src = objectUrlToRevoke;
      } catch (err) {
        reject(err);
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

      // Proportional downscale
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(typeof input === "string" ? input : "");
        return;
      }

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      let currentQuality = quality;
      let dataUrl = canvas.toDataURL("image/jpeg", currentQuality);

      // Iteratively reduce quality or scale down if still exceeds target size
      let attempts = 0;
      while (dataUrl.length > maxDataUrlLength && attempts < 5) {
        attempts++;
        currentQuality -= 0.12;

        if (currentQuality < 0.4) {
          // Scale down dimensions by 75%
          const downCanvas = document.createElement("canvas");
          const targetW = Math.round(canvas.width * 0.75);
          const targetH = Math.round(canvas.height * 0.75);
          downCanvas.width = Math.max(200, targetW);
          downCanvas.height = Math.max(200, targetH);
          const downCtx = downCanvas.getContext("2d");

          if (downCtx) {
            downCtx.imageSmoothingEnabled = true;
            downCtx.imageSmoothingQuality = "medium";
            downCtx.drawImage(canvas, 0, 0, downCanvas.width, downCanvas.height);
            dataUrl = downCanvas.toDataURL("image/jpeg", 0.6);
          }
          break;
        }

        dataUrl = canvas.toDataURL("image/jpeg", Math.max(0.4, currentQuality));
      }

      resolve(dataUrl);
    };

    img.onerror = (err) => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      // If compression fails, fall back to string or reject
      if (typeof input === "string") {
        resolve(input);
      } else {
        reject(err);
      }
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
 */
export async function optimizePhotoBatch(
  photos: (File | Blob | string)[],
  maxTotalBytes = 600000 // ~600KB budget for all photos combined
): Promise<string[]> {
  if (!photos || photos.length === 0) return [];

  const maxPerPhoto = Math.floor(maxTotalBytes / Math.max(1, photos.length));
  // Base64 chars = bytes * 1.37
  const maxCharsPerPhoto = Math.floor(maxPerPhoto * 1.35);

  const results: string[] = [];

  for (const photo of photos) {
    try {
      const compressed = await compressImageToDataUrl(photo, {
        maxWidth: 960,
        maxHeight: 960,
        quality: 0.72,
        maxDataUrlLength: maxCharsPerPhoto,
      });
      results.push(compressed);
    } catch (err) {
      console.warn("Failed to compress photo, using original fallback:", err);
      if (typeof photo === "string") {
        results.push(photo);
      }
    }
  }

  return results;
}
