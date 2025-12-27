const express = require('express');
const router = express.Router();
const { getApplications, applyJob, updateApplicationStatus, deleteApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getApplications);
router.post('/', protect, applyJob);
router.put('/:id', protect, updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
