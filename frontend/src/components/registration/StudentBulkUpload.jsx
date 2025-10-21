import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import apiBase from '../../config/api';

function StudentBulkUpload() {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const fileInputRef = useRef(null);

    const downloadCSVTemplate = () => {
        const csvData = [
            ["student_name", "section_name", "class_name"],
            ["John Doe", "A", "Class 10"],
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
            await axios.post(`${apiBase}/students/bulk`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSnackbar({
                open: true,
                message: "Students imported successfully!",
                severity: "success"
            });
        } catch (error) {
            console.error('Upload error:', error);
            setSnackbar({
                open: true,
                message: "Failed to import students. Please try again.",
                severity: "error"
            });
        } finally {
            setLoading(false);
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

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 500,
            mx: 'auto'
        }}>
            <Paper elevation={0} sx={{
                width: '100%',
                p: { xs: 2.5, sm: 3 },
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                }
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontFamily: "'Poppins', sans-serif",
                        textAlign: 'center'
                    }}
                >
                    Bulk Student Registration
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 2.5,
                        color: theme.palette.text.secondary,
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.6,
                        fontSize: '0.875rem'
                    }}
                >
                    Follow these steps to register multiple students:
                    <Box component="ol" sx={{ mt: 1.5, pl: 2, mb: 0 }}>
                        <li>Download the CSV template using the button below</li>
                        <li>Fill in the student details in the CSV file</li>
                        <li>Upload the completed CSV file</li>
                    </Box>
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    mb: 0
                }}>
                    <Button
                        variant="outlined"
                        onClick={downloadCSVTemplate}
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            borderRadius: 2,
                            py: 1.5,
                            width: '100%',
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                backgroundColor: 'rgba(63, 81, 181, 0.04)'
                            }
                        }}
                    >
                        Download Template
                    </Button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                        accept=".csv"
                    />

                    <Button
                        variant="contained"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            borderRadius: 2,
                            py: 1.5,
                            width: '100%',
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                            '&.Mui-disabled': {
                                backgroundColor: theme.palette.action.disabledBackground,
                                color: theme.palette.action.disabled
                            }
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                <span>Uploading...</span>
                            </Box>
                        ) : (
                            'Upload CSV File'
                        )}
                    </Button>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        elevation={6}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
}

export default StudentBulkUpload;
