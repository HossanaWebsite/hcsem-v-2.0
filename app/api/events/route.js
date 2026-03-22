import { Event } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import { deleteCloudinaryImages } from '@/lib/cloudinaryHelper';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '0', 10); // 0 = no limit

        // Check if user is admin/has permission
        const user = await getCurrentUser(req);
        const isAdmin = user && (user.role?.name === 'Admin' || user.role?.permissions?.includes('manage_events'));

        if (id) {
            const event = await Event.findById(id).lean();
            if (!event) throw new Error('Event not found');
            if (event.isHidden && !isAdmin) throw new Error('Event not found');
            return handleSuccess(event);
        }

        const query = isAdmin ? {} : { isHidden: { $ne: true } };
        let eventsQuery = Event.find(query).sort({ date: 1 });

        let total = null;
        if (limit > 0) {
            total = await Event.countDocuments(query);
            eventsQuery = eventsQuery.skip((page - 1) * limit).limit(limit);
        }

        const events = await eventsQuery.lean();
        const response = limit > 0
            ? { events, page, limit, total, totalPages: Math.ceil(total / limit) }
            : events;
        return handleSuccess(response);
    } catch (error) {
        return handleError(error, req);
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const body = await req.json();
        const event = await Event.create(body);

        await logAction(currentUser._id, 'CREATE_EVENT', { title: event.title, id: event._id }, req);
        return handleSuccess(event, "Event created successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) throw new Error('Event ID is required');

        const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

        await logAction(currentUser._id, 'UPDATE_EVENT', { title: event.title, id: event._id }, req);
        return handleSuccess(event, "Event updated successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('Event ID is required');

        // Fetch event first to delete Cloudinary images (cover + gallery)
        const event = await Event.findById(id);
        if (event) {
            const imagesToDelete = [event.coverImage, ...(event.gallery || [])].filter(Boolean);
            await deleteCloudinaryImages(imagesToDelete);
        }

        await Event.findByIdAndDelete(id);

        await logAction(currentUser._id, 'DELETE_EVENT', { id }, req);
        return handleSuccess({ id }, "Event deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}
