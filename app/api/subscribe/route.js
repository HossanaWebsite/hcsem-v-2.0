import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Subscriber } from '@/models';
import { rateLimit } from '@/lib/rateLimit';

// POST /api/subscribe — Subscribe to newsletter
export async function POST(req) {
    const { success, retryAfter } = rateLimit(req, { limit: 3, windowMs: 5 * 60 * 1000 });
    if (!success) {
        return NextResponse.json(
            { error: `Too many requests. Try again in ${retryAfter} seconds.` },
            { status: 429 }
        );
    }

    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
        }

        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) {
            if (!existing.active) {
                existing.active = true;
                await existing.save();
                return NextResponse.json({ success: true, message: 'You have been re-subscribed!' });
            }
            return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 });
        }

        await Subscriber.create({ email: email.toLowerCase() });
        return NextResponse.json({ success: true, message: 'Subscribed successfully! Thank you.' });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
    }
}

// DELETE /api/subscribe — Unsubscribe
export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        await Subscriber.findOneAndUpdate(
            { email: email.toLowerCase() },
            { active: false }
        );

        return NextResponse.json({ success: true, message: 'You have been unsubscribed.' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Failed to unsubscribe.' }, { status: 500 });
    }
}

// GET /api/subscribe — List subscribers (admin only)
export async function GET() {
    try {
        await dbConnect();
        const subscribers = await Subscriber.find({ active: true })
            .sort({ subscribedAt: -1 })
            .lean();
        return NextResponse.json({ success: true, data: subscribers, total: subscribers.length });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subscribers.' }, { status: 500 });
    }
}
