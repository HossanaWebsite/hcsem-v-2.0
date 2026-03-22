import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Extracts the Cloudinary public_id from a secure URL and deletes the asset.
 * Safe to call with non-Cloudinary URLs — it will simply skip them.
 * @param {string|string[]} urls - A single URL or array of URLs to delete
 */
export async function deleteCloudinaryImages(urls) {
    if (!urls) return;
    const list = Array.isArray(urls) ? urls : [urls];

    const publicIds = list
        .filter((url) => typeof url === 'string' && url.includes('res.cloudinary.com'))
        .map((url) => {
            // URL pattern: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<public_id>.<ext>
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
            return match ? match[1] : null;
        })
        .filter(Boolean);

    if (publicIds.length === 0) return;

    await Promise.allSettled(
        publicIds.map((id) => cloudinary.uploader.destroy(id))
    );
}
