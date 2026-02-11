import { User } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return new Response(JSON.stringify({ success: false, error: 'Current password and new password are required' }), { status: 400 });
        }

        if (newPassword.length < 6) {
            return new Response(JSON.stringify({ success: false, error: 'New password must be at least 6 characters' }), { status: 400 });
        }

        // Get user with password field
        const user = await User.findById(currentUser._id).select('+password');

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ success: false, error: 'Current password is incorrect' }), { status: 400 });
        }

        // Hash and update new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false; // Clear force change flag if set
        await user.save();

        return handleSuccess({ message: 'Password changed successfully' });
    } catch (error) {
        return handleError(error, req);
    }
}
