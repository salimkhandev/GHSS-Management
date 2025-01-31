const express =require('express')
const router=express.Router()
const pool=require('../dbConfig')
const jwt=('jsonwebtoken')
// const {authenticateToken}=require('../Middlewares/middlewares')

router.get('/', async (req, res) => {
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

        // Fetch attendance records grouped by date with student names
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

module.exports=router