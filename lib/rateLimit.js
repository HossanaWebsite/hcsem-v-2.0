/**
 * Simple in-memory IP-based rate limiter.
 * Uses a Map to track request counts and timestamps per IP.
 * Resets the window after `windowMs` milliseconds.
 */

const ipStore = new Map();

/**
 * @param {Request} req - The incoming Next.js request
 * @param {Object} options
 * @param {number} options.limit - Max requests per window
 * @param {number} options.windowMs - Window duration in ms
 * @returns {{ success: boolean, retryAfter?: number }}
 */
export function rateLimit(req, { limit = 5, windowMs = 60 * 1000 } = {}) {
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';

    const key = `${ip}`;
    const now = Date.now();
    const entry = ipStore.get(key);

    if (!entry || now > entry.resetAt) {
        // New window
        ipStore.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true };
    }

    if (entry.count >= limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return { success: false, retryAfter };
    }

    entry.count += 1;
    return { success: true };
}
