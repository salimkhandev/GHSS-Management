const pool = require('../../dbConfig');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Query to fetch all students with attendance data, their rank based on percentage, and the teacher's name
        const result = await pool.query(
            `
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
            ORDER BY rank;
            `
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No attendance data found.' });
        }

        // Array to hold students to return, and a counter for total number of positions included
        let studentsToReturn = [];
        let currentRank = 1;
        let totalPositions = 0;

        // Loop through the rows to process and collect students while handling ties
        for (let i = 0; i < result.rows.length; i++) {
            const student = result.rows[i];

            // Only add students to the return array if the total number of positions selected is less than 10
            if (totalPositions < 10) {
                // If the student's rank is the same as the current rank, add them to the result
                if (student.rank === currentRank) {
                    studentsToReturn.push(student);
                } else {
                    // If we reached a new rank, update the current rank and add it as a new position
                    currentRank = student.rank;
                    studentsToReturn.push(student);
                    totalPositions++; // Increment the position count when a new rank is encountered
                }

                // Increment total positions based on how many students are sharing the current rank
                if (student.rank !== currentRank) {
                    totalPositions++;
                }
            } else {
                // If we've already selected 10 positions, break the loop
                break;
            }
        }

        // Send the final list of students (should not exceed 10 positions)
        res.json(studentsToReturn);
    } catch (error) {
        console.error('Error fetching top students:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

