import { User } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const currentUser = await getCurrentUser(req);
        if (!currentUser) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        }

        if (id) {
            // Handle 'me' context for current user
            if (id === 'me') {
                return handleSuccess(currentUser);
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Invalid ID format'
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            const user = await User.findById(id).populate('role');
            if (!user) throw new Error('User not found');
            return handleSuccess(user);
        }

        const users = await User.find().select('-password').populate('role');
        return handleSuccess(users);
    } catch (error) {
        return handleError(error, req);
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_users')) {
            return new Response(JSON.stringify({ success: false, error: 'Forbidden: You do not have permission to create users.' }), { status: 403 });
        }

        const body = await req.json();
        const { password, ...userData } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ ...userData, password: hashedPassword, mustChangePassword: body.mustChangePassword });
        await user.populate('role');

        await logAction(currentUser._id, 'CREATE_USER', { email: user.email, id: user._id }, req);
        return handleSuccess({ fullName: user.fullName, email: user.email, role: user.role }, "User created successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_users')) {
            return new Response(JSON.stringify({ success: false, error: 'Forbidden: You do not have permission to update users.' }), { status: 403 });
        }

        const body = await req.json();
        const { id, password, ...updateData } = body;

        if (!id) throw new Error('User ID is required');

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password').populate('role');

        await logAction(currentUser._id, 'UPDATE_USER', { email: user.email, id: user._id }, req);
        return handleSuccess(user, "User updated successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_users')) {
            return new Response(JSON.stringify({ success: false, error: 'Forbidden: You do not have permission to delete users.' }), { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('User ID is required');

        await User.findByIdAndDelete(id);

        await logAction(currentUser._id, 'DELETE_USER', { id }, req);
        return handleSuccess({ id }, "User deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}
