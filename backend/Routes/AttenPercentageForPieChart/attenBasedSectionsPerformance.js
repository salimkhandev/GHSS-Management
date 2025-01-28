const pool = require('../../dbConfig');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch start_date and end_date dynamically from the database
        const dateRangeResult = await pool.query(
            `
            SELECT 
                MIN(attendance_date) AS start_date,
                MAX(attendance_date) AS end_date
            FROM 
                attendance
            `
        );

        if (dateRangeResult.rows.length === 0) {
            return res.status(404).json({ message: 'No attendance data found.' });
        }

        const { start_date, end_date } = dateRangeResult.rows[0];

        console.log(
            'Fetching overall attendance data for all classes and sections from',
            start_date,
            'to',
            end_date
        );

        // Fetch overall percentage for all sections and classes, including those with no attendance
        const result = await pool.query(
            `
            SELECT 
                classes.name AS class_name,
                sections.name AS section_name,
                CASE
                    WHEN COUNT(attendance.id) = 0 THEN 'No attendance taken yet'  -- No attendance for this section
                    ELSE ROUND(
                        SUM(CASE WHEN attendance.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / 
                        NULLIF(COUNT(attendance.id), 0), 
                        2
                    )::TEXT  -- Convert to text for consistency
                END AS overall_percentage,
                $1::DATE AS start_date,
                $2::DATE AS end_date
            FROM 
                classes
            INNER JOIN
                sections ON classes.id = sections.class_id
            LEFT JOIN
                attendance ON sections.id = attendance.section_id AND attendance.attendance_date BETWEEN $1::DATE AND $2::DATE
            GROUP BY 
                classes.name, sections.name
            ORDER BY 
                CASE 
                    WHEN COUNT(attendance.id) = 0 THEN 1  -- Sections with no attendance will be sorted after
                    ELSE 0
                END,
                CASE 
                    WHEN COUNT(attendance.id) > 0 THEN
                        ROUND(
                            SUM(CASE WHEN attendance.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / 
                            NULLIF(COUNT(attendance.id), 0), 
                            2
                        )
                    ELSE 0
                END DESC;  -- Sections with attendance sorted by percentage
            `,
            [start_date, end_date] // Pass date range as parameters
        );

        res.json(result.rows); // Send the filtered data to the frontend
    } catch (error) {
        console.error('Error fetching overall attendance data:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
