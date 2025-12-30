import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactRequest } from "@/models";
import nodemailer from "nodemailer";

// Set up SMTP transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

// Generate HTML email template
function generateContactRequestHTML(data) {
    const tableRows = Object.entries(data).map(([key, value]) => {
        const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

        return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">${label}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${value || ''}</td>
      </tr>`;
    });

    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="background-color: #004085; color: white; padding: 10px 15px; border-radius: 5px;">
       HCSEM - New Contact Request
      </h2>

      <p style="margin: 20px 0;">You have received a new contact request. See the details below:</p>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ccc;">Field</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #ccc;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join("")}
        </tbody>
      </table>

      <p style="margin-top: 30px; font-size: 14px; color: #888;">
        This message was sent automatically from the HCSEM contact request system.
      </p>
    </div>
  `;
}

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        // Create contact request in database
        const contactRequest = await ContactRequest.create({
            reason: data.selectedReason === "Other" ? data.customReason : data.selectedReason,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            address: data.Address,
            apartment: data.company_name,
            city: data.city,
            state: data.state,
            zipCode: data.zip,
            notes: data.form_order_notes,
        });

        const htmlContent = generateContactRequestHTML(contactRequest.toObject());

        // Send email notification if credentials are configured
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL_PASSWORD) {
            await transporter.sendMail({
                from: `"HCSEM" <${process.env.ADMIN_EMAIL}>`,
                to: process.env.ADMIN_EMAIL_RECEIVER || process.env.ADMIN_EMAIL,
                subject: `New Contact Request: ${contactRequest.reason}`,
                html: htmlContent,
            });
        }

        return NextResponse.json({ success: true, request: contactRequest });
    } catch (error) {
        console.error("Error submitting contact request:", error);
        return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
    }
}
