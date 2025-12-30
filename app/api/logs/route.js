import { AuditLog } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 50;

        const logs = await AuditLog.find()
            .populate('userId', 'fullName email')
            .sort({ timestamp: -1 })
            .limit(limit);

        return handleSuccess(logs);
    } catch (error) {
        return handleError(error, req);
    }
}
