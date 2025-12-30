import { SiteSettings } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        const settings = await SiteSettings.findOne(); // Singleton
        return handleSuccess(settings || {});
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Upsert the single settings document
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings(body);
        } else {
            Object.assign(settings, body);
        }

        settings.updatedAt = new Date();
        await settings.save();

        await logAction(null, 'UPDATE_SETTINGS', body, req); // Pass specific user ID if auth context available in req

        return handleSuccess(settings);
    } catch (error) {
        return handleError(error, req);
    }
}
