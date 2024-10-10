const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const stream = require('stream');
const pool = require('../dbConfig'); // Your database connection

const router = express.Router();

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    console.log("hello from bulk");

    const file = req.file;    

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const students = [];

    // Create a readable stream from the in-memory file buffer
    const readableStream = new stream.Readable();
    readableStream._read = () => { }; // _read is required but you can noop it
    readableStream.push(file.buffer);
    readableStream.push(null);

    // Parse the CSV file from the readable stream
    readableStream
        .pipe(csvParser())
        .on('data', (row) => {
            students.push([row.name, row.class_id, row.section_id]);
        })
        .on('end', async () => {
            if (students.length === 0) {
                return res.status(400).send('CSV file is empty.');
            }

            try {
                // Construct the bulk insert query
                const query = `
                    INSERT INTO students (name, class_id, section_id)
                    VALUES ${students.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')}
                    RETURNING *`;

                // Flatten the students array for the parameterized query
                const flattenedValues = students.flat();

                // Execute the query
                await pool.query(query, flattenedValues);
                res.send('Students imported successfully!');
            } catch (err) {
                console.error('Error importing students:', err.stack);
                res.status(500).send('Server Error');
            }
        });
});

module.exports = router;
