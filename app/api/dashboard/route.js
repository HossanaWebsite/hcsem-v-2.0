import { User, Blog, Event, ContactRequest, Subscriber } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';

export async function GET(req) {
    try {
        await dbConnect();

        const [userCount, blogCount, eventCount, contactCount, subscriberCount, recentActivity] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments({ isHidden: false }),
            Event.countDocuments({ isHidden: false }),
            ContactRequest.countDocuments({ read: false }),
            Subscriber.countDocuments({ active: true }),
            import('@/models').then(m => m.AuditLog.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'fullName email').lean())
        ]);

        return handleSuccess({
            users: userCount,
            blogs: blogCount,
            events: eventCount,
            messages: contactCount,
            subscribers: subscriberCount,
            recentActivity: recentActivity || []
        });
    } catch (error) {
        return handleError(error, req);
    }
}
