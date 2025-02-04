const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');
const Redis = require('ioredis'); // Import ioredis

// Create a Redis client
const redisClient = new Redis("rediss://default:ASdHAAIjcDFlNWNjNThhOWZlMGI0OTQ5ODA1ZTVkNDBmZmNiNDkzNnAxMA@bright-foxhound-10055.upstash.io:6379");
// Handle Redis connection events
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// GET route to fetch all classes with caching
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

// GET route to fetch all sections with caching
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