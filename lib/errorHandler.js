import { NextResponse } from 'next/server';
import { logAction } from './logger';

export function handleError(error, req) {
    console.error("API Error:", error);

    // Provide a safe fallback if DB fails
    return NextResponse.json(
        {
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
    );
}

export function handleSuccess(data, message = "Success") {
    return NextResponse.json(
        { success: true, message, data },
        { status: 200 }
    );
}
