const fs = require('fs');
const supabase = require('./supabaseClient');

const bucketName = 'ghss-profile-pics';
const filePath = 'admins.png'; // Destination path in the bucket
const localFilePath = './frontend/public/images/carousel9.jpg'; // Path to the local file

async function uploadFile() {
    try {
        const fileBuffer = fs.readFileSync(localFilePath);

        const { data, error } = await supabase.storage.from(bucketName).upload(filePath, fileBuffer, {
            cacheControl: '0', // Prevents caching issues
            upsert: false // Prevents overwriting existing files
        });

        if (error) {
            console.error('Error uploading file:', error);
        } else {
            console.log('File uploaded successfully:', data);
        }
    } catch (err) {
        console.error('File read error:', err);
    }
}

// Run upload function
uploadFile();
