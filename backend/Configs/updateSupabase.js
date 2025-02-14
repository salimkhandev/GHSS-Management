const fs = require('fs');
const supabase = require('./supabaseClient');

const bucketName = 'ghss-profile-pics';
const filePath = 'admins.png'; // Path inside the bucket
const localFilePath = './frontend/public/images/carousel9.jpg'; // Replace with actual file path

async function updateFile() {
    try {
        const newFile = fs.readFileSync(localFilePath);

        // Upload file (overwrite existing one)
        const { data, error } = await supabase.storage.from(bucketName).upload(filePath, newFile, {
            upsert: true,
            cacheControl: '0', // Helps prevent caching issues
            contentType: 'image/png'
        });

        if (error) {
            console.error('Error updating file:', error);
            return;
        }

        console.log('File updated successfully:', data);

        // Fetch the updated public URL
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        if (publicUrlData) {
            // Append timestamp to force cache refresh
            const updatedUrl = `${publicUrlData.publicUrl}?timestamp=${Date.now()}`;
            console.log('Updated File URL:', updatedUrl);
        } else {
            console.error('Error retrieving updated URL');
        }
    } catch (err) {
        console.error('File read error:', err);
    }
}

// Run update function
updateFile();
