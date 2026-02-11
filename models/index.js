import mongoose from 'mongoose';


// Force clear models in development to prevent schema caching issues
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.User) delete mongoose.models.User;
    if (mongoose.models.Role) delete mongoose.models.Role;
    if (mongoose.models.SiteSettings) delete mongoose.models.SiteSettings;
    if (mongoose.models.AuditLog) delete mongoose.models.AuditLog;
    if (mongoose.models.Blog) delete mongoose.models.Blog;
    if (mongoose.models.Event) delete mongoose.models.Event;
    if (mongoose.models.ContactRequest) delete mongoose.models.ContactRequest;
    if (mongoose.models.MembershipRequest) delete mongoose.models.MembershipRequest;
}

// --- Site Settings Model (Hero/Banner Images, etc.) ---
const SiteSettingsSchema = new mongoose.Schema({
    heroImage: {
        type: String,
        default: '/images/hero-bg.png', // Default placeholder
    },
    logoUrl: { type: String, default: null },
    heroTitle: String,
    heroSubtitle: String,
    eventsTitle: String,
    eventsSubtitle: String,
    stats: [
        {
            label: String,
            value: String,
        }
    ],
    tickerImages: [
        {
            url: String,
            order: Number,
            title: String,
            subtitle: String
        }
    ],
    galleryImages: [
        {
            url: String,
            order: Number
        }
    ],
    // --- New Page Settings ---
    // Events Page
    eventsPageTitle: String,
    eventsPageSubtitle: String,
    eventsPageImage: String,

    // About Page
    // About Page (Bilingual)
    aboutPageTitle: { type: mongoose.Schema.Types.Mixed }, // { en: String, am: String }
    aboutPageSubtitle: { type: mongoose.Schema.Types.Mixed },
    aboutPageImage: String,

    aboutMission: { type: mongoose.Schema.Types.Mixed }, // { en: String, am: String }
    aboutMissionImage: String,

    aboutVision: { type: mongoose.Schema.Types.Mixed }, // { en: String, am: String }
    aboutVisionImage: String,

    // What We Do (Dynamic & Bilingual)
    aboutActivities: [{
        title: { type: mongoose.Schema.Types.Mixed }, // { en, am }
        description: { type: mongoose.Schema.Types.Mixed }, // { en, am }
        icon: String,
        color: String
    }],

    // Blog Page
    blogPageTitle: String,
    blogPageSubtitle: String,
    blogPageImage: String,

    // Contact Page
    contactPageTitle: String,
    contactPageSubtitle: String,
    contactPageImage: String,
    contactOfficeHours: String,
    contactAddress: String,
    contactPhone: String,
    contactPhone: String,
    contactEmail: String,

    // Dynamic Contact Reasons
    contactReasons: [
        {
            value: String, // The value stored (usually English)
            label: { type: mongoose.Schema.Types.Mixed }, // { en: String, am: String }
        }
    ],

    // Home Page Additional Sections
    galleryTitle: String,
    gallerySubtitle: String,
    upcomingEventsTitle: String,
    upcomingEventsSubtitle: String,

    // Events Page Additional Sections
    eventsVideoTitle: String,
    eventsVideoSubtitle: String,
    eventsGalleryTitle: String,
    eventsGallerySubtitle: String,
    eventsGalleryImages: [
        {
            url: String,
            order: Number,
        }
    ],
    eventsVideoUrl: { type: String, default: '/folder/1.mp4' },

    // Room Walkthrough / Explore Our Community
    walkthroughTitle: String,
    walkthroughSubtitle: String,
    walkthroughItems: [
        {
            name: String,
            title: String,
            description: String,
            image: String,
            iconName: String, // lucide icon name string
            features: [String],
            order: Number
        }
    ],

    // Visibility Settings (Section Toggles)
    showHero: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true },
    showEventsHighlight: { type: Boolean, default: true },
    showCommunityGallery: { type: Boolean, default: true },
    showUpcomingEvents: { type: Boolean, default: true },

    showEventsHeader: { type: Boolean, default: true },
    showEventsVideo: { type: Boolean, default: true },
    showEventsGallery: { type: Boolean, default: true },

    showAboutHeader: { type: Boolean, default: true },
    showAboutMission: { type: Boolean, default: true },
    showAboutVision: { type: Boolean, default: true },

    showBlogHeader: { type: Boolean, default: true },
    showContactHeader: { type: Boolean, default: true },

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

// --- Role Model (RBAC) ---
const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a role name'],
        unique: true,
    },
    description: String,
    permissions: [{
        type: String, // e.g., 'manage_users', 'manage_content', 'view_audit_log'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        // default: <default_role_id> // We'll handle defaults in logic or seed
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
    mustChangePassword: {
        type: Boolean,
        default: false,
    },

    // Activity Tracking
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    accountLocked: { type: Boolean, default: false },
    lockedUntil: { type: Date },

    // Password Reset
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
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
    content: String,
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
    layoutTemplate: {
        type: String,
        default: 'standard',
        enum: [
            'standard', 'featured', 'minimal', 'gallery', 'carousel',
            'video-centric', 'hero-overlay', 'split-view', 'timeline', 'magazine'
        ]
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
    isDeleted: {
        type: Boolean,
        default: false,
    },
    replies: [{
        sender: String, // 'admin' or 'user' (though usually admin for now)
        message: String,
        subject: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
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

