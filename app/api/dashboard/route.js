import { User, Blog, Event, ContactRequest } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';

export async function GET(req) {
    try {
        await dbConnect();

        const [userCount, blogCount, eventCount, contactCount, recentActivity] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments(),
            Event.countDocuments(),
            ContactRequest.countDocuments({ read: false }),
            import('@/models').then(m => m.AuditLog.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'fullName email'))
        ]);

        return handleSuccess({
            users: userCount,
            blogs: blogCount,
            events: eventCount,
            messages: contactCount,
            recentActivity: recentActivity || []
        });
    } catch (error) {
        return handleError(error, req);
    }
}
