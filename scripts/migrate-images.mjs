import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import mongoose from 'mongoose';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const UPLOADS_DIR = path.join(projectDir, 'public', 'uploads');

// Ensure the directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Download map to reuse already downloaded paths in case of duplicates
const downloadCache = new Map();

async function downloadImage(url) {
    if (downloadCache.has(url)) {
        return downloadCache.get(url);
    }

    return new Promise((resolve, reject) => {
        // Some cloudinary urls might have query parameters we want to ignore for the filename
        const parsedUrl = new URL(url);
        const originalPath = parsedUrl.pathname;
        const extension = path.extname(originalPath) || '.jpg';
        
        // Generate a random unique filename
        const filename = `${crypto.randomUUID()}${extension}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        const newPublicUrl = `/uploads/${filename}`;

        console.log(`Downloading: ${url} ...`);
        
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Saved as: ${newPublicUrl}`);
                    downloadCache.set(url, newPublicUrl);
                    resolve(newPublicUrl);
                });
            } else {
                console.error(`Failed to download ${url}: ${response.statusCode}`);
                file.close();
                fs.unlink(filePath, () => {}); // Delete the incomplete file
                // Instead of rejecting and stopping the whole script, we simply return the original URL so nothing breaks.
                resolve(url);
            }
        }).on('error', (err) => {
            console.error(`Error downloading ${url}:`, err.message);
            file.close();
            fs.unlink(filePath, () => {});
            resolve(url);
        });
    });
}

// Find all Cloudinary URLs and replace them
const urlRegex = /https?:\/\/res\.cloudinary\.com\/[^'"\s<>)]+/g;

async function processValue(val) {
    if (typeof val === 'string') {
        let newStr = val;
        const matches = val.match(urlRegex);
        if (matches) {
            for (const url of matches) {
                const newUrl = await downloadImage(url);
                if (newUrl) {
                    newStr = newStr.replace(url, newUrl);
                }
            }
        }
        return newStr;
    }
    
    if (Array.isArray(val)) {
        const newArr = [];
        for (let i = 0; i < val.length; i++) {
            newArr.push(await processValue(val[i]));
        }
        return newArr;
    }
    
    if (val !== null && typeof val === 'object') {
        // Leave Date and ObjectId as is
        if (val instanceof Date || (val.constructor && val.constructor.name === 'ObjectId')) {
            return val;
        }

        const newVal = {};
        for (const [k, v] of Object.entries(val)) {
            // Avoid messing with internal MongoDB fields
            if (k === '_id' || k === '__v') {
                newVal[k] = v;
                continue;
            }
            newVal[k] = await processValue(v);
        }
        return newVal;
    }
    
    return val;
}

async function run() {
    console.log("Starting Migration...");
    console.log(`Uploads Dir: ${UPLOADS_DIR}`);

    if (!process.env.MONGODB_URI) {
        console.error("ERROR: MONGODB_URI is not set in your environment.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");

        // The collections we need to check
        const collectionNames = ['sitesettings', 'users', 'events', 'blogs'];
        
        for (const colName of collectionNames) {
            console.log(`\nProcessing Collection: ${colName}...`);
            const collection = mongoose.connection.collection(colName);
            const documents = await collection.find({}).toArray();

            let updatedCount = 0;

            for (const doc of documents) {
                // Determine if any strings inside doc have changed
                const updatedDoc = await processValue(doc);
                
                // Compare stringified versions to determine if a change occurred
                if (JSON.stringify(doc) !== JSON.stringify(updatedDoc)) {
                    // Update document
                    await collection.updateOne(
                        { _id: doc._id },
                        { $set: updatedDoc }
                    );
                    updatedCount++;
                }
            }
            console.log(`Collection ${colName}: Updated ${updatedCount} documents.`);
        }

        console.log("\nMigration completed successfully!");
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

run();
