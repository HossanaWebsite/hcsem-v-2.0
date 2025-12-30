import { AuditLog } from '@/models';
import dbConnect from '@/lib/db'; // Assuming you have a dbConnect utility

export async function logAction(userId, action, details, req) {
    try {
        await dbConnect();

        let ipAddress = 'unknown';
        if (req) {
            ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
        }

        await AuditLog.create({
            userId,
            action,
            details,
            ipAddress,
        });

        console.log(`[AUDIT] ${action} by ${userId}:`, details);
    } catch (error) {
        console.error("Failed to write audit log:", error);
        // Fail silent on audit log error to not block main flow, but log to console
    }
}
