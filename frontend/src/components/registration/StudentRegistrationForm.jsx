import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, TextField, Paper, Typography, Box, useTheme } from '@mui/material';
import axios from 'axios';
import * as Yup from 'yup';
import apiBase from '../../config/api';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    class_id: Yup.number().required('Class is required'),
    section_id: Yup.number().required('Section is required'),
});

function StudentRegistrationForm() {
    const theme = useTheme();
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        // Fetch classes and sections from the backend
        axios.get(`${apiBase}/classes`)
            .then(response => {
                setClasses(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the classes!', error);
            });

        axios.get(`${apiBase}/sections`)
            .then(response => {
                setSections(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the sections!', error);
            });
    }, []);

    const handleClassChange = (class_id) => {
        // Filter sections based on selected class
        const filtered = sections.filter(section => section.class_id === parseInt(class_id));
        setFilteredSections(filtered);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    background: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'var(--gradient-primary)'
                    }
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    align="center"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        fontFamily: "'Poppins', sans-serif"
                    }}
                >
                    Student Registration Form
                </Typography>

                <Formik
                    initialValues={{ name: '', class_id: '', section_id: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        setLoading(true);
                        axios.post(`${apiBase}/students`, values)
                            .then(response => {
                                setSnackbar({ open: true, message: "Student registered successfully! ✅", severity: "success" });
                                resetForm();
                                setFilteredSections([]);
                            })
                            .catch(error => {
                                console.error('There was an error saving the student data! ❌', error);
                                setSnackbar({ open: true, message: "Failed to register student. ❌", severity: "error" });
                            })
                            .finally(() => setLoading(false));
                    }}
                >
                    {({ setFieldValue, errors, touched, values, handleBlur, handleChange }) => (
                        <Form>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Student Name"
                                    variant="outlined"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    placeholder="Enter full name"
                                />

                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    error={touched.class_id && Boolean(errors.class_id)}
                                >
                                    <InputLabel id="class-label">Select Class</InputLabel>
                                    <Select
                                        labelId="class-label"
                                        id="class_id"
                                        name="class_id"
                                        value={values.class_id}
                                        label="Select Class"
                                        onChange={(e) => {
                                            const class_id = e.target.value;
                                            setFieldValue("class_id", class_id);
                                            handleClassChange(class_id); // Filter sections
                                            setFieldValue("section_id", ''); // Reset section when class changes
                                        }}
                                        onBlur={handleBlur}
                                    >
                                        {classes.map(cls => (
                                            <MenuItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {touched.class_id && errors.class_id}
                                    </FormHelperText>
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    error={touched.section_id && Boolean(errors.section_id)}
                                    disabled={!values.class_id}
                                >
                                    <InputLabel id="section-label">Select Section</InputLabel>
                                    <Select
                                        labelId="section-label"
                                        id="section_id"
                                        name="section_id"
                                        value={values.section_id}
                                        label="Select Section"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {filteredSections.map(section => (
                                            <MenuItem key={section.id} value={section.id}>
                                                {section.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {touched.section_id && errors.section_id}
                                    </FormHelperText>
                                </FormControl>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontFamily: "'Poppins', sans-serif",
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        background: 'var(--gradient-primary)',
                                        '&:hover': {
                                            background: 'var(--gradient-primary)',
                                            boxShadow: '0px 6px 16px var(--color-primary-light)',
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Student'}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                />
            </Paper>
        </Box>
    );
}

export default StudentRegistrationForm;
