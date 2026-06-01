// Client-side helper: uploads an image to Cloudinary using a server-signed
// signature (the API secret never leaves the server). Returns the secure URL.
//
// Used by the article image uploader and by the rich-text editor's inline
// image upload handler so editors can drop/paste multiple images into a story.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const API_KEY    = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
const FOLDER     = "gospel-news";

export async function uploadToCloudinary(
    file: Blob,
    onProgress?: (percent: number) => void,
): Promise<string> {
    const timestamp = Math.round(Date.now() / 1000);

    // 1. Get a server-side signature
    const signRes = await fetch("/api/cloudinary/sign", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
            paramsToSign: { folder: FOLDER, timestamp: String(timestamp) },
        }),
    });

    if (!signRes.ok) throw new Error("Could not get an upload signature.");
    const { signature } = (await signRes.json()) as { signature: string };

    // 2. Upload directly to Cloudinary with XHR (for progress)
    const fd = new FormData();
    fd.append("file",      file);
    fd.append("api_key",   API_KEY);
    fd.append("timestamp", String(timestamp));
    fd.append("signature", signature);
    fd.append("folder",    FOLDER);

    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            try {
                const data = JSON.parse(xhr.responseText) as {
                    secure_url?: string;
                    error?: { message?: string };
                };
                if (data.secure_url) resolve(data.secure_url);
                else reject(new Error(data.error?.message ?? "Upload failed."));
            } catch {
                reject(new Error("The server returned an invalid response."));
            }
        };

        xhr.onerror = () => reject(new Error("Network error."));
        xhr.send(fd);
    });
}
