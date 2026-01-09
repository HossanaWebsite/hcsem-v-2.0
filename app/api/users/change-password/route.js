import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { logAction } from '@/lib/logger';

export async function POST(req) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser(req);
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { password } = await req.json();

        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(currentUser._id, {
            password: hashedPassword,
            mustChangePassword: false
        });

        await logAction(currentUser._id, 'CHANGE_PASSWORD', { userId: currentUser._id }, req);

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password Change Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
