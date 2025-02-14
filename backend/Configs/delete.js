const supabase = require('./supabaseClient');

const bucketName = 'ghss-profile-pics';
const filePath = 'admins.png'; // Path inside the bucket

async function deleteFile() {
    const { data, error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
        console.error('Error deleting file:', error);
    } else {
        console.log('File deleted successfully:', data);
    }
}

// Run delete function
deleteFile();
