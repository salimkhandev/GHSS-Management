const pool = require('../dbConfig');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');  // ✅ Import JWT


router.get('/', (req, res) => {
    try {
        const token = req.cookies.TeacherToken;

        if (!token) {
            return res.status(401).json({ authenticated: false, message: 'No token provided' });
        }

        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ authenticated: false, message: 'Invalid token' });
            }

            if (decoded.role !== 'teacher') {
                return res.status(403).json({ authenticated: false, message: 'Access denied. Not a teacher' });
            }

            return res.json({ authenticated: true, user: decoded });
        });

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;