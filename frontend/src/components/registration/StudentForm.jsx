import { useState } from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import StudentRegistrationForm from './StudentRegistrationForm';
import StudentBulkUpload from './StudentBulkUpload';

function StudentForm() {
    const [formType, setFormType] = useState(null);

    const handleFormSelection = (form) => {
        setFormType(form);
    };

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Grid container spacing={3} sx={{ maxWidth: 600, width: '100%' }}>
                <Grid item xs={12} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                        How do you want to add Students?
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign="center">
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 2, padding: '12px 20px' }}
                        onClick={() => handleFormSelection('manual')}
                    >
                        Manual Registration
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ padding: '12px 20px' }}
                        onClick={() => handleFormSelection('bulk')}
                    >
                        Bulk Upload
                    </Button>
                </Grid>
                <Grid item xs={12} sx={{ mt: 3 }}>
                    {formType === 'manual' && <StudentRegistrationForm />}
                    {formType === 'bulk' && <StudentBulkUpload />}
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentForm;
