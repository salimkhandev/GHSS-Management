const cron = require('node-cron');
const express = require('express');
const pool = require('./dbConfig'); // Assuming you have a dbConfig file for PostgreSQL connection

const app = express();

// Schedule a task to run every 8 seconds
cron.schedule('*/8 * * * * *', () => {
    console.log('Task is running every 8 seconds');
    pool.query('SELECT * FROM attendance', (err, res) => {
        if (err) {
            console.error('Error executing query', err.stack);
        } else {
            console.log('Attendance records:', res.rows);
        }
    });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

