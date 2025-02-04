const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');
const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: '127.0.0.1', // Force IPv4
        port: 6379
    },
    disableOfflineQueue: true
});

// Handle Redis connection events
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// GET route to fetch all classes with caching
router.get('/classes', async (req, res) => {
    try {
        const cacheKey = 'classes';
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log('Serving classes from cache');
            return res.json(JSON.parse(cachedData));
        }

        const result = await pool.query('SELECT * FROM Classes');
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows)); // Cache for 1 hour
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET route to fetch all sections with caching
router.get('/sections', async (req, res) => {
    try {
        const cacheKey = 'sections';
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log('Serving sections from cache');
            return res.json(JSON.parse(cachedData));
        }

        const result = await pool.query('SELECT * FROM sections');
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST route to get sections with caching
router.post('/get-sections', async (req, res) => {
    const { class_id } = req.body;

    try {
        const cacheKey = `sections:${class_id}:basic`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log(`Serving sections for class ${class_id} from cache`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        const query = 'SELECT name, id FROM sections WHERE class_id = $1';
        const result = await pool.query(query, [class_id]);

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST route to get full section details with caching
router.post('/getsec', async (req, res) => {
    const { class_id } = req.body;

    if (!class_id) {
        return res.status(400).json({ error: 'class_id is required' });
    }

    try {
        const cacheKey = `sections:${class_id}:full`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log(`Serving full sections for class ${class_id} from cache`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        const result = await pool.query(
            'SELECT * FROM sections WHERE class_id = $1',
            [class_id]
        );

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
