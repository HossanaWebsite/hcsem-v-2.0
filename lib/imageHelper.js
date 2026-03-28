import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

// Note: Cloudinary is kept just in case user deletes an old blog post or event
// that still uses a Cloudinary image the script didn't migrate.
// Even if keys aren't present, the error block will safely catch it.
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
}

/**
 * Extracts the Cloudinary public_id from a secure URL and deletes the asset,
 * OR deletes local files if they matching local paths.
 * Safe to call with non-Cloudinary/non-existent URLs.
 * @param {string|string[]} urls - A single URL or array of URLs to delete
 */
export async function deleteImages(urls) {
    if (!urls) return;
    const list = Array.isArray(urls) ? urls : [urls];

    // Filter missing/null
    const validUrls = list.filter((url) => typeof url === 'string');
    if (validUrls.length === 0) return;

    // 1. Differentiate Local Vs Cloudinary
    const cloudinaryIds = validUrls
        .filter((url) => url.includes('res.cloudinary.com'))
        .map((url) => {
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
            return match ? match[1] : null;
        })
        .filter(Boolean);

    const localPaths = validUrls
        .filter((url) => url.startsWith('/uploads/'));

    // 2. Delete Cloudinary
    if (cloudinaryIds.length > 0 && process.env.CLOUDINARY_CLOUD_NAME) {
        try {
            await Promise.allSettled(
                cloudinaryIds.map((id) => cloudinary.uploader.destroy(id))
            );
        } catch (error) {
            console.error("Error destroying Cloudinary assets:", error);
        }
    }

    // 3. Delete Local
    if (localPaths.length > 0) {
        const publicDir = path.join(process.cwd(), 'public');
        await Promise.allSettled(
            localPaths.map(async (localUrl) => {
                try {
                    // prevent directory traversal attacks
                    const safePath = path.normalize(localUrl).replace(/^(\.\.(\/|\\|$))+/, '');
                    const absolutePath = path.join(publicDir, safePath);
                    await fs.unlink(absolutePath);
                } catch (error) {
                    // Ignore ENOENT (file not found)
                    if (error.code !== 'ENOENT') {
                        console.error(`Error deleting local file ${localUrl}:`, error);
                    }
                }
            })
        );
    }
}
