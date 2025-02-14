const express = require('express');
// routes for teacher profile picture
const router = express.Router();
// const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp'); // Import sharp for image compression
const supabase = require('../../Configs/supabaseClient');
const jwt = require('jsonwebtoken');
// const cors = require('cors');

// // Initialize the Express app
// const app = express();

// // Middleware
// app.use(cookieParser());
// app.use(cors({
//     origin: [
//         'https://ghss-management.vercel.app', // Production frontend
//         'http://localhost:5173'               // Local development frontend
//     ],
//     credentials: true // Allow cookies to be sent
// }));

// Secret for JWT (change it to a secure value)
const SECRET_KEY = 'your_jwt_secret';
const upload = multer({
    storage: multer.memoryStorage()
}); // Temporary upload folder

// Middleware to extract user ID from cookies
const getUserIdFromCookie = (req) => {
    try {
        const token = req.cookies.AdminToken;

        if (!token) {
            throw new Error('Token not found');
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded.id);
        return decoded.id;
    } catch (error) {
        console.error(error);
        return null; // Handle invalid token or missing token case
    }
};

// 📌 Route to Upload Profile Picture (handles both upload and update)
router.post('/upload-profile', upload.single('profilePic'), async (req, res) => {
    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Read the uploaded file buffer
        // const fileBuffer = fs.readFileSync(req.file.path);
                const fileBuffer = req.file.buffer; // Get file buffer from memory

        const fileName = 'profile.jpg'; // Standardized profile pic name

        // Compress the image using sharp
        const compressedImageBuffer = await sharp(fileBuffer)
            .resize(400) // Resize to 400px width
            .jpeg({ quality: 80 }) // Compress the image to 80% quality
            .toBuffer(); // Convert the image to buffer for upload

        // Upload the compressed image to Supabase storage, overwriting any previous profile picture
        const { error } = await supabase.storage
            .from('ghss-profile-pics')
            .upload(`users/${userId}/${fileName}`, compressedImageBuffer, {
                upsert: true,
                cacheControl: '0', // Prevent caching issues
            });

        // fs.unlinkSync(req.file.path); // Delete temp file

        if (error) return res.status(500).json({ error: "Upload failed", details: error.message || 'No details available' });

        // Generate Public URL for the uploaded image
        const { data } = supabase.storage
            .from('ghss-profile-pics')
            .getPublicUrl(`users/${userId}/${fileName}`);

        return res.json({ message: "Upload successful", imageUrl: data.publicUrl });
    } catch (err) {
        console.error('Error during file upload:', err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
});

// 📌 Route to Get Profile Picture
router.get('/profile-pic', async (req, res) => {
    const userId = getUserIdFromCookie(req);

    if (!userId) {
        return res.status(400).json({ message: "User ID not found in cookies." });
    }

    try {
        // Fetch the teacher's name using userId
        const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('username')
            .eq('id', userId)
            .single();

        if (teacherError || !teacherData) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        const filePath = `users/${userId}/profile.jpg`;

        // Check if the profile picture exists in Supabase storage
        const { data: files, error: fileError } = await supabase
            .storage
            .from('ghss-profile-pics')
            .list(`users/${userId}/`);

        if (fileError) {
            return res.status(500).json({ message: "Error checking profile picture." });
        }

        // Check if `profile.jpg` exists in the folder
        const fileExists = files.some(file => file.name === "profile.jpg");

        if (!fileExists) {
            return res.json({ message: "Profile picture not found.",
                teacherName: teacherData.username, // Include teacher's name in the response

             });
        }

        // Generate public URL for the image
        const { data } = supabase.storage.from('ghss-profile-pics').getPublicUrl(filePath);

        res.json({
            imageUrl: `${data.publicUrl}?timestamp=${Date.now()}`,
            teacherName: teacherData.username, // Include teacher's name in the response
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



router.delete('/delete-profile-pic', async (req, res) => {
    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const fileName = 'profile.jpg'; // Standardized profile pic name
        const { error } = await supabase.storage
            .from('ghss-profile-pics')
            .remove([`users/${userId}/${fileName}`]);

        if (error) {
            return res.status(500).json({ error: "Failed to delete profile picture", details: error.message });
        }

        return res.json({ message: "Profile picture deleted successfully" });
    } catch (err) {
        console.error('Error deleting profile picture:', err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
});

// 📌 Route to Set Admin Token in Cookies (for testing)
router.get('/', (req, res) => {
    const token = jwt.sign({ id: '131', role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('AdminToken', token);
    res.json({ message: "Admin token set successfully!" });
});

module.exports = router;
// Start server
// app.listen(3000, () => console.log('Server running on port 3000'));

