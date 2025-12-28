require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadTest() {
    try {
        const result = await cloudinary.uploader.upload("data:text/plain;base64,SGVsbG8gV29ybGQ=", {
            resource_type: "raw",
            folder: "resumatch_uploads",
            public_id: "test_raw_file.txt"
        });
        console.log("Upload result:", JSON.stringify(result, null, 2));
        console.log("Please check if this URL is accessible:", result.secure_url);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}

uploadTest();
