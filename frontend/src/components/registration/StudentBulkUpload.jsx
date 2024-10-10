import { useState, useRef } from 'react';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

function StudentBulkUpload() {
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const fileInputRef = useRef(null);

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            await axios.post('https://ghss-management-backend.vercel.app/students/bulk', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSnackbar({ open: true, message: "Students imported successfully!✅" });
        } catch (error) {
            console.error('There was an error uploading the file!❌', error);
            setSnackbar({ open: true, message: "Failed to import students!❌" });
        } finally {
            setLoading(false);
            // Reset the file input after the upload
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: "" });
    };

    return (
        <div className="flex items-center justify-center mt-[-90px] bg-light">
            <div className="bg-white rounded-lg shadow-sm p-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    accept=".csv"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleButtonClick}
                    disabled={loading}
                    startIcon={!loading && <UploadFileIcon />} // Add the icon to the button
                >
                    {loading ? <CircularProgress size={24} /> : 'Upload CSV'}
                </Button>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                />
            </div>
        </div>
    );
}

export default StudentBulkUpload;
