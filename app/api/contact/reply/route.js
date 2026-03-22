import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ContactRequest } from '@/models';
import { getCurrentUser } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { logAction } from '@/lib/logger';

export async function POST(req) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser(req);
        if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, message, to } = await req.json();
        if (!id || !message) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

        const contactRequest = await ContactRequest.findById(id);
        if (!contactRequest) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

        // Store reply in DB
        contactRequest.replies.push({ sender: 'admin', message, createdAt: new Date() });
        contactRequest.status = 'reviewed';
        await contactRequest.save();

        // Send email if we have recipient email and SMTP credentials
        if (to && process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL_PASSWORD) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_EMAIL_PASSWORD },
            });

            await transporter.sendMail({
                from: `"HCSEM" <${process.env.ADMIN_EMAIL}>`,
                to,
                subject: `Re: Your request – ${contactRequest.reason}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
                        <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px;border-radius:12px 12px 0 0;text-align:center">
                            <h2 style="color:white;margin:0">HCSEM Response</h2>
                        </div>
                        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
                            <p>Hello ${contactRequest.firstName},</p>
                            <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
                            <p style="color:#9ca3af;font-size:13px">This is a response to your request regarding: <strong>${contactRequest.reason}</strong></p>
                        </div>
                    </div>`,
            });
        }

        await logAction(currentUser._id, 'REPLY_CONTACT', { contactId: id, to }, req);

        return NextResponse.json({ success: true, message: 'Reply sent' });
    } catch (error) {
        console.error('Reply error:', error);
        return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
}
