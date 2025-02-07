import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import axios from 'axios';
import * as Yup from 'yup';


const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    class_id: Yup.number().required('Class is required'),
    section_id: Yup.number().required('Section is required'),
});

function StudentRegistrationForm() {
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });

    useEffect(() => {
        // Fetch classes and sections from the backend
        axios.get('https://ghss-management-backend.vercel.app/classes')
            .then(response => {
                setClasses(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the classes!', error);
            });

        axios.get('https://ghss-management-backend.vercel.app/sections')
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
        setSnackbar({ open: false, message: "" });
    };

    return (
    
        <div className="flex items-center justify-center min-h-screen bg-gray-100  p-4">
            <div className="w-full shadow-[5px_5px_20px_5px_rgba(0,0,0,0.5)]   border-x-green-400  border-2 border-blue-500 max-w-md bg-white 0 p-6 rounded-lg">
                    <h2 className="text-center text-2xl mb-6 font-serif text-gray-800">Student Registration Form</h2>
                <Formik 
                initialValues={{ name: '', class_id: '', section_id: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    setLoading(true);
                    axios.post('https://ghss-management-backend.vercel.app/students', values)
                        .then(response => {
                            setSnackbar({ open: true, message: "Student registered successfully!✅" });
                        })
                        .catch(error => {
                            console.error('There was an error saving the student data!❌', error);
                        })
                        .finally(() => setLoading(false));
                }}
            >
                {({ setFieldValue, errors, touched }) => (
                        <Form >
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700">Name:</label>
                            <Field type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
                            <ErrorMessage name="name" component="div" className="text-red-600 mt-1 text-sm" />
                        </div>

                        <div className="mb-4">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="class_id">Select Class</InputLabel>
                                <Field
                                    as={Select}
                                    id="class_id"
                                    name="class_id"
                                    label="Class Class"
                                    onChange={(e) => {
                                        const class_id = e.target.value;
                                        setFieldValue("class_id", class_id);
                                        handleClassChange(class_id); // Filter sections
                                        setFieldValue("section_id", ''); // Reset section when class changes
                                    }}
                                    className="mt-1"
                                >
                                    {classes.map(cls => (
                                        <MenuItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <FormHelperText>{errors.class_id && touched.class_id ? errors.class_id : ''}</FormHelperText>
                            </FormControl>
                        </div>

                        <div className="mb-4">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="section_id">Select Section</InputLabel>
                                <Field
                                    as={Select}
                                    id="section_id"
                                    name="section_id"
                                    label="Select Section"
                                    className="mt-1"
                                >
                                    {filteredSections.map(section => (
                                        <MenuItem key={section.id} value={section.id}>
                                            {section.name}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <FormHelperText>{errors.section_id && touched.section_id ? errors.section_id : ''}</FormHelperText>
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-center mt-4">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="w-full py-2"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Submit'}
                            </Button>
                        </div>
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
        </div>
        </div>
    );
}

export default StudentRegistrationForm;
