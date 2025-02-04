const pool = require('../dbConfig');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAdmin, isAdminToken} =require('../Middlewares/middlewares')

router.post('/teacherLogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM teachers WHERE username = $1', [username]);
        const teacher = result.rows[0];

        if (teacher.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can login here' });
        }

        if (!teacher) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create a token for the teacher
        const TeacherToken = jwt.sign({ id: teacher.id, class_id: teacher.class_id, section_id: teacher.section_id, role: 'teacher' }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log("teacher token", TeacherToken);

        // Set token in HTTP-only cookie
        res.cookie('TeacherToken', TeacherToken, {
            httponly: true,  // Set to false for simplicity
            sameSite: 'None',
            secure: true,
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/register-teacher', isAdminToken, isAdmin, async (req, res) => {
    const { username, password, class_id, section_id, role } = req.body;
if (!username || !password || !class_id || !section_id || !role) {
        return res.status(400).json({ error: "All fields are required." });
    }
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
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
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
            httpOnly: true,  // Set to false for simplicity
            sameSite: 'None',
            secure: true,
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
    console.log("admin-login called", req.body);

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

        // Set a cookie on the response
        res.cookie('adminToken', token, {
            httpOnly: true,  // Set to false for simplicity
            sameSite: 'None',
            secure: true,
            maxAge: 3600000 // 1 hour
        });



        res.json({ message: 'Login successful bro' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports=router;