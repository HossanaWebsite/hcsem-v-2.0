import { NextResponse } from 'next/server';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get('file');

        if (!file) {
            throw new Error('No file uploaded');
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Extract original extension or default to .jpg
        const extension = file.name ? path.extname(file.name) : '.jpg';
        const filename = `${crypto.randomUUID()}${extension}`;
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, filename);

        // Ensure the directory exists
        await fs.mkdir(uploadsDir, { recursive: true });

        // Save the file exactly where you requested
        await fs.writeFile(filePath, buffer);

        console.log(`Saved locally as: /uploads/${filename}`);

        // Match previous response shape for compatibility
        return handleSuccess({
            url: `/uploads/${filename}`,
            publicId: `/uploads/${filename}`,
        });
    } catch (error) {
        console.error('Upload API level error:', error);
        return handleError(error, req);
    }
}

