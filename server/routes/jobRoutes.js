const express = require('express');
const router = express.Router();
const { getSavedJobs, saveJob, unsaveJob, checkJobSaved } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/saved', protect, getSavedJobs);
router.get('/:id/saved', protect, checkJobSaved);
router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, unsaveJob);

module.exports = router;
