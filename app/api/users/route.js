import { User } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import bcrypt from 'bcryptjs';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const user = await User.findById(id);
            if (!user) throw new Error('User not found');
            return handleSuccess(user);
        }

        const users = await User.find().select('-password'); // Exclude password
        return handleSuccess(users);
    } catch (error) {
        return handleError(error, req);
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { password, ...userData } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ ...userData, password: hashedPassword });

        await logAction(null, 'CREATE_USER', { email: user.email, id: user._id }, req);
        return handleSuccess({ fullName: user.fullName, email: user.email, role: user.role }, "User created successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, password, ...updateData } = body;

        if (!id) throw new Error('User ID is required');

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        await logAction(null, 'UPDATE_USER', { email: user.email, id: user._id }, req);
        return handleSuccess(user, "User updated successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('User ID is required');

        await User.findByIdAndDelete(id);

        await logAction(null, 'DELETE_USER', { id }, req);
        return handleSuccess({ id }, "User deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}
