const express = require('express');
const router = express.Router();
const pool = require('../Configs/dbConfig');
const redisClient = require('../Configs/redisConfig');

// Route to get teachers' information grouped by class and section with Redis caching
router.get('/', async (req, res) => {
    try {
        // Cache key for teachers' information
        const cacheKey = 'teachersAssigned';

        // Check if data is already cached in Redis
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            // If cached data exists, send it as response
            console.log('Data retrieved from cache');
            return res.json(JSON.parse(cachedData));
        }

        // If no cache found, query the database and group the teachers by class and section
        const result = await pool.query(
            `SELECT 
                  teachers.id as id,
                classes.name AS class_name, 
                sections.name AS section_name, 
                teachers.username AS teacher_name,
                teachers.profile_pic_url AS profile_pic_url
            FROM teachers
            INNER JOIN classes ON teachers.class_id = classes.id
            INNER JOIN sections ON teachers.section_id = sections.id
            WHERE teachers.role = 'teacher'
            ORDER BY classes.id, sections.id;`
        );

        // Group the teachers by class and section
        const groupedTeachers = result.rows.reduce((acc, row) => {
            const { class_name, section_name, teacher_name,profile_pic_url } = row;

            if (!acc[class_name]) {
                acc[class_name] = [];
            }

            acc[class_name].push({ section_name, teacher_name,profile_pic_url });

            return acc;
        }, {});

        // Cache the result in Redis with an expiration time of 1 hour
        await redisClient.setex(cacheKey, 3600, JSON.stringify(groupedTeachers)); // 3600 seconds = 1 hour

        // Send the grouped results as JSON
        console.log('Data retrieved from database');
        res.json(groupedTeachers);
    } catch (error) {
        console.error('Error fetching teachers info:', error);
        res.status(500).json({ error: 'Failed to fetch teachers info' });
    }
});



// Export the router
module.exports = router;
