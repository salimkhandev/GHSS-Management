const express = require('express');
const router = express.Router();
const pool = require('../../Configs/dbConfig'); // Import DB configuration
const redisClient = require('../../Configs/redisConfig'); // Import Redis client

// Helper function for caching
async function getOrSetCache(key, queryFunction, expiration = 3600) {
    try {
        const cachedData = await redisClient.get(key);
        if (cachedData) {
            console.log(`Serving ${key} from cache`);
            return JSON.parse(cachedData);
        }

        const data = await queryFunction();
        if (data) {
            await redisClient.setex(key, expiration, JSON.stringify(data)); // Cache for 1 hour
        }
        return data;
    } catch (err) {
        console.error('Redis Error:', err);
        return null; // Fallback to DB query if Redis fails
    }
}

// GET route to fetch all classes
router.get('/classes', async (req, res) => {
    try {
        const result = await getOrSetCache('classes', async () => {
            const res = await pool.query('SELECT * FROM Classes');
            return res.rows;
        });

        res.json(result || []); // Return empty array if there's an issue
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET route to fetch all sections
router.get('/sections', async (req, res) => {
    try {
        const result = await getOrSetCache('sections', async () => {
            const res = await pool.query('SELECT * FROM sections');
            return res.rows;
        });

        res.json(result || []);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST route to fetch sections based on class_id
router.post('/get-sections', async (req, res) => {
    const { class_id } = req.body;
    if (!class_id) return res.status(400).json({ error: 'class_id is required' });

    try {
        const result = await pool.query('SELECT name, id FROM sections WHERE class_id = $1', [class_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST route for student promotion
router.post('/promotestd', async (req, res) => {
    const { selectedClassId, selectedSectionId, originalSelectedClass, originalSelectedSection, studentIds } = req.body;

    if (!selectedClassId || !selectedSectionId || !originalSelectedClass || !originalSelectedSection || !studentIds) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        UPDATE students
        SET class_id = $1, section_id = $2
        WHERE class_id = $3 AND section_id = $4 AND id = ANY($5::int[])
    `;

    try {
        const result = await pool.query(query, [selectedClassId, selectedSectionId, originalSelectedClass, originalSelectedSection, studentIds]);
        res.json({ message: 'Students updated successfully', rowsAffected: result.rowCount });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Failed to update students' });
    }
});

module.exports = router;
