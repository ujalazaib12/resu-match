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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'resume') {
            uploadPath += 'resumes/';
        } else if (file.fieldname === 'profilePicture') {
            uploadPath += 'profiles/';
        }

        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});

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
