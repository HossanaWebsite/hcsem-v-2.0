import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Subscriber } from '@/models';
import nodemailer from 'nodemailer';
import { getCurrentUser } from '@/lib/auth';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

// POST /api/newsletter — Admin sends a mass email to all active subscribers
export async function POST(req) {
    try {
        await dbConnect();

        // Auth check — only admins can send newsletters
        const user = await getCurrentUser(req);
        if (!user || !(user.role?.name === 'Admin' || user.role?.permissions?.includes('manage_content'))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subject, body } = await req.json();
        if (!subject || !body) {
            return NextResponse.json({ error: 'Subject and body are required.' }, { status: 400 });
        }

        const subscribers = await Subscriber.find({ active: true }).lean();
        if (subscribers.length === 0) {
            return NextResponse.json({ error: 'No active subscribers found.' }, { status: 400 });
        }

        const emails = subscribers.map((s) => s.email);

        // Send all emails — use BCC for privacy
        await transporter.sendMail({
            from: `"HCSEM Community" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            bcc: emails,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="background-color: #004085; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        HCSEM Community Newsletter
                    </h2>
                    <div style="line-height: 1.8; font-size: 15px;">
                        ${body}
                    </div>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        You are receiving this because you subscribed to HCSEM community updates.<br/>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/subscribe?email=EMAIL" style="color: #999;">Unsubscribe</a>
                    </p>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: `Newsletter sent to ${emails.length} subscriber${emails.length !== 1 ? 's' : ''}.`,
            count: emails.length,
        });
    } catch (error) {
        console.error('Newsletter send error:', error);
        return NextResponse.json({ error: 'Failed to send newsletter.' }, { status: 500 });
    }
}
