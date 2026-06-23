/**
 * Server-side utility to upload base64 images directly to ImageKit via their REST API.
 * Uses Basic Authentication with the Private Key.
 */
export async function uploadToImageKit(
  base64Data: string,
  fileName: string,
): Promise<string | null> {
  const privateKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY ||
    process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    console.warn("[ImageKit] Private key is missing from environment variables.");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("fileName", fileName);
    formData.append("useUniqueFileName", "true");

    // Add a folder structure in ImageKit console to organize uploads
    formData.append("folder", "/heguru_uploads");

    const authHeader =
      "Basic " + Buffer.from(privateKey + ":").toString("base64");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ImageKit Upload Error] Status:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    if (data && data.url) {
      return data.url;
    }

    return null;
  } catch (error) {
    console.error("[ImageKit Upload Exception]:", error);
    return null;
  }
}
