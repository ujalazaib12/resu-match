require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadTest() {
    try {
        // Create a dummy PDF-like buffer (header %PDF-1.4)
        const pdfHeader = Buffer.from("%PDF-1.4\n%Dummy Content");

        // Upload as raw but with .txt extension
        const result = await cloudinary.uploader.upload("data:text/plain;base64," + pdfHeader.toString('base64'), {
            resource_type: "raw",
            folder: "resumatch_uploads",
            public_id: "test_fake_pdf.txt"
        });

        console.log("Upload result (txt extension):", result.secure_url);

        // Upload as raw with .pdf extension
        const resultPdf = await cloudinary.uploader.upload("data:application/pdf;base64," + pdfHeader.toString('base64'), {
            resource_type: "raw",
            folder: "resumatch_uploads",
            public_id: "test_real_pdf_v2.pdf"
        });

        console.log("Upload result (pdf extension):", resultPdf.secure_url);

    } catch (error) {
        console.error("Upload failed:", error);
    }
}

uploadTest();
