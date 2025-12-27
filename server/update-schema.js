const pool = require('./db');

const updateSchema = async () => {
    const alterQuery = `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS location VARCHAR(255),
        ADD COLUMN IF NOT EXISTS linkedin_profile VARCHAR(255),
        ADD COLUMN IF NOT EXISTS portfolio_website VARCHAR(255),
        ADD COLUMN IF NOT EXISTS job_title VARCHAR(100),
        ADD COLUMN IF NOT EXISTS years_of_experience VARCHAR(50),
        ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50),
        ADD COLUMN IF NOT EXISTS current_company VARCHAR(100),
        ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
        ADD COLUMN IF NOT EXISTS professional_summary TEXT,
        ADD COLUMN IF NOT EXISTS skills JSONB,
        ADD COLUMN IF NOT EXISTS education JSONB,
        ADD COLUMN IF NOT EXISTS job_preferences JSONB,
        ADD COLUMN IF NOT EXISTS resume_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(255);
    `;

    try {
        await pool.query(alterQuery);
        console.log("Schema updated successfully: Added profile fields to users table.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating schema", err);
        process.exit(1);
    }
};

updateSchema();
