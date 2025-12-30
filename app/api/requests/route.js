import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { MembershipRequest } from '@/models';

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        const membershipRequest = await MembershipRequest.create(data);

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
