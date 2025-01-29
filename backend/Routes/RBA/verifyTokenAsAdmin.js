const pool = require('../../dbConfig');
const express = require('express');
const router = express.Router();

router.get('/verify-token-asAdmin', async (req, res) => {
    try {
        const token = req.cookies.adminToken;

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ authenticated: false, message: 'No token provided' });
        }

        jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
            if (err) {
                console.log('Token verification failed');
                return res.status(401).json({ authenticated: false, message: 'Token verification failed' });
            }

            if (decoded.role !== 'admin') {
                console.log('User is not an admin');
                return res.status(403).json({ authenticated: false, message: 'Access denied. Not an admin' });
            }

            // If admin, return success response
            return res.json({ authenticated: true, user: decoded });
        });

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;