const pool = require('../../dbConfig');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const { class_id, section_id } = req.query;

    try {
        // Fetch start_date and end_date dynamically from the database
        const dateRangeResult = await pool.query(
            `
            SELECT 
                MIN(attendance_date) AS start_date,
                MAX(attendance_date) AS end_date
            FROM 
                attendance
            WHERE 
                class_id = $1 AND section_id = $2
            `,
            [class_id, section_id] // Using parameterized query to prevent SQL injection
        );

        
        if (dateRangeResult.rows.length === 0) {
            return res.status(404).json({ message: 'No attendance data found for the given class and section.' });
        }

        const { start_date, end_date } = dateRangeResult.rows[0];

        console.log(
            'Fetching overall attendance data for class_id:',
            class_id,
            'section_id:',
            section_id,
            'date range:',
            start_date,
            'to',
            end_date
        );

        // Fetch overall percentage using the date range
        const result = await pool.query(
            `
            SELECT 
                class_id,
                section_id,
                ROUND(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) AS overall_percentage,
                $1 AS start_date,
                $2 AS end_date
            FROM 
                attendance
            WHERE 
                class_id = $3 
                AND section_id = $4
            GROUP BY 
                class_id, section_id;
            `,
            [start_date, end_date, class_id, section_id] // Pass date range as parameters
        );

        res.json(result.rows); // Send the filtered data to the frontend
    } catch (error) {
        console.error('Error fetching overall attendance data:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
