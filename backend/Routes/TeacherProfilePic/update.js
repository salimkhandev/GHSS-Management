const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const supabase = require('../../Configs/supabaseClient');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Setup express app
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: [
        'https://ghss-management.vercel.app', // Production frontend
        'http://localhost:5173'               // Local development frontend
    ],
    credentials: true // Allow cookies to be sent
}));

// Setup JWT secret and multer for file uploads
const SECRET_KEY = 'your_jwt_secret';
const upload = multer({ dest: 'uploads/' }); // Temporary upload folder

// Middleware to extract user ID from cookies
const getUserIdFromCookie = (req) => {
    try {
        const token = req.cookies.AdminToken;

        if (!token) {
            throw new Error('Token not found');
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.id;
    } catch (error) {
        console.error(error);
        return null; // or throw an error depending on your use case
    }
};

// 📌 Route to Upload Profile Picture
app.post('/update-profile-pic', upload.single('profilePic'), async (req, res) => {
    const userId = getUserIdFromCookie(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Read the uploaded file
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileName = 'profile.jpg'; // Standardized profile pic name

        // Upload the new file to Supabase storage (overwrite the existing one)
        const { error } = await supabase.storage
            .from('ghss-profile-pics')
            .upload(`users/${userId}/${fileName}`, fileBuffer, {
                upsert: true, // Overwrite the existing profile picture
                cacheControl: '0', // Prevent caching issues
                contentType: req.file.mimetype, // Set the correct content type based on the file uploaded
            });

        fs.unlinkSync(req.file.path); // Delete temp file after upload

        if (error) {
            console.error('Error uploading file:', error);
            return res.status(500).json({ error: 'Error updating profile picture' });
        }

        // Fetch the updated public URL
        const { data: publicUrlData } = await supabase.storage.from('ghss-profile-pics').getPublicUrl(`users/${userId}/${fileName}`);

        if (publicUrlData) {
            // Append timestamp to force cache refresh
            const updatedUrl = `${publicUrlData.publicUrl}?timestamp=${Date.now()}`;
            console.log('Updated File URL:', updatedUrl);

            return res.json({ message: 'Profile picture updated successfully', imageUrl: updatedUrl });
        } else {
            console.error('Error retrieving updated URL');
            return res.status(500).json({ error: 'Error retrieving updated URL' });
        }
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Start the server
app.listen(3002, () => console.log('Server running on port 3002'));
