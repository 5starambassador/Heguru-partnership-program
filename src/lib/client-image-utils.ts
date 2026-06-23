/**
 * Client-side utility to compress a file, convert it to WebP, and ensure its size is under 1MB.
 * If canvas or FileReader fails, it falls back to the original file read as base64.
 */
export const compressAndConvertToWebP = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("compressAndConvertToWebP can only be run in the browser"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      const img = new Image();
      img.src = resultStr;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(resultStr);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.8;
          let compressedBase64 = canvas.toDataURL("image/webp", quality);

          // Iteratively compress quality if base64 size exceeds 1MB limit (~1.3MB raw string size)
          while (compressedBase64.length > 1.3 * 1024 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compressedBase64 = canvas.toDataURL("image/webp", quality);
          }

          resolve(compressedBase64);
        } catch (e) {
          console.warn("Canvas compression failed, falling back to raw file base64", e);
          resolve(resultStr);
        }
      };
      img.onerror = (err) => {
        console.warn("Image load failed, falling back to raw file base64", err);
        resolve(resultStr);
      };
    };
    reader.onerror = (err) => reject(err);
  });
};
