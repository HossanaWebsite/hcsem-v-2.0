import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        const user = await User.findOne({ email }).select('+password').populate('role');

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check if account is locked
        if (user.accountLocked) {
            // Check if lock has expired
            if (user.lockedUntil && user.lockedUntil > new Date()) {
                const minutesRemaining = Math.ceil((user.lockedUntil - new Date()) / (1000 * 60));
                return NextResponse.json({
                    error: `Account is locked. Try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`
                }, { status: 403 });
            } else {
                // Lock has expired, unlock the account
                user.accountLocked = false;
                user.lockedUntil = null;
                user.failedLoginAttempts = 0;
                await user.save();
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Increment failed login attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.failedLoginAttempts >= 5) {
                user.accountLocked = true;
                user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                await user.save();
                return NextResponse.json({
                    error: 'Account locked due to too many failed login attempts. Try again in 30 minutes.'
                }, { status: 403 });
            }

            await user.save();
            return NextResponse.json({
                error: `Invalid credentials. ${5 - user.failedLoginAttempts} attempt${5 - user.failedLoginAttempts !== 1 ? 's' : ''} remaining.`
            }, { status: 401 });
        }

        // Successful login - reset failed attempts and update last login
        user.failedLoginAttempts = 0;
        user.lastLogin = new Date();
        user.accountLocked = false;
        user.lockedUntil = null;
        await user.save();

        // Create JWT
        // Ensure userId is a primitive string to avoid Buffer serialization issues
        const userId = String(user._id);
        const token = await signToken({ userId, email: user.email, role: user.role });

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({ success: true, user: { email: user.email, fullName: user.fullName, role: user.role, mustChangePassword: user.mustChangePassword } });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
