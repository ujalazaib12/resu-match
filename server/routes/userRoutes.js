const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    updatePersonal,
    updateProfessional,
    updateSkills,
    updatePreferences,
    updatePassword,
    updateNotifications,
    deleteUser,
    updateProfilePicture,
    deleteProfilePicture,
    uploadResume
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
console.log("Cloudinary Config Debug:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key_exists: !!process.env.CLOUDINARY_API_KEY,
    api_secret_exists: !!process.env.CLOUDINARY_API_SECRET,
    api_key_first_chars: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 3) : 'MISSING'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'resumatch_uploads',
            resource_type: 'auto',
        };
    },
});

const upload = multer({ storage: storage });

router.post('/register', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]), registerUser);

router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Profile Update Routes
router.put('/profile/picture', protect, upload.single('profilePicture'), updateProfilePicture);
router.delete('/profile/picture', protect, deleteProfilePicture);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.put('/profile/personal', protect, updatePersonal);
router.put('/profile/professional', protect, updateProfessional);
router.put('/profile/skills', protect, updateSkills);
router.put('/profile/preferences', protect, updatePreferences);
router.put('/password', protect, updatePassword);
router.put('/notifications', protect, updateNotifications);
router.delete('/profile', protect, deleteUser);

module.exports = router;
