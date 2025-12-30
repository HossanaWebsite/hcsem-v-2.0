import mongoose from 'mongoose';

// --- Site Settings Model (Hero/Banner Images, etc.) ---
const SiteSettingsSchema = new mongoose.Schema({
    heroImage: {
        type: String,
        default: '/images/hero-bg.png', // Default placeholder
    },
    heroTitle: String,
    heroSubtitle: String,
    // Add other global settings here as needed (e.g., footer text, social links)
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

// --- Audit Log Model ---
const AuditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    action: {
        type: String, // e.g., 'CREATE_BLOG', 'UPDATE_SETTINGS'
        required: true,
    },
    details: mongoose.Schema.Types.Mixed, // flexible object for details
    ipAddress: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

// --- User Model ---
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false, // Don't return password by default
    },
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'user'],
        default: 'user',
    },
    avatar: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// --- Blog Model ---
const BlogBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'image', 'split', 'table'],
        required: true,
    },
    content: mongoose.Schema.Types.Mixed, // Flexible data based on type
    order: Number,
});

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug'],
        unique: true,
    },
    summary: String,
    coverImage: String,
    blocks: [BlogBlockSchema], // The flexible content blocks
    tags: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isHidden: {
        type: Boolean,
        default: true, // Draft by default
    },
    publishedAt: Date,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// --- Event Model ---
const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug'],
        unique: true,
    },
    description: String,
    date: {
        type: Date,
        required: true,
    },
    location: String,
    coverImage: String,
    gallery: [String], // Array of image URLs
    isHidden: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

// --- Contact Request Model (Contact Form) ---
const ContactRequestSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: String,
    phone: String,
    address: String,
    apartment: String,
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: String,
    notes: String,
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'archived'],
        default: 'pending',
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const ContactRequest = mongoose.models.ContactRequest || mongoose.model('ContactRequest', ContactRequestSchema);

// --- Membership Request Model ---
const MembershipRequestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    requestType: {
        type: String,
        enum: ['membership', 'volunteer', 'partnership'],
        default: 'membership',
    },
    message: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const MembershipRequest = mongoose.models.MembershipRequest || mongoose.model('MembershipRequest', MembershipRequestSchema);

