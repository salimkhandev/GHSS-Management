const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('./supabaseClient'); // Your Supabase client
const router = express.Router();
// Your secret key used to sign the JWT
const JWT_SECRET = 'your_jwt_secret';
// API to fetch public profile picture URL
router.get('/teacher-profile-pic', async (req, res) => {
    try {
        // Step 1: Extract the JWT token from cookies
        const token = req.cookies?.TeacherToken; // Assuming the cookie is named 'authToken'
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided.',
            });
        }
        // Step 2: Verify and decode the JWT
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Invalid token.',
            });
        }
        // Step 3: Extract teacher ID from the decoded token
        const teacherId = decoded.id;
        if (!teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token: Teacher ID not found.',
            });
        }
        // Step 4: Query the database to fetch the profile picture URL
        const { data, error } = await supabase
            .from('teachers')
            .select('profile_pic_url')
            .eq('id', teacherId)
            .single();
        if (error) {
            return res.status(500).json({
                success: false,
                message: `Error fetching teacher details: ${error.message}`,
            });
        }
        // Step 5: Respond with the public URL
        if (data && data.profile_pic_url) {
            res.status(200).json({
                success: true,
                profilePicUrl: data.profile_pic_url,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Profile picture not found for this teacher.',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: `An unexpected error occurred: ${err.message}`,
        });
    }
});
module.exports = router;