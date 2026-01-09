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

    const requests = await ContactRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

// POST method for submitting new requests
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
