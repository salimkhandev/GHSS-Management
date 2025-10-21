import { Box, Button, Container } from '@mui/material';
import React, { useState } from 'react';
import StudentBulkUpload from './StudentBulkUpload';
import StudentRegistrationForm from './StudentRegistrationForm';

function StudentForm() {
    const [formType, setFormType] = useState('manual');

    const handleFormSelection = (form) => {
        setFormType(form);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)',
                py: { xs: 2, md: 3 },
                px: { xs: 1, sm: 2 }
            }}
        >
            <Container maxWidth="lg">
                {/* Top Button Navigation */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    <Button
                        variant={formType === 'manual' ? 'contained' : 'outlined'}
                        onClick={() => handleFormSelection('manual')}
                        sx={{
                            px: { xs: 3, sm: 4 },
                            py: 1.2,
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            borderRadius: '12px',
                            minWidth: { xs: '160px', sm: '200px' },
                            border: '2px solid',
                            borderColor: formType === 'manual' ? '#3F51B5' : '#d0d0d0',
                            backgroundColor: formType === 'manual' ? '#3F51B5' : 'white',
                            color: formType === 'manual' ? 'white' : '#3F51B5',
                            boxShadow: formType === 'manual'
                                ? '0px 4px 12px rgba(63, 81, 181, 0.3)'
                                : '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: formType === 'manual' ? '#303f9f' : '#f5f5f5',
                                borderColor: '#3F51B5',
                                transform: 'translateY(-2px)',
                                boxShadow: '0px 6px 16px rgba(63, 81, 181, 0.4)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            }
                        }}
                    >
                        Manual Registration
                    </Button>

                    <Button
                        variant={formType === 'bulk' ? 'contained' : 'outlined'}
                        onClick={() => handleFormSelection('bulk')}
                        sx={{
                            px: { xs: 3, sm: 4 },
                            py: 1.2,
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            borderRadius: '12px',
                            minWidth: { xs: '160px', sm: '200px' },
                            border: '2px solid',
                            borderColor: formType === 'bulk' ? '#3F51B5' : '#d0d0d0',
                            backgroundColor: formType === 'bulk' ? '#3F51B5' : 'white',
                            color: formType === 'bulk' ? 'white' : '#3F51B5',
                            boxShadow: formType === 'bulk'
                                ? '0px 4px 12px rgba(63, 81, 181, 0.3)'
                                : '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: formType === 'bulk' ? '#303f9f' : '#f5f5f5',
                                borderColor: '#3F51B5',
                                transform: 'translateY(-2px)',
                                boxShadow: '0px 6px 16px rgba(63, 81, 181, 0.4)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            }
                        }}
                    >
                        Bulk Upload
                    </Button>
                </Box>

                {/* Form Content - Reduced spacing */}
                <Box
                    sx={{
                        mt: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        minHeight: 'calc(100vh - 120px)'
                    }}
                >
                    {formType === 'manual' && <StudentRegistrationForm />}
                    {formType === 'bulk' && <StudentBulkUpload />}
                </Box>
            </Container>
        </Box>
    );
}

export default StudentForm;
