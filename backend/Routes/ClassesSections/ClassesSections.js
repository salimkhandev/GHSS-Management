const express = require('express');
const router = express.Router();
const pool = require('../../Configs/dbConfig'); // Import your database configuration

// GET route to fetch all classes
router.get('/classes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Classes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET route to fetch all sections
router.get('/sections', async (req, res) => {
    try {
        const result = await pool.query(' select * from sections');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/get-sections', async (req, res) => {
    const { class_id } = req.body; // Receiving class_id from the UI (frontend)

    try {
        const query = 'SELECT name ,id FROM sections WHERE class_id = $1';
        const values = [class_id];

        const result = await pool.query(query, values);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//promotion code of students
router.post('/getsec', async (req, res) => {
    const { class_id } = req.body;
    if (!class_id) {
        return res.status(400).json({ error: 'class_id is required' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM sections WHERE class_id = $1',
            [class_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.post('/promotestd', async (req, res) => {
    const { selectedClassId, selectedSectionId, originalSelectedClass, originalSelectedSection, studentIds } = req.body;

    console.log('❤️', req.body);

    // Construct the SQL query
    const query = `
    UPDATE students
    SET class_id = $1, section_id = $2
    WHERE class_id = $3 AND section_id = $4 AND id = ANY($5::int[])
  `;

    try {
        // Execute the SQL query
        const result = await pool.query(query, [selectedClassId, selectedSectionId, originalSelectedClass, originalSelectedSection, studentIds]);

        // Send a success response
        res.json({ message: 'Students updated successfully', rowsAffected: result.rowCount });
        console.error('Error executing query');
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Failed to update students' });
    }
});

//testing only



module.exports = router;
