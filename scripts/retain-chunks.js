const fs = require('fs');
const path = require('path');

const action = process.argv[2];
const nextDir = path.join(__dirname, '..', '.next', 'static', 'chunks');
const tempDir = path.join(__dirname, '..', '.next-temp-chunks');

if (action === 'prebuild') {
    if (fs.existsSync(nextDir)) {
        console.log('📦 Saving previous Next.js chunks to prevent 404 errors during deployment...');
        // Copy existing chunks to a temporary safe directory
        fs.cpSync(nextDir, tempDir, { recursive: true });
    } else {
        console.log('ℹ️ No previous chunks found to retain.');
    }
} else if (action === 'postbuild') {
    if (fs.existsSync(tempDir)) {
        console.log('♻️ Restoring previous Next.js chunks alongside new ones...');
        if (!fs.existsSync(nextDir)) {
            fs.mkdirSync(nextDir, { recursive: true });
        }
        // Copy them back without overwriting newly generated chunks (overwrite: false)
        fs.cpSync(tempDir, nextDir, { recursive: true, overwrite: false, errorOnExist: false });
        // Clean up the temp directory
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
} else {
    console.error('Error: Please specify "prebuild" or "postbuild".');
    process.exit(1);
}
