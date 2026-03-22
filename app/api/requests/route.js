import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { MembershipRequest } from '@/models';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        const membershipRequest = await MembershipRequest.create(data);

        // 1. Email the admin about new request
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL_PASSWORD) {
            transporter.sendMail({
                from: `"HCSEM" <${process.env.ADMIN_EMAIL}>`,
                to: process.env.ADMIN_EMAIL_RECEIVER || process.env.ADMIN_EMAIL,
                subject: `New ${data.requestType || 'Membership'} Request from ${data.firstName} ${data.lastName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="background: #004085; color: white; padding: 10px; border-radius: 5px;">
                            New ${data.requestType || 'Membership'} Request
                        </h2>
                        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                        <p><strong>City:</strong> ${data.city || 'N/A'}, ${data.state || ''}</p>
                        <p><strong>Message:</strong> ${data.message || 'N/A'}</p>
                        <p style="margin-top: 20px; color: #888; font-size: 13px;">
                            Log in to the admin panel to review and respond to this request.
                        </p>
                    </div>
                `,
            }).catch(console.error);

            // 2. Send confirmation to the applicant
            if (data.email) {
                transporter.sendMail({
                    from: `"HCSEM Community" <${process.env.ADMIN_EMAIL}>`,
                    to: data.email,
                    subject: 'We received your request — HCSEM',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="background: #004085; color: white; padding: 10px; border-radius: 5px;">
                                Thank you, ${data.firstName}!
                            </h2>
                            <p>We have received your <strong>${data.requestType || 'membership'}</strong> request and will review it shortly.</p>
                            <p>We will get back to you at <strong>${data.email}</strong> once a decision has been made.</p>
                            <p>Thank you for your interest in the HCSEM community!</p>
                        </div>
                    `,
                }).catch(console.error);
            }
        }

        return NextResponse.json({ success: true, request: membershipRequest });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const requests = await MembershipRequest.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ requests });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/requests — Admin approves or rejects a membership request
export async function PUT(request) {
    try {
        await dbConnect();
        const { id, status } = await request.json();

        if (!id || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const updated = await MembershipRequest.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

        // Email the applicant about the decision
        if (updated.email && process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL_PASSWORD) {
            const isApproved = status === 'approved';
            transporter.sendMail({
                from: `"HCSEM Community" <${process.env.ADMIN_EMAIL}>`,
                to: updated.email,
                subject: isApproved
                    ? 'Welcome to HCSEM Community! 🎉'
                    : 'Update on your HCSEM application',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="background: ${isApproved ? '#28a745' : '#dc3545'}; color: white; padding: 10px; border-radius: 5px;">
                            ${isApproved ? '🎉 Application Approved!' : 'Application Update'}
                        </h2>
                        <p>Dear ${updated.firstName},</p>
                        ${isApproved
                            ? '<p>We are delighted to inform you that your application has been <strong>approved</strong>. Welcome to the HCSEM community!</p><p>We look forward to seeing you at our upcoming events and activities.</p>'
                            : '<p>After careful review, we regret that we are unable to approve your application at this time.</p><p>Please feel free to contact us if you have any questions.</p>'
                        }
                        <p style="margin-top: 20px; color: #888; font-size: 13px;">
                            HCSEM Community Team
                        </p>
                    </div>
                `,
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, request: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

