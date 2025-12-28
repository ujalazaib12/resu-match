const pool = require('./db');
require('dotenv').config();

const createTables = async () => {
    try {
        // 1. Create Base Table
        const userTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(userTableQuery);
        console.log("Verified 'users' table exists.");

        // 2. Add Missing Columns (Idempotent)
        const columns = [
            "phone VARCHAR(50)",
            "location VARCHAR(255)",
            "linkedin_profile TEXT",
            "portfolio_website TEXT",
            "job_title VARCHAR(255)",
            "years_of_experience INTEGER",
            "experience_level VARCHAR(50)",
            "current_company VARCHAR(255)",
            "industry VARCHAR(255)",
            "professional_summary TEXT",
            "skills JSONB",
            "education JSONB",
            "job_preferences JSONB",
            "resume_url TEXT",
            "profile_picture_url TEXT"
        ];

        for (const col of columns) {
            // Logic: ALTER TABLE users ADD COLUMN IF NOT EXISTS ...
            // Postgres supports IF NOT EXISTS for ADD COLUMN in newer versions, 
            // but for max compatibility we can catch duplicates or use a block.
            // Simplest way for this script:
            const colName = col.split(' ')[0];
            try {
                await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col}`);
                console.log(`Verified column: ${colName}`);
            } catch (e) {
                console.log(`Column ${colName} probably exists or error: ${e.message}`);
            }
        }

        console.log("Database schema update complete.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating database schema", err);
        process.exit(1);
    }
};

createTables();
