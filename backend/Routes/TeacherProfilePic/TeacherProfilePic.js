const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp'); // For image compression
const supabase = require('../../Configs/supabaseClient');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_jwt_secret';

// Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Extract user ID from cookies
 */
const getUserIdFromCookie = (req) => {
    try {
        const token = req.cookies.adminToken || req.cookies.TeacherToken;

        if (!token) {
            console.error("[Auth Error] Token not found");
            throw new Error("Token not found");
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("[Auth] User ID extracted:", decoded.id);
        return decoded.id;
    } catch (error) {
        console.error("[Auth Error] Invalid or missing token:", error.message);
        return null;
    }
};

/**
 * 📌 Upload Profile Picture
 */
router.post('/upload-profile', upload.single('profilePic'), async (req, res) => {
    console.log("[Upload] Received profile picture upload request");

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        console.log("[Upload] Processing image for user:", userId);

        const fileBuffer = req.file.buffer; // Get file buffer from memory
        const fileName = 'profile.jpg';

        // Compress and resize the image
        const compressedImageBuffer = await sharp(fileBuffer)
            .resize(400) // Resize to 400px width
            .jpeg({ quality: 80 }) // 80% compression
            .toBuffer();

        console.log("[Upload] Image processed successfully");

        // Upload to Supabase
        const { error } = await supabase.storage
            .from('ghss-profile-pics')
            .upload(`users/${userId}/${fileName}`, compressedImageBuffer, {
                upsert: true,
                cacheControl: '0',
            });

        if (error) {
            console.error("[Upload Error] Upload to Supabase failed:", error.message);
            return res.status(500).json({ error: "Upload failed", details: error.message });
        }

        // Get Public URL
        const { data } = supabase.storage
            .from('ghss-profile-pics')
            .getPublicUrl(`users/${userId}/${fileName}`);

        console.log("[Upload] Image uploaded successfully:", data.publicUrl);
        return res.json({ message: "Upload successful", imageUrl: data.publicUrl });

    } catch (err) {
        console.error("[Server Error] During file upload:", err.message);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
});

/**
 * 📌 Get Profile Picture
 */
router.get('/profile-pic', async (req, res) => {
    console.log("[Fetch] Request received for profile picture");

    const userId = getUserIdFromCookie(req);
    if (!userId) {
        console.error("[Fetch Error] User ID missing in cookies");
        return res.status(400).json({ message: "User ID not found in cookies." });
    }

    try {
        console.log("[Fetch] Fetching teacher details for user:", userId);

        // Fetch username
        const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('username')
            .eq('id', userId)
            .single();

        if (teacherError || !teacherData) {
            console.error("[Fetch Error] Teacher not found in database");
            return res.status(404).json({ message: "Teacher not found." });
        }

        console.log("[Fetch] Teacher found:", teacherData.username);

        // Check if profile picture exists
        const filePath = `users/${userId}/profile.jpg`;
        const { data: files, error: fileError } = await supabase
            .storage
            .from('ghss-profile-pics')
            .list(`users/${userId}/`);

        if (fileError) {
            console.error("[Fetch Error] Checking storage for profile picture failed:", fileError.message);
            return res.status(500).json({ message: "Error checking profile picture." });
        }

        const fileExists = files.some(file => file.name === "profile.jpg");

        if (!fileExists) {
            console.log("[Fetch] No profile picture found for user:", userId);
            return res.json({
                message: "Profile picture not found.",
                teacherName: teacherData.username,
            });
        }

        // Generate public URL
        const { data } = supabase.storage.from('ghss-profile-pics').getPublicUrl(filePath);

        console.log("[Fetch] Returning profile picture URL:", data.publicUrl);
        res.json({
            imageUrl: `${data.publicUrl}?timestamp=${Date.now()}`,
            teacherName: teacherData.username,
        });

    } catch (error) {
        console.error("[Fetch Error] Internal server error:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

/**
 * 📌 Delete Profile Picture
 */
router.delete('/delete-profile-pic', async (req, res) => {
    console.log("[Delete] Request received for profile picture deletion");

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        console.log("[Delete] Deleting profile picture for user:", userId);

        const fileName = 'profile.jpg';
        const { error } = await supabase.storage
            .from('ghss-profile-pics')
            .remove([`users/${userId}/${fileName}`]);

        if (error) {
            console.error("[Delete Error] Failed to delete profile picture:", error.message);
            return res.status(500).json({ error: "Failed to delete profile picture", details: error.message });
        }

        console.log("[Delete] Profile picture deleted successfully for user:", userId);
        return res.json({ message: "Profile picture deleted successfully" });

    } catch (err) {
        console.error("[Delete Error] Server error:", err.message);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
});

module.exports = router;
