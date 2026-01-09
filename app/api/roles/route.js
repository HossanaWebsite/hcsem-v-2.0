import { Role } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        }

        const roles = await Role.find();
        return handleSuccess(roles);
    } catch (error) {
        return handleError(error, req);
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_roles')) {
            // Fallback to manage_users if manage_roles not yet defined in specific role
            if (!currentUser?.role?.permissions?.includes('manage_users')) {
                return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403 });
            }
        }

        const body = await req.json();
        const role = await Role.create(body);
        await logAction(currentUser._id, 'CREATE_ROLE', { name: role.name, id: role._id }, req);
        return handleSuccess(role, "Role created successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_roles')) {
            if (!currentUser?.role?.permissions?.includes('manage_users')) {
                return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403 });
            }
        }

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) throw new Error('Role ID is required');

        const role = await Role.findByIdAndUpdate(id, updateData, { new: true });
        if (!role) throw new Error('Role not found');

        await logAction(currentUser._id, 'UPDATE_ROLE', { name: role.name, id: role._id }, req);
        return handleSuccess(role, "Role updated successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser || !currentUser.role?.permissions?.includes('manage_roles')) {
            if (!currentUser?.role?.permissions?.includes('manage_users')) {
                return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403 });
            }
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('Role ID is required');

        const role = await Role.findByIdAndDelete(id);
        if (!role) throw new Error('Role not found');

        await logAction(currentUser._id, 'DELETE_ROLE', { name: role.name, id }, req);
        return handleSuccess({ id }, "Role deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}
