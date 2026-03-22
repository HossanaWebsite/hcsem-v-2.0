import { Blog } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { deleteCloudinaryImages } from '@/lib/cloudinaryHelper';

// Cache blogs for 20 seconds to reduce database load
export const revalidate = 20;

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '0', 10); // 0 = no limit

        // Check if user is admin/has permission
        const user = await getCurrentUser(req);
        const isAdmin = user && (user.role?.name === 'Admin' || user.role?.permissions?.includes('manage_blogs'));

        if (id) {
            const blog = await Blog.findById(id).populate('author', 'fullName').lean();
            if (!blog) throw new Error('Blog not found');
            if (blog.isHidden && !isAdmin) throw new Error('Blog not found'); // Hide from public if hidden
            return handleSuccess(blog);
        }

        const query = isAdmin ? {} : { isHidden: { $ne: true } };
        let blogsQuery = Blog.find(query).sort({ updatedAt: -1 }).populate('author', 'fullName');

        let total = null;
        if (limit > 0) {
            total = await Blog.countDocuments(query);
            blogsQuery = blogsQuery.skip((page - 1) * limit).limit(limit);
        }

        const blogs = await blogsQuery.lean();
        const response = limit > 0
            ? { blogs, page, limit, total, totalPages: Math.ceil(total / limit) }
            : blogs;
        return handleSuccess(response);
    } catch (error) {
        return handleError(error, req);
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const blog = await Blog.create(body);

        await logAction(null, 'CREATE_BLOG', { title: blog.title, id: blog._id }, req);
        return handleSuccess(blog, "Blog created successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) throw new Error('Blog ID is required');

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        await logAction(null, 'UPDATE_BLOG', { title: blog.title, id: blog._id }, req);
        return handleSuccess(blog, "Blog updated successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('Blog ID is required');

        // Fetch the blog first so we can clean up the Cloudinary image
        const blog = await Blog.findById(id);
        if (blog) {
            await deleteCloudinaryImages(blog.coverImage);
        }

        await Blog.findByIdAndDelete(id);

        await logAction(null, 'DELETE_BLOG', { id }, req);
        return handleSuccess({ id }, "Blog deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}

