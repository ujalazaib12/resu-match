const pool = require('../db');

// Get saved jobs
const getSavedJobs = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM saved_jobs WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        // Map to return just the job data with added DB id if needed, 
        // or return structure { ...job_data, saved_at: ... }
        // The frontend expects a list of jobs.
        const jobs = result.rows.map(row => ({
            ...row.job_data,
            saved_at: row.created_at
        }));
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Save a job
const saveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobData = req.body;

        // Check if already saved
        const existing = await pool.query(
            'SELECT * FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
            [req.user.id, jobId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Job already saved' });
        }

        await pool.query(
            'INSERT INTO saved_jobs (user_id, job_id, job_data) VALUES ($1, $2, $3)',
            [req.user.id, jobId, JSON.stringify(jobData)]
        );

        res.status(201).json({ message: 'Job saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unsave a job
const unsaveJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        await pool.query(
            'DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
            [req.user.id, jobId]
        );

        res.json({ message: 'Job removed from saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check if job is saved
const checkJobSaved = async (req, res) => {
    try {
        const jobId = req.params.id;
        const result = await pool.query(
            'SELECT * FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
            [req.user.id, jobId]
        );
        res.json({ isSaved: result.rows.length > 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSavedJobs,
    saveJob,
    unsaveJob,
    checkJobSaved
};
