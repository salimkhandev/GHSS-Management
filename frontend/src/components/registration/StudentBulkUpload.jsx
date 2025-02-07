import { useState, useRef } from 'react';
import { Button, CircularProgress, Snackbar, Typography, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

function StudentBulkUpload() {
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const fileInputRef = useRef(null);

    // Function to handle CSV download
    const downloadCSVTemplate = () => {
        const csvData = [
            ["student_name", "section_name", "class_name"], // Column headers
            ["John Doe", "A", "Class 10"], // Example data
            ["Jane Smith", "B", "Class 9"]
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + csvData.map(row => row.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_registration_template.csv");
        document.body.appendChild(link);
        link.click();
    };

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
        <Box className="flex items-center justify-center min-h-screen bg-light p-4 ">
            <Box className="bg-white  border-x-green-400  border-2 border-blue-500 shadow-[5px_5px_20px_5px_rgba(0,0,0,0.5)] rounded-lg shadow-sm p-6 w-full max-w-md">
                <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    To upload students in bulk, please follow these steps:
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3,fontSize:14, textAlign: 'left' }}>
                    1. Download the CSV template by clicking the button below.<br />
                    2. Fill in the required student details in the CSV file.<br />
                    3. Upload the filled CSV file using the button below.
                </Typography>

                {/* Download CSV Template Button */}
                <button
                    className="border border-gray-500 text-gray-700 px-4 py-2 rounded-md block mx-auto mb-2 
             hover:bg-gray-100 
             focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
             active:bg-gray-200"
                    onClick={downloadCSVTemplate}
                >
                    Download CSV Template
                </button>



                {/* File Upload Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    accept=".csv"
                />

                {/* Upload Button */}
                <button
                    onClick={handleButtonClick}
                    disabled={loading}
                    className=" mx-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
             disabled:bg-blue-300 text-white font-medium px-6 py-2 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
             flex items-center justify-center gap-2"
                >
                    {loading ? <CircularProgress size={24} /> : <><UploadFileIcon /> Register in Bulk</>}
                </button>


                {/* Snackbar for success or error message */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                />
            </Box>
        </Box>
    );
}

export default StudentBulkUpload;
