const pool = require('../dbConfig');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/lastAttendanceDate', async (req, res) => {
    // Access the admin token from the cookies
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
const insertPromise=attendanceData.map((record)=>{
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
router.get('/studentAttendanceStatus', async (req, res) => {
    const { class_id, section_id } = req.query;
    try {
        // Query the database to get attendance data
        const result = await pool.query(`
            SELECT 
                TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
                json_agg(json_build_object(
                    'name', s.name, 
                    'status', a.status
                )) AS attendance_records
            FROM 
                attendance a
            JOIN 
                students s ON a.student_id = s.id
            WHERE 
                a.class_id = $1
                AND a.section_id = $2
            GROUP BY 
                a.attendance_date
            ORDER BY 
                a.attendance_date DESC;
        `,[class_id,section_id]);

        // Send the result as JSON response
        res.json(result.rows);
    } catch (error) {
        // Handle any errors that occurred during the query
        console.error('Error fetching student attendance status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/attendancePercentage', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                class_id,
                section_id,
              TO_CHAR(attendance_date, 'YYYY-MM-DD') AS attendance_date,
               ROUND( SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),2) AS present_percentage,
               ROUND( SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),2) AS absent_percentage
            FROM 
                attendance
            GROUP BY 
                class_id, section_id, attendance_date;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).send('Server Error');
    }
});

//LOGIN FOR TEACHERS FOR THIER OWN CLASSES

router.post('/teacherLogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM teachers WHERE username = $1', [username]);
        const teacher = result.rows[0];

        if (!teacher) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create a token for the teacher
        const TeacherToken = jwt.sign({ id: teacher.id, class_id: teacher.class_id, section_id: teacher.section_id }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log("teacher token", TeacherToken);

        // Set token in HTTP-only cookie
        res.cookie('TeacherToken', TeacherToken, {
      httpOnly: false,  // Set to false for simplicity
    sameSite: 'None',
    secure:true,
    maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const teacherToken = req.cookies.TeacherToken; // Access the token from the cookie
    // Access the token from theteacherToken; // Access the token from the cookie

   

    jwt.verify(teacherToken, 'your_jwt_secret', (err, DECODED) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }   
        req.DECODED = DECODED;
        next(); // Proceed to the next middleware or route handler
    }
    )
    
}
function isAdminToken(req, res, next) {
    const adminToken = req.cookies.adminToken;    // Access the token from theteacherToken; // Access the token from the cookie

   

    jwt.verify(adminToken, 'your_jwt_secret', (err, DECODED) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }   
        req.DECODED = DECODED;
        next(); // Proceed to the next middleware or route handler
    }
    )
    
}



router.get('/studentsAttendance', authenticateToken, async (req, res) => {
    try {
        const { class_id, section_id } = req.DECODED;

        console.log("😂😍🥰❤️📱😊😒🦞🦞🦞 ",req.DECODED);
        
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

// Middleware to check if user is an admin

function isAdmin(req, res, next) {
    if (req.DECODED && req.DECODED.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}



router.post('/register-teacher', isAdminToken, isAdmin, async (req, res) => {
    const { username, password, class_id, section_id, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newRole = role || 'teacher'; // Default to 'teacher' if no role is provided

        await pool.query(
            'INSERT INTO teachers (username, password, class_id, section_id, role) VALUES ($1, $2, $3, $4, $5)',
            [username, hashedPassword, class_id, section_id, newRole]
        );

        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin registration route
router.post('/admin-register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new admin into the database
        const result = await pool.query(
            'INSERT INTO teachers (username, password, role) VALUES ($1, $2, $3) RETURNING id,role',
            [username, hashedPassword, 'admin']
        );
        const admin = result.rows[0];

        const token = jwt.sign({ id: admin.id, role: admin.role }, 'your_jwt_secret', { expiresIn: '1h' });


        res.cookie('adminToken', token, {
        httpOnly: false,  // Set to false for simplicity
    sameSite: 'None',
    secure:true,
    maxAge: 3600000 // 1 hour
        });
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});
// Admin login route
router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;
console.log("admin-login called",req.body);

    try {
        const result = await pool.query('SELECT * FROM teachers WHERE username = $1', [username]);
        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch || admin.role !== 'admin') {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: admin.id, role: admin.role }, 'your_jwt_secret', { expiresIn: '1h' });
    const isProduction = process.env.NODE_ENV === 'production';

// Set a cookie on the response
res.cookie('adminToken', token, {
    httpOnly: false,  // Set to false for simplicity
    sameSite: 'None',
    secure:false,
    maxAge: 3600000 // 1 hour
});  



        res.json({ message: 'Login successful bro' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// 😂😍🥰❤️📱😊😒🦞🦞🦞 
router.get('/verify-token-asAdmin', async (req, res) => {
    try {
        const result = await pool.query('SELECT role FROM teachers WHERE role = $1', ['admin']);
        const adminExists = result.rowCount > 0;

        if (!adminExists) {
            // No admin exists, prompt for admin registration
            console.log('no admin exists');
            return res.json({ RegisterAdmin: true });
        }

        const token = req.cookies.adminToken;

        if (!token) {
            console.log('no token provided');
            
            return res.status(401).json({ authenticated: false, message: 'No token provided' });
        }

        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                console.log('token verification failed');
                return res.status(401).json({ authenticated: false, message: 'Token verification failed' });
            }
            res.json({ authenticated: true, user: decoded });
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.get('/verify-token-asTeacher', (req, res) => {
    const token = req.cookies.TeacherToken;
    if (!token) return res.status(401).json({ authenticated: false });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).json({ authenticated: false });
        res.json({ authenticated: true, user: decoded });
    });
});
// Express route to fetch attendance records grouped by date for a specific class and section
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
module.exports=router;

