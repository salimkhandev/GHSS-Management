// dbConfig.js
require('dotenv').config();// Load environment variables from a .env file

const { Pool } = require('pg');
console.log(process.env.DATABASE_URL); // Debugging: Print the DATABASE_URL

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use an environment variable for the connection string
});
pool.connect().then(() => console.log('Connected to the database ✅'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;
