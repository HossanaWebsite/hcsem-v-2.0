import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { handleError, handleSuccess } from '@/lib/errorHandler';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get('file');

        if (!file) {
            throw new Error('No file uploaded');
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log('Uploading file to Cloudinary...');

        // Upload to Cloudinary using an upload stream
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'hcsem_uploads',
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary upload success:', result.secure_url);
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        // Return both public_id (for CldImage) and secure_url (as fallback)
        return handleSuccess({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        });
    } catch (error) {
        console.error('Upload API level error:', error);
        return handleError(error, req);
    }
}

