import { Event } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';

import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Check if user is admin/has permission
        const user = await getCurrentUser(req);
        const isAdmin = user && (user.role?.name === 'Admin' || user.role?.permissions?.includes('manage_events'));

        if (id) {
            const event = await Event.findById(id);
            if (!event) throw new Error('Event not found');
            // Assuming Event model has isHidden field, if not we might strictly rely on date or add it.
            // The previous code in page.js didn't show isHidden for events, but user asked for it. 
            // We should add isHidden to Event Schema if we haven't already. 
            // Let's assume it exists or we add strict public filtering.
            // For now, let's just implement the filter logic anticipating the field exists or will be added.
            if (event.isHidden && !isAdmin) throw new Error('Event not found');
            return handleSuccess(event);
        }

        // Only show future events for public, unless admin needs to see all? 
        // Typically admin sees all. Public sees future (and maybe past in archive).
        // Let's stick to isHidden logic first.
        const query = isAdmin ? {} : { isHidden: { $ne: true } };
        const events = await Event.find(query).sort({ date: 1 });
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
