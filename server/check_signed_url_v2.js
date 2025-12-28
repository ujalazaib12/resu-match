require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const publicId = 'resumatch_uploads/rdhbwue5h8hlutds5vte.pdf';
const version = 1766935886;

const url = cloudinary.url(publicId, {
    resource_type: 'raw',
    sign_url: true,
    secure: true,
    version: version
});

console.log("Signed URL:", url);
