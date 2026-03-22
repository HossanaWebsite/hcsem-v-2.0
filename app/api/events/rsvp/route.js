import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models';
import { rateLimit } from '@/lib/rateLimit';

// POST /api/events/rsvp — Register for an event
export async function POST(req) {
    // Rate limit: max 5 RSVPs per minute per IP
    const { success, retryAfter } = rateLimit(req, { limit: 5, windowMs: 60 * 1000 });
    if (!success) {
        return NextResponse.json(
            { error: `Too many requests. Please try again in ${retryAfter} seconds.` },
            { status: 429 }
        );
    }

    try {
        await dbConnect();
        const { eventId, name, email } = await req.json();

        if (!eventId || !name || !email) {
            return NextResponse.json({ error: 'eventId, name, and email are required.' }, { status: 400 });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
        }

        // Prevent duplicate RSVPs from same email
        const alreadyRsvped = event.rsvps.some(
            (r) => r.email.toLowerCase() === email.toLowerCase()
        );
        if (alreadyRsvped) {
            return NextResponse.json({ error: 'You have already RSVP\'d to this event.' }, { status: 409 });
        }

        event.rsvps.push({ name, email });
        await event.save();

        return NextResponse.json({
            success: true,
            message: 'RSVP confirmed!',
            rsvpCount: event.rsvps.length,
        });
    } catch (error) {
        console.error('RSVP error:', error);
        return NextResponse.json({ error: 'Failed to process RSVP.' }, { status: 500 });
    }
}

// DELETE /api/events/rsvp — Cancel RSVP
export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get('eventId');
        const email = searchParams.get('email');

        if (!eventId || !email) {
            return NextResponse.json({ error: 'eventId and email are required.' }, { status: 400 });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
        }

        event.rsvps = event.rsvps.filter(
            (r) => r.email.toLowerCase() !== email.toLowerCase()
        );
        await event.save();

        return NextResponse.json({
            success: true,
            message: 'RSVP cancelled.',
            rsvpCount: event.rsvps.length,
        });
    } catch (error) {
        console.error('Cancel RSVP error:', error);
        return NextResponse.json({ error: 'Failed to cancel RSVP.' }, { status: 500 });
    }
}
