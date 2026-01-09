const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Define Schemas locally to avoid Module/CommonJS conflict
const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
});

const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // 1. Ensure Admin Role Exists
        let adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            console.log('Creating Admin Role...');
            adminRole = await Role.create({
                name: 'Admin',
                permissions: ['manage_users', 'manage_content', 'view_audit_log', 'manage_roles', 'manage_settings'],
                description: 'Full Access'
            });
        } else {
            // Update permissions just in case
            adminRole.permissions = ['manage_users', 'manage_content', 'view_audit_log', 'manage_roles', 'manage_settings'];
            await adminRole.save();
            console.log('Admin Role updated with full permissions');
        }

        // 2. Ensure Admin User Exists
        const existingAdmin = await User.findOne({ email: 'admin@hcsem.org' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            // Update role if needed
            if (existingAdmin.role.toString() !== adminRole._id.toString()) {
                existingAdmin.role = adminRole._id;
                await existingAdmin.save();
                console.log('Admin user role updated');
            }
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'admin@hcsem.org',
            password: hashedPassword,
            fullName: 'Super Admin',
            role: adminRole._id,
        });

        console.log('Admin user created: admin@hcsem.org / admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
}

seed();
