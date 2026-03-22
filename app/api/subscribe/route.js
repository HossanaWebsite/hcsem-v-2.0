import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Subscriber } from '@/models';
import { getCurrentUser } from '@/lib/auth';
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

// GET /api/subscribe — List ALL subscribers (admin only)
export async function GET(req) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const subscribers = await Subscriber.find({})
            .sort({ subscribedAt: -1 })
            .lean();
        return NextResponse.json({ success: true, data: subscribers, total: subscribers.length });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subscribers.' }, { status: 500 });
    }
}

// PUT /api/subscribe — Toggle active state (admin only)
export async function PUT(req) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, active } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await Subscriber.findByIdAndUpdate(id, { active });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subscriber.' }, { status: 500 });
    }
}

// DELETE /api/subscribe — Remove subscriber (admin) or unsubscribe by email (public)
export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const email = searchParams.get('email');

        if (id) {
            // Admin hard delete by ID
            const currentUser = await getCurrentUser(req);
            if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            await Subscriber.findByIdAndDelete(id);
        } else if (email) {
            // Public unsubscribe by email
            await Subscriber.findOneAndUpdate({ email: email.toLowerCase() }, { active: false });
        } else {
            return NextResponse.json({ error: 'ID or email is required.' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Done.' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Failed.' }, { status: 500 });
    }
}
