const express =require('express')
const router=express.Router()
const pool=require('../../Configs/dbConfig')
const {authenticateToken}=require('../Middlewares/middlewares')
const jwt = require('jsonwebtoken')


router.get('/attendanceGroupedByDate', async (req, res) => {
    const token = req.cookies.TeacherToken;
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    let class_id;
    let section_id;


    try {
        // Verify the JWT token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
                if (err) {
                    return reject(err);

                }
                resolve(decoded);
            });
        });

        // Extract class_id and section_id from the decoded token
        class_id = decoded.class_id;
        section_id = decoded.section_id;

        const results = await pool.query(
            `SELECT 
                TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
                json_agg(
                    json_build_object(
                        'id', a.id,
                        'student_name', s.name,
                        'status', a.status
                    )
                ) AS records
            FROM 
                attendance a
            INNER JOIN 
                students s ON a.student_id = s.id
            WHERE 
                a.class_id = $1 AND a.section_id = $2
            GROUP BY 
                a.attendance_date
            ORDER BY 
                a.attendance_date DESC`,
            [class_id, section_id]
        );

        // Send the results as JSON
        res.json(results.rows);

    } catch (error) {
        console.error('Error fetching grouped attendance records:', error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});


router.get('/lastAttendanceDate', async (req, res) => {
    const TeacherToken = req.cookies.TeacherToken;

    // Verify the JWT token
    jwt.verify(TeacherToken, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        // Extract class_id and section_id from the decoded token
        const { class_id, section_id } = decoded;

        try {
            // Fetch the last attendance date for the given class and section, formatted as 'YYYY-MM-DD'
            const result = await pool.query(
                `SELECT  
                    TO_CHAR(attendance_date, 'YYYY-MM-DD') AS attendance_last_date
                 FROM attendance 
                 WHERE class_id = $1 AND section_id = $2
                 ORDER BY attendance_date DESC 
                 LIMIT 1`,
                [class_id, section_id]
            );

            if (result.rows.length > 0) {
                res.json({ last_attendance_date: result.rows[0].attendance_last_date });
            } else {
                res.json({ last_attendance_date: null });
            }
        } catch (error) {
            console.error('Error fetching last attendance date:', error);
            res.status(500).json({ error: 'Failed to fetch last attendance date' });
        }
    });
});

router.post('/saveAttendance', async (req, res) => {
    const { attendanceData, attendanceDate } = req.body;
    try {
        // Insert all attendance records into the database
        const insertPromise = attendanceData.map((record) => {
            return pool.query(
                `INSERT INTO attendance (student_id, class_id, section_id, attendance_date, status)
        VALUES ($1, $2, $3, $4, $5)`,
                [record.student_id, record.class_id, record.section_id, attendanceDate, record.status]
            );

        })


        await Promise.all(insertPromise);
        res.status(200).send('Attendance records saved successfully.');
    }
    catch (err) {
        console.error('Error saving attendance records:', err.message);
        res.status(500).send('Server error');
    }
})


router.get('/studentsAttendance', authenticateToken, async (req, res) => {
    try {
        const { class_id, section_id } = req.DECODED;

        console.log("😂😍🥰❤️📱😊😒🦞🦞🦞 ", req.DECODED);

        const result = await pool.query(
            'SELECT id, name, class_id, section_id FROM students WHERE class_id = $1 AND section_id = $2',
            [class_id, section_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/updateAttendance', async (req, res) => {
    const { id, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE attendance SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.json({ message: 'Attendance status updated successfully', updatedRecord: result.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while updating the status' });
    }
});


// router.get('/todayAttenPieModal', async (req, res) => {

// // class id and sec id from cookies 

//     const result = await pool.query('SELECT
// class_id,
//         section_id,
//         TO_CHAR(attendance_date, 'YYYY-MM-DD') AS attendance_date,
//         ROUND(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) AS present_percentage,
//         ROUND(SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) AS absent_percentage
// FROM
// attendance
// WHERE
// class_id = $1 
//     AND section_id = $2
//     AND attendance_date = (SELECT MAX(attendance_date) FROM attendance WHERE class_id = $1 AND section_id = $2)
// GROUP BY
//     class_id, section_id, attendance_date
// ORDER BY 
//     attendance_date DESC
// LIMIT 1;
// ', [class_id, section_id]);
//     res.json(result.rows);
// });

module.exports=router
