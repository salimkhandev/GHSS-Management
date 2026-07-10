require('dotenv').config();
const { Pool } = require('pg');

const url = process.env.DATABASE_URL;
console.log("Testing connection to database...");

const pool = new Pool({
    connectionString: url,
    connectionTimeoutMillis: 10000
});

pool.query('SELECT NOW() as current_time, current_database() as db_name')
    .then(result => {
        console.log("✅ CONNECTED TO DATABASE!");
        console.log("Database:", result.rows[0].db_name);
        console.log("Server Time:", result.rows[0].current_time);
        process.exit(0);
    })
    .catch(err => {
        console.log("❌ CONNECTION FAILED");
        console.log("Error:", err.message);
        process.exit(1);
    });