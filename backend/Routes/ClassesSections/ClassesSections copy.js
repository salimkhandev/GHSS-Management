const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');
const Redis = require('ioredis'); // Import ioredis

// Create a Redis client and configure it
const redisClient = new Redis("rediss://default:ASdHAAIjcDFlNWNjNThhOWZlMGI0OTQ5ODA1ZTVkNDBmZmNiNDkzNnAxMA@bright-foxhound-10055.upstash.io:6379");

// Handle Redis connection events
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Route to fetch students with pagination and caching
router.get('/mystudents', async (req, res) => {
    const { page = 1, limit = 100 } = req.query; // Default page is 1, and default limit is 100
    const offset = (page - 1) * limit;
    const cacheKey = `students:${page}:${limit}`; // Unique cache key based on page and limit

    try {
        // Check if data is in cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Serving students from cache');
            return res.json(JSON.parse(cachedData));
        }

        // Query for total count of students
        const countQuery = 'SELECT COUNT(*) AS totalpages FROM students';
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].totalpages, 10);

        // Calculate total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Query for the students based on pagination
        const query = `
            SELECT students.id as id, students.name AS student_name, sections.name AS section_name, classes.name AS class_name
            FROM students
            INNER JOIN sections ON students.section_id = sections.id
            INNER JOIN classes ON students.class_id = classes.id
            ORDER BY students.id
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(query, [limit, offset]);

        // Cache the result for 1 hour
        await redisClient.setex(cacheKey, 3600, JSON.stringify(result.rows));

        // Return the student data along with pagination information
        res.json({
            rows: result.rows,
            totalPages: totalPages,
        });
    } catch (err) {
        console.error('Error fetching student data:', err.stack);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all classes with caching
router.get('/myclasses', async (req, res) => {
    try {
        const cacheKey = 'classes';
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log('Serving classes from cache');
            return res.json(JSON.parse(cachedData));
        }

        const result = await pool.query('SELECT * FROM Classes');
        await redisClient.setex(cacheKey, 3600, JSON.stringify(result.rows)); // Cache for 1 hour
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to fetch all sections with caching
router.get('/mysections', async (req, res) => {
    try {
        const cacheKey = 'sections';
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log('Serving sections from cache');
            return res.json(JSON.parse(cachedData));
        }

        const result = await pool.query('SELECT * FROM sections');
        await redisClient.setex(cacheKey, 3600, JSON.stringify(result.rows));
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
