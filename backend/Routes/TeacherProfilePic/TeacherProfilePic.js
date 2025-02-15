const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp'); // For image compression
const supabase = require('../../Configs/supabaseClient');
const jwt = require('jsonwebtoken');
const pool = require('../../Configs/dbConfig'); // PostgreSQL connection

const SECRET_KEY = 'your_jwt_secret';

// Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Extract user ID from cookies
 */
const getUserIdFromCookie = (req) => {
    try {
        const token = req.cookies.adminToken || req.cookies.TeacherToken;
        if (!token) throw new Error("Token not found");
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.id;
    } catch (error) {
        return null;
    }
};

/**
 * 📌 Upload Profile Picture & Store URL in PostgreSQL
 */
router.post('/upload-profile', upload.single('profilePic'), async (req, res) => {
    const userId = getUserIdFromCookie(req);
    // const userId = "131";
    console.log("userId",userId);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const fileBuffer = req.file.buffer;
        const fileName = `users/${userId}/profile.jpg`;

        // Compress image
        const compressedImageBuffer = await sharp(fileBuffer)
            .resize(400)
            .jpeg({ quality: 80 })
            .toBuffer();

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('ghss-profile-pics')
            .upload(fileName, compressedImageBuffer, { upsert: true, cacheControl: '0' });

        if (uploadError) return res.status(500).json({ error: "Upload failed", details: uploadError.message });

        // Get Public URL
        const { data } = supabase.storage.from('ghss-profile-pics').getPublicUrl(fileName);
        const profilePicUrl = data.publicUrl;

        // Store URL in PostgreSQL
        await pool.query("UPDATE teachers SET profile_pic_url = $1 WHERE id = $2", [profilePicUrl, userId]);

        res.json({ message: "Upload successful", imageUrl: profilePicUrl });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

/**
 * 📌 Get Profile Picture from Database
 */
router.get('/profile-pic', async (req, res) => {
    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const result = await pool.query("SELECT username, profile_pic_url FROM teachers WHERE id = $1", [userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json({
            teacherName: result.rows[0].username,
            imageUrl: result.rows[0].profile_pic_url || null,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile picture", error: error.message });
    }
});

/**
 * 📌 Delete Profile Picture
 */
router.delete('/delete-profile-pic', async (req, res) => {
    const userId = getUserIdFromCookie(req);
    // const userId = "131";
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Get profile pic URL from DB
        const result = await pool.query("SELECT profile_pic_url FROM teachers WHERE id = $1", [userId]);
        if (result.rows.length === 0 || !result.rows[0].profile_pic_url) {
            return res.status(404).json({ message: "No profile picture found" });
        }

        const fileName = `users/${userId}/profile.jpg`;

        // Delete from Supabase Storage
        const { error } = await supabase.storage.from('ghss-profile-pics').remove([fileName]);
        if (error) return res.status(500).json({ error: "Failed to delete image", details: error.message });

        // Remove profile pic URL from DB
        await pool.query("UPDATE teachers SET profile_pic_url = NULL WHERE id = $1", [userId]);

        res.json({ message: "Profile picture deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

module.exports = router;
