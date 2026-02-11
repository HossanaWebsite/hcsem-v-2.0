import { User } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return new Response(JSON.stringify({ success: false, error: 'Token and new password are required' }), { status: 400 });
        }

        if (newPassword.length < 6) {
            return new Response(JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }), { status: 400 });
        }

        // Hash the provided token to match against stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid or expired reset token' }), { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.mustChangePassword = false; // Clear force change flag if set
        user.failedLoginAttempts = 0; // Reset failed attempts
        user.accountLocked = false; // Unlock account if locked
        user.lockedUntil = undefined;

        await user.save();

        return handleSuccess({ message: 'Password reset successfully. You can now login with your new password.' });
    } catch (error) {
        return handleError(error, req);
    }
}
