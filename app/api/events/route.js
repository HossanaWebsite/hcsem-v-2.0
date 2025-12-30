import { Event } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const event = await Event.findById(id);
            if (!event) throw new Error('Event not found');
            return handleSuccess(event);
        }

        const events = await Event.find().sort({ date: 1 }); // Sort by upcoming
        return handleSuccess(events);
    } catch (error) {
        return handleError(error, req);
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const event = await Event.create(body);

        await logAction(null, 'CREATE_EVENT', { title: event.title, id: event._id }, req);
        return handleSuccess(event, "Event created successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) throw new Error('Event ID is required');

        const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

        await logAction(null, 'UPDATE_EVENT', { title: event.title, id: event._id }, req);
        return handleSuccess(event, "Event updated successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('Event ID is required');

        await Event.findByIdAndDelete(id);

        await logAction(null, 'DELETE_EVENT', { id }, req);
        return handleSuccess({ id }, "Event deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}
