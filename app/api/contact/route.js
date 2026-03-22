import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactRequest } from "@/models";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";

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
  const formatField = (label, value) => {
    if (!value || value === 'undefined') return '';
    return `
      <tr>
        <td style="padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600; width: 35%; color: #4b5563; vertical-align: top;">${label}</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #eee; color: #111827; vertical-align: top; line-height: 1.5;">${value}</td>
      </tr>`;
  };

  const formattedAddress = [data.address, data.apartment, data.city, data.state, data.zipCode]
      .filter(Boolean)
      .join(', ');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 12px;">
      <div style="background-color: #4f46e5; color: white; padding: 30px 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">New Contact Request</h2>
        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Hossana Community Hub</p>
      </div>

      <div style="background-color: white; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
          You have received a new inquiry from <strong style="color: #111827;">${data.firstName} ${data.lastName}</strong>.
        </p>

        <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; border: 1px solid #eee; font-size: 14px;">
          <tbody>
            ${formatField('Reason for Contact', data.reason)}
            ${formatField('Full Name', `${data.firstName || ''} ${data.lastName || ''}`.trim())}
            ${formatField('Email Address', `<a href="mailto:${data.email}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${data.email}</a>`)}
            ${formatField('Phone Number', data.phone)}
            ${formatField('Location', formattedAddress)}
            ${formatField('Additional Notes', data.notes ? data.notes.replace(/\\n/g, '<br>') : '')}
          </tbody>
        </table>

        <div style="margin-top: 32px; text-align: center;">
          <a href="${siteUrl}/admin/requests" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
            View Details in Dashboard
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
        <p style="margin: 0;">This is an automated message from the HCSEM Contact System.</p>
        <p style="margin: 4px 0 0 0;">Generated on ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
}

// GET method for filtering requests
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const isDeleted = searchParams.get('isDeleted') === 'true';

    const query = {};
    if (isDeleted) {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true }; // Treat missing or false as active
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await ContactRequest.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

// POST method for submitting new requests
export async function POST(req) {
  // Rate limit: max 3 contact form submissions per 5 minutes per IP
  const { success, retryAfter } = rateLimit(req, { limit: 3, windowMs: 5 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

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

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL_PASSWORD) {
      // 1. Notify admins
      await transporter.sendMail({
        from: `"HCSEM" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL_RECEIVER || process.env.ADMIN_EMAIL,
        subject: `New Contact Request: ${contactRequest.reason}`,
        html: htmlContent,
      });

      // 2. Auto-reply to submitter if they provided an email
      if (data.email) {
        await transporter.sendMail({
          from: `"HCSEM" <${process.env.ADMIN_EMAIL}>`,
          to: data.email,
          subject: `We received your request – HCSEM`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
              <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px;border-radius:12px 12px 0 0;text-align:center">
                <h2 style="color:white;margin:0;font-size:22px">Thank You, ${data.first_name}!</h2>
              </div>
              <div style="background:#f9fafb;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
                <p style="font-size:15px;line-height:1.6">We've received your request regarding <strong>${contactRequest.reason}</strong>.</p>
                <p style="font-size:15px;line-height:1.6;color:#6b7280">Our team will review it and get back to you as soon as possible. You can expect a response within 1–3 business days.</p>
                <div style="background:#ede9fe;border-radius:8px;padding:16px;margin:20px 0">
                  <p style="margin:0;font-size:13px;color:#7c3aed;font-weight:600">📋 Request Summary</p>
                  <p style="margin:6px 0 0;font-size:13px;color:#555">Reason: ${contactRequest.reason}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#555">Submitted: ${new Date().toLocaleString()}</p>
                </div>
                <p style="font-size:13px;color:#9ca3af;margin-top:20px">If you have questions, contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#4f46e5">${process.env.ADMIN_EMAIL}</a></p>
              </div>
            </div>`,
        }).catch(err => console.warn('Auto-reply email failed (non-critical):', err.message));
      }
    }

    return NextResponse.json({ success: true, request: contactRequest });
  } catch (error) {
    console.error("Error submitting contact request:", error);
    return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
  }
}

// PUT method for updating status, read state, and soft delete restoration
export async function PUT(req) {
  try {
    await dbConnect();
    const { id, status, read, isDeleted } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (read !== undefined) updateData.read = read;
    if (isDeleted !== undefined) updateData.isDeleted = isDeleted;

    const updatedRequest = await ContactRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Error updating contact request:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}

// DELETE method for soft and hard deletes
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    }

    let result;
    if (force) {
      result = await ContactRequest.findByIdAndDelete(id);
    } else {
      result = await ContactRequest.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }

    if (!result) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: force ? "Permanently deleted" : "Moved to trash" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
  }
}
