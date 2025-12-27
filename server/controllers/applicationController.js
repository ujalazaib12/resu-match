const pool = require('../db');

// Get all applications
const getApplications = async (req, res) => {
    try {
        const { jobId, limit } = req.query;
        let query = 'SELECT * FROM applications WHERE user_id = $1';
        const params = [req.user.id];

        if (jobId) {
            query += ' AND job_id = $' + (params.length + 1);
            params.push(jobId);
        }

        query += ' ORDER BY applied_at DESC';

        if (limit) {
            query += ' LIMIT $' + (params.length + 1);
            params.push(limit);
        }

        const result = await pool.query(query, params);

        const applications = result.rows.map(row => ({
            ...row.job_data,
            id: row.job_id, // Ensure ID is consistent
            applicationStatus: row.status,
            appliedAt: row.applied_at
        }));

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Apply to a job
const applyJob = async (req, res) => {
    try {
        const { job_id, job_data } = req.body;

        // Use job_id from body or construct it
        // JobDetails sends { jobId, jobTitle, ... } at top level
        const jobId = job_id || job_data?.id || req.body.jobId || req.body.id;
        const dataToSave = job_data || req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        // Check if already applied
        const existing = await pool.query(
            'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
            [req.user.id, jobId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        const result = await pool.query(
            'INSERT INTO applications (user_id, job_id, job_data) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, jobId, JSON.stringify(dataToSave)]
        );

        const newApp = result.rows[0];
        res.status(201).json({
            ...newApp.job_data,
            id: newApp.job_id,
            applicationStatus: newApp.status,
            appliedAt: newApp.applied_at
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { status } = req.body;

        const result = await pool.query(
            'UPDATE applications SET status = $1 WHERE user_id = $2 AND job_id = $3 RETURNING *',
            [status, req.user.id, jobId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const updated = result.rows[0];
        res.json({
            ...updated.job_data,
            id: updated.job_id,
            applicationStatus: updated.status,
            appliedAt: updated.applied_at
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete application
const deleteApplication = async (req, res) => {
    try {
        const jobId = req.params.id;

        const result = await pool.query(
            'DELETE FROM applications WHERE user_id = $1 AND job_id = $2 RETURNING *',
            [req.user.id, jobId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getApplications,
    applyJob,
    updateApplicationStatus,
    deleteApplication
};
