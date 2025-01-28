const pool = require('../../dbConfig');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const { class_id, section_id } = req.query;
    console.log('Fetching attendance data for class_id:', class_id, 'section_id:', section_id);
    // Fetch class_id and section_id from query params

    try {
        const result = await pool.query(`
            SELECT 
                class_id,
                section_id,
                TO_CHAR(DATE_TRUNC('month', attendance_date), 'YYYY-MM') AS month,
                ROUND(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) AS present_percentage,
                ROUND(SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) AS absent_percentage
            FROM 
                attendance
            WHERE
                class_id = $1 AND section_id = $2
            GROUP BY 
                class_id, section_id, month
            ORDER BY 
                month DESC;  -- Orders by most recent month first
        `, [class_id, section_id]); // Using parameterized query to prevent SQL injection

        res.json(result.rows); // Send the filtered data to the frontend
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
