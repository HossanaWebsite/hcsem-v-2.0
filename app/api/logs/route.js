import { AuditLog } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
    try {
        await dbConnect();

        // Auth guard — only admins should see audit logs
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const action = searchParams.get('action'); // optional filter by action type

        const query = action ? { action } : {};

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .populate('userId', 'fullName email')
                .sort({ timestamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(query),
        ]);

        return handleSuccess({
            logs,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return handleError(error, req);
    }
}
