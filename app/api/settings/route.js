import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { SiteSettings } from '@/models';
import fs from 'fs/promises';
import path from 'path';

// Cache settings for 30 seconds to reduce database load
export const revalidate = 30;

// Helper to read fallback JSON
async function getFallbackSettings() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'settings.json');
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading fallback settings:', error);
        return null;
    }
}

// Helper to write to fallback JSON
async function updateFallbackSettings(settings) {
    try {
        const filePath = path.join(process.cwd(), 'data', 'settings.json');
        await fs.writeFile(filePath, JSON.stringify(settings, null, 4), 'utf8');
    } catch (error) {
        console.error('Error writing fallback settings:', error);
    }
}

export async function GET() {
    try {
        await dbConnect();

        // Fetch fallback first
        const fallback = await getFallbackSettings();

        // Try to fetch from DB with .lean() for faster JSON serialization
        let settings = await SiteSettings.findOne().sort({ updatedAt: -1 }).lean();

        if (!settings) {
            console.log('No settings in DB, using fallback');
            return NextResponse.json(fallback || {
                heroTitle: "HCSEM",
                heroSubtitle: "Building community.\nPreserving culture.",
            });
        }

        return NextResponse.json(settings);

    } catch (error) {
        console.error('Database connection failed, using fallback:', error);
        const fallback = await getFallbackSettings();
        if (fallback) {
            return NextResponse.json(fallback);
        }
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        await dbConnect();

        let settings = await SiteSettings.findOne();

        if (settings) {
            // Dynamically update fields from body
            Object.keys(body).forEach(key => {
                if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
                    settings[key] = body[key];
                }
            });
            settings.updatedAt = new Date();
            await settings.save();
        } else {
            settings = await SiteSettings.create(body);
        }

        // Sync everything back to JSON file for fallback
        const plainSettings = settings.toObject();
        delete plainSettings._id;
        delete plainSettings.__v;
        await updateFallbackSettings(plainSettings);

        return NextResponse.json({ message: 'Settings updated successfully', settings });

    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
