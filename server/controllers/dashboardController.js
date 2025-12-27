const pool = require('../db');

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const appliedCount = await pool.query(
            'SELECT COUNT(*) FROM applications WHERE user_id = $1',
            [userId]
        );

        const savedCount = await pool.query(
            'SELECT COUNT(*) FROM saved_jobs WHERE user_id = $1',
            [userId]
        );

        // Mock recommendations count for now, or implement logic later
        const recommendations = 0;

        res.json({
            appliedJobs: parseInt(appliedCount.rows[0].count),
            savedJobs: parseInt(savedCount.rows[0].count),
            recommendations: recommendations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDashboardStats
};
