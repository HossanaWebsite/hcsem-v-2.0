import { User } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_users')) {
            return new Response(JSON.stringify({ success: false, error: 'Forbidden: You do not have permission to reset passwords.' }), { status: 403 });
        }

        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: 'User ID is required' }), { status: 400 });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token expiry to 24 hours from now
        const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Update user with reset token
        const user = await User.findByIdAndUpdate(
            userId,
            {
                passwordResetToken: hashedToken,
                passwordResetExpires: resetExpires,
            },
            { new: true }
        ).select('email fullName');

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
        }

        await logAction(currentUser._id, 'INITIATE_PASSWORD_RESET', { targetUserId: userId, email: user.email }, req);

        // In a production environment, you would send an email here
        // For now, return the token for manual delivery
        return handleSuccess({
            message: 'Password reset initiated',
            resetToken, // In production, this would be sent via email
            resetUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
            expiresAt: resetExpires,
            user: {
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        return handleError(error, req);
    }
}
