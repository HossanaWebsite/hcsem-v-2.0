import dbConnect from '@/lib/db';
import { User, Event, Blog, AuditLog } from '@/models';
import { getCurrentUser } from '@/lib/auth';
import { handleError, handleSuccess } from '@/lib/errorHandler';

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');
        const scope = searchParams.get('scope') || 'all'; // 'all', 'admin', 'public'

        if (!query || query.length < 2) {
            return handleSuccess([], "Query too short");
        }

        const currentUser = await getCurrentUser(req);
        const isAdmin = currentUser?.role?.permissions?.includes('manage_users') ||
            currentUser?.role?.permissions?.includes('view_audit_log'); // Simple check

        const results = [];
        const regex = new RegExp(query, 'i');

        // Parallel search promises
        const searchPromises = [];

        // 1. Users (Admin Only)
        if (isAdmin && (scope === 'all' || scope === 'admin')) {
            searchPromises.push(
                User.find({
                    $or: [
                        { fullName: regex },
                        { email: regex }
                    ]
                }).limit(5).select('fullName email avatar role').lean()
                    .then(users => users.map(u => ({ ...u, type: 'user', url: `/admin/users?id=${u._id}` })))
            );
        }

        // 2. Audit Logs (Admin Only)
        if (isAdmin && (scope === 'all' || scope === 'admin')) {
            searchPromises.push(
                AuditLog.find({
                    $or: [
                        { action: regex },
                        { ipAddress: regex }
                    ]
                }).limit(5).sort({ timestamp: -1 }).lean()
                    .then(logs => logs.map(l => ({ ...l, type: 'audit_log', title: `${l.action} - ${new Date(l.timestamp).toLocaleDateString()}`, url: `/admin/logs` })))
            );
        }

        // 3. Events (Public)
        if (scope === 'all' || scope === 'public') {
            searchPromises.push(
                Event.find({
                    $or: [
                        { title: regex },
                        { description: regex },
                        { location: regex }
                    ],
                    isHidden: false
                }).limit(5).select('title description slug coverImage date').lean()
                    .then(events => events.map(e => ({ ...e, type: 'event', url: `/events/${e.slug}` }))) // Assuming slugs or IDs
            );
        }

        // 4. Blogs (Public)
        if (scope === 'all' || scope === 'public') {
            searchPromises.push(
                Blog.find({
                    $or: [
                        { title: regex },
                        { summary: regex }
                    ],
                    isHidden: false
                }).limit(5).select('title summary slug coverImage publishedAt').lean()
                    .then(blogs => blogs.map(b => ({ ...b, type: 'blog', url: `/blog/${b.slug}` })))
            );
        }

        // 5. Site Content (About Page, etc.)
        if (scope === 'all' || scope === 'public') {
            const SiteSettings = (await import('@/models')).SiteSettings;
            searchPromises.push(
                SiteSettings.findOne({
                    $or: [
                        { 'aboutPageTitle.en': regex }, { 'aboutPageTitle.am': regex },
                        { 'aboutMission.en': regex }, { 'aboutMission.am': regex },
                        { 'aboutVision.en': regex }, { 'aboutVision.am': regex },
                        { 'aboutPageSubtitle.en': regex }, { 'aboutPageSubtitle.am': regex }
                    ]
                }).lean().then(settings => {
                    if (!settings) return [];
                    // Return a generic result pointing to About Page if found
                    // Logic: if query matches any part, return the page.
                    // We can't really "highlight" the match easily without more logic, but user just wants it "functional".
                    return [{
                        _id: settings._id,
                        title: settings.aboutPageTitle?.en || "About HCSEM",
                        description: "About Page Content",
                        type: 'page',
                        url: '/about'
                    }];
                })
            );
        }

        // Execute all
        const searchResults = await Promise.all(searchPromises);

        // Flatten array
        const flatResults = searchResults.flat();

        return handleSuccess(flatResults);

    } catch (error) {
        return handleError(error, req);
    }
}
