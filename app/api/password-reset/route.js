import { User } from '@/models';
import dbConnect from '@/lib/db';
import { handleError, handleSuccess } from '@/lib/errorHandler';
import { logAction } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

function buildResetEmailHtml({ fullName, resetUrl, expiresAt }) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">HCSEM Admin System</p>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${fullName}</strong>,</p>
            <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
                An administrator has initiated a password reset for your account.
                Click the button below to set a new password. This link will expire on 
                <strong>${new Date(expiresAt).toLocaleString()}</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" 
                   style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; 
                          text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                    Reset My Password
                </a>
            </div>
            <p style="font-size: 13px; color: #9ca3af; margin: 16px 0 0; line-height: 1.6;">
                If you did not request this, please ignore this email or contact an administrator immediately.
                <br/>Or copy and paste this link: <span style="color: #4f46e5;">${resetUrl}</span>
            </p>
        </div>
    </div>`;
}

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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        let emailSent = false;
        let emailError = null;

        // Send email if SMTP credentials are configured
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL_PASSWORD) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.ADMIN_EMAIL,
                        pass: process.env.ADMIN_EMAIL_PASSWORD,
                    },
                });

                await transporter.sendMail({
                    from: `"HCSEM System" <${process.env.ADMIN_EMAIL}>`,
                    to: user.email,
                    subject: 'Password Reset Request – HCSEM',
                    html: buildResetEmailHtml({
                        fullName: user.fullName,
                        resetUrl,
                        expiresAt: resetExpires,
                    }),
                });

                emailSent = true;
            } catch (err) {
                console.error('Email send failed:', err.message);
                emailError = err.message;
            }
        }

        await logAction(currentUser._id, 'INITIATE_PASSWORD_RESET', { targetUserId: userId, email: user.email, emailSent }, req);

        return handleSuccess({
            message: emailSent
                ? 'Password reset email sent successfully'
                : 'Password reset token generated (email delivery failed or not configured)',
            resetToken,
            resetUrl,
            expiresAt: resetExpires,
            emailSent,
            emailError: emailError || undefined,
            user: {
                email: user.email,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        return handleError(error, req);
    }
}
