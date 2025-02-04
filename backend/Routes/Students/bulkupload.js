const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const stream = require('stream');
const pool = require('../../Configs/dbConfig'); // Your database connection

const router = express.Router();

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    console.log("Hello from CSV insertion!");

    const queryClasses = 'SELECT * FROM classes';
    const querySections = 'SELECT * FROM sections';

    let classes = [];
    let sections = [];

    try {
        const classesResult = await pool.query(queryClasses);
        const sectionsResult = await pool.query(querySections);

        classes = classesResult.rows;
        sections = sectionsResult.rows;
    } catch (error) {
        console.error('Error executing queries', error);
        return res.status(500).send('Database query error');
    }

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
            // Log the row to check for missing data
            console.log(row);

            // Validate the row's required fields
            if (!row.student_name || !row.class_name || !row.section_name) {
                console.error('Missing data in CSV row:', row);
                return; // Skip the row if any required data is missing
            }

            // Find the class_id based on the class_name
            const classItem = classes.find(cls => cls.name === row.class_name);
            const class_id = classItem ? classItem.id : null; // Get the id or null if not found

            if (!class_id) {
                console.error('Class not found for row:', row);
                return; // Skip the row if class is not found
            }

            // Find the section_id based on the section_name
            const sectionItem = sections.find(sec => sec.name === row.section_name && sec.class_id === class_id);
            const section_id = sectionItem ? sectionItem.id : null; // Get the id or null if not found

            if (!section_id) {
                console.error('Section not found for row:', row);
                return; // Skip the row if section is not found
            }

            students.push([row.student_name, class_id, section_id]);
        })
        .on('end', async () => {
            if (students.length === 0) {
                return res.status(400).send('CSV file is empty or invalid.');
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
