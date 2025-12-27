const pool = require('./db');

const createTables = async () => {
    const userTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(userTableQuery);
        console.log("Users table created successfully");
        process.exit(0);
    } catch (err) {
        console.error("Error creating tables", err);
        process.exit(1);
    }
};

createTables();
