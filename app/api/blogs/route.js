import { Blog } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const blog = await Blog.findById(id).populate('author', 'fullName');
            if (!blog) throw new Error('Blog not found');
            return handleSuccess(blog);
        }

        const blogs = await Blog.find().sort({ updatedAt: -1 }).populate('author', 'fullName');
        return handleSuccess(blogs);
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

        await Blog.findByIdAndDelete(id);

        await logAction(null, 'DELETE_BLOG', { id }, req);
        return handleSuccess({ id }, "Blog deleted successfully");
    } catch (error) {
        return handleError(error, req);
    }
}
