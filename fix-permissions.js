const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { Role } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function fixAdminRole() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const allPermissions = [
            'manage_users',
            'manage_roles',
            'manage_content',
            'manage_settings',
            'view_logs',
            'manage_events',
            'manage_blogs',
            'manage_audit_logs'
        ];

        const updatedRole = await Role.findOneAndUpdate(
            { name: 'Admin' },
            {
                $addToSet: { permissions: { $each: allPermissions } }
            },
            { new: true, upsert: true } // Create if not exists (though it should)
        );

        console.log('Admin Role updated with permissions:', updatedRole);

    } catch (error) {
        console.error('Error updating admin role:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

fixAdminRole();
