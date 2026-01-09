import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { handleError, handleSuccess } from '@/lib/errorHandler';

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get('file');

        if (!file) {
            throw new Error('No file uploaded');
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to public/uploads directory
        // Ensure unique filename slightly
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const uploadDir = join(process.cwd(), 'public/uploads');
        // Ensure directory exists
        const { mkdir } = require('fs/promises');
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        return handleSuccess({ url: `/uploads/${filename}` });
    } catch (error) {
        return handleError(error, req);
    }
}
