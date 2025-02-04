const express = require('express');
const router = express.Router();
const pool = require('../../Configs/dbConfig');
const client = require('../../Configs/redisConfig');
// Route to fetch top students with attendance data, ranking, and caching
router.get('/', async (req, res) => {
    const cacheKey = 'attendance:top_students';
    try {
        // Check if the data is already cached
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            console.log('Serving top students from cache');
            return res.json(JSON.parse(cachedData));
        }

        // Optimized SQL query:
        // 1. Compute attendance metrics per student.
        // 2. Rank the students using DENSE_RANK().
        // 3. Select the top 10 distinct ranks (including ties) directly in SQL.
        const query = `
            WITH student_attendance AS (
                SELECT 
                    a.student_id,
                    s.name AS student_name,
                    c.name AS class_name,
                    sec.name AS section_name,
                    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
                    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
                    ROUND(
                        (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0) / 
                        (COUNT(*) * 1.0), 
                        2
                    ) AS attendance_percentage,
                    t.username AS teacher_name
                FROM 
                    attendance a
                JOIN 
                    students s ON s.id = a.student_id
                JOIN 
                    sections sec ON sec.id = s.section_id
                JOIN 
                    classes c ON c.id = sec.class_id
                LEFT JOIN 
                    teachers t ON t.class_id = c.id AND t.section_id = sec.id
                GROUP BY 
                    a.student_id, s.name, c.name, sec.name, t.username
            ),
            ranked_students AS (
                SELECT *,
                    DENSE_RANK() OVER (ORDER BY attendance_percentage DESC) AS rank
                FROM student_attendance
            ),
            top_ranks AS (
                -- Get the top 10 distinct ranks
                SELECT rank
                FROM ranked_students
                GROUP BY rank
                ORDER BY rank
                LIMIT 10
            )
            SELECT 
                student_id,
                student_name,
                class_name,
                section_name,
                present_count,
                absent_count,
                attendance_percentage,
                rank,
                teacher_name
            FROM ranked_students
            WHERE rank IN (SELECT rank FROM top_ranks)
            ORDER BY rank;
        `;

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No attendance data found.' });
        }

        // Cache the result for 1 hour (3600 seconds)
        await client.setex(cacheKey, 3600, JSON.stringify(result.rows));

        // Return the final list of students (top 10 distinct ranking positions, including ties)
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching top students:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
