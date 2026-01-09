import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactRequest } from "@/models";
import nodemailer from "nodemailer";

// Reuse the transporter setup
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

export async function POST(req) {
    try {
        await dbConnect();
        const { requestId, to, cc, subject, message } = await req.json();

        if (!to || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Send the email
        await transporter.sendMail({
            from: `"HCSEM Admin" <${process.env.ADMIN_EMAIL}>`,
            to,
            cc,
            subject,
            html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    ${message.replace(/\n/g, '<br>')}
                   </div>`,
        });

        // Optionally update the request status to 'reviewed'
        let updatedRequest = null;
        if (requestId) {
            updatedRequest = await ContactRequest.findByIdAndUpdate(
                requestId,
                {
                    status: 'reviewed',
                    read: true,
                    $push: {
                        replies: {
                            sender: 'Admin',
                            message: message,
                            subject: subject
                        }
                    }
                },
                { new: true }
            );
        }

        return NextResponse.json({ success: true, message: "Email sent successfully", data: updatedRequest });
    } catch (error) {
        console.error("Error sending reply email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
