const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

// POST route to save a new student
router.post('/students', async (req, res) => {
    const { name, section_id ,class_id} = req.body;

    console.log('Form data ❤️',req.body);
    
    try {
        const result = await pool.query(
            'INSERT INTO Students (name,class_id , section_id) VALUES ($1, $2 ,$3) RETURNING *',
            [name, class_id, section_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error saving student data:', err.stack);
        res.status(500).send('Server Error');
    }
});
// GET route to get all students
router.get('/students', async (req, res) => {
    const { page = 1, limit = 9 } = req.query; // Default page is 1, and default limit is 10
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) AS totalpages FROM students';
    const query = `
        SELECT students.id as id, students.name AS student_name, sections.name AS section_name, classes.name AS class_name
        FROM students
        INNER JOIN sections ON students.section_id = sections.id
        INNER JOIN classes ON students.class_id = classes.id
        ORDER BY students.id
        LIMIT $1 OFFSET $2
    `;

    try {
        // Get total count of students
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].totalpages, 10);

        // Calculate total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch the paginated students
        const result = await pool.query(query, [limit, offset]);

        // Return the student data along with pagination information
        res.json({
            rows: result.rows,
            totalPages:totalPages
            // currentPage: parseInt(page, 10),
            // totalStudents: totalCount
        });
    } catch (err) {
        console.error('Error fetching student data:', err.stack);
        res.status(500).send('Server Error');
    }
});

// only for selected sections in the class

router.get('/filteredSectionStd', async (req, res) => {
    const {class_id,section_id} = req.query;
    try {
        //query for total students
        const totalResult = await pool.query('SELECT COUNT(*) FROM students where class_id=$1 and section_id=$2',[class_id,section_id]);
        const total = parseInt(totalResult.rows[0].count, 10); 
 
        const result = await pool.query(`SELECT students.id as id, students.name AS student_name, sections.name AS section_name, classes.name AS class_name FROM students INNER JOIN sections ON students.section_id = sections.id INNER JOIN classes ON students.class_id = classes.id where students.class_id=$1 and students.section_id=$2`, [class_id, section_id]);
        const idResult = await pool.query(
            `SELECT id FROM students WHERE class_id = $1 AND section_id = $2`,
            [class_id, section_id]
        );

        // Prepare the response
        res.json({
            students: result.rows,         // The list of filtered students
            total: total,                  // The total count of filtered students
            allIds: idResult.rows.map(row => row.id)  // Array of all student IDs
        });

        console.log('↘️',result.rows);
        
        } catch (err) {
            console.error('Error fetching student data:', err.stack);
            res.status(500).send('Server Error');
            }
            });

// only for selected class
router.get('/filteredClassStd', async (req, res) => {
    const { class_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) AS totalpages FROM students WHERE class_id = $1';

    const query = `
        SELECT 
            students.id as id, 
            students.name AS student_name, 
            sections.name AS section_name, 
            classes.name AS class_name 
        FROM 
            students 
        INNER JOIN 
            sections ON students.section_id = sections.id 
        INNER JOIN 
            classes ON students.class_id = classes.id 
        WHERE 
            students.class_id = $1 
        LIMIT $2 OFFSET $3
    `;

    // This query fetches all IDs without limit
    const queryId = `
        SELECT 
            students.id as id 
        FROM 
            students 
        WHERE 
            students.class_id = $1
    `;

    try {
        // Query for total students
        const countResult = await pool.query(countQuery, [class_id]);
        const totalCount = parseInt(countResult.rows[0].totalpages, 10);

        // Calculate total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch the paginated students
        const result = await pool.query(query, [class_id, limit, offset]);

        // Fetch all student IDs without limit
        const idResult = await pool.query(queryId, [class_id]);

        // Send the result back to the frontend
        res.json({
            students: result.rows,   // The list of paginated students
            totalPages: totalPages,  // Total number of pages
            totalCount: totalCount,  // The total count of students
            allIds: idResult.rows.map(row => row.id)  // Array of all student IDs
        });

        console.log('↘️', result.rows);

    } catch (err) {
        console.error('Error fetching student data:', err.stack);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

