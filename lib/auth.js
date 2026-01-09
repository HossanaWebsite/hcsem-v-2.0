import { jwtVerify } from 'jose';
import { User } from '@/models';
import dbConnect from '@/lib/db';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function getCurrentUser(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return null;

        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });

        if (!payload || !payload.userId) return null;

        // Validation to prevent CastErrors
        const userIdStr = String(payload.userId);
        if (userIdStr === '[object Object]' || !/^[0-9a-fA-F]{24}$/.test(userIdStr)) {
            console.warn("Invalid userId in token payload:", payload.userId);
            return null;
        }

        await dbConnect();
        // Explicitly populate role to check permissions
        const user = await User.findById(userIdStr).populate('role');
        return user;
    } catch (error) {
        console.error("Auth Error:", error);
        return null;
    }
}

export async function hasPermission(req, requiredPermission) {
    const user = await getCurrentUser(req);
    if (!user) return false;

    // Admin super-override (optional, but good practice)
    if (user.role?.name === 'Admin') return true;

    // View Only Check
    // If the user has a role that includes "view_only" AND the request is mutating data
    // we should block it. 
    // OR we can check for specific permissions like "manage_users".

    if (!user.role || !user.role.permissions) return false;

    return user.role.permissions.includes(requiredPermission);
}


export function isSafeMethod(req) {
    return ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
}

export async function signToken(payload) {
    const { SignJWT } = await import('jose');
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}
