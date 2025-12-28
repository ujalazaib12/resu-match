require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// The URL suggests the public ID might include .pdf or not. 
// Standard multer-storage-cloudinary often generates random strings.
// URL: https://res.cloudinary.com/.../raw/upload/v1766935886/resumatch_uploads/rdhbwue5h8hlutds5vte.pdf
// This implies public_id is likely 'resumatch_uploads/rdhbwue5h8hlutds5vte.pdf' if it was uploaded with extension,
// OR 'resumatch_uploads/rdhbwue5h8hlutds5vte' and the .pdf is just appended for delivery (but for raw, it must be in the ID usually).

const publicIdsToCheck = [
    'resumatch_uploads/rdhbwue5h8hlutds5vte.pdf',
    'resumatch_uploads/rdhbwue5h8hlutds5vte'
];

async function checkResource() {
    console.log('Checking resources...');

    for (const id of publicIdsToCheck) {
        console.log(`\n--- Checking ID: ${id} ---`);
        try {
            // Try finding as raw
            let result = await cloudinary.api.resource(id, { resource_type: 'raw' });
            console.log(`FOUND as RAW:`, JSON.stringify(result, null, 2));
        } catch (err) {
            console.log(`Not found as raw: ${err.message}`);
        }

        try {
            // Try finding as image (just in case)
            let result = await cloudinary.api.resource(id, { resource_type: 'image' });
            console.log(`FOUND as IMAGE:`, JSON.stringify(result, null, 2));
        } catch (err) {
            console.log(`Not found as image: ${err.message}`);
        }
    }
}

checkResource();
