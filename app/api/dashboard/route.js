import { User, Blog, Event, ContactRequest } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';

export async function GET(req) {
    try {
        await dbConnect();

        const [userCount, blogCount, eventCount, contactCount] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments(),
            Event.countDocuments(),
            ContactRequest.countDocuments(),
        ]);

        // Can add more complex stats here (e.g., recent activity)

        return handleSuccess({
            users: userCount,
            blogs: blogCount,
            events: eventCount,
            messages: contactCount
        });
    } catch (error) {
        return handleError(error, req);
    }
}
