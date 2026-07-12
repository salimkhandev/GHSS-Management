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
                background: 'var(--color-background)',
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
                        gap: { xs: 1.5, sm: 2 },
                        mb: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    <Button
                        variant={formType === 'manual' ? 'contained' : 'outlined'}
                        onClick={() => handleFormSelection('manual')}
                        sx={{
                            px: { xs: 3, sm: 4 },
                            py: 1.5,
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: { xs: '0.95rem', sm: '1.05rem' },
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            borderRadius: '12px',
                            minWidth: { xs: '140px', sm: '200px' },
                            border: '2px solid',
                            borderColor: formType === 'manual' ? 'var(--color-primary)' : 'var(--color-border)',
                            backgroundColor: formType === 'manual' ? 'var(--gradient-primary)' : 'var(--color-surface)',
                            color: formType === 'manual' ? 'white' : 'var(--color-primary)',
                            boxShadow: formType === 'manual'
                                ? '0 4px 16px rgba(26, 35, 126, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: formType === 'manual' ? 'var(--gradient-primary)' : 'var(--color-surface-raised)',
                                borderColor: 'var(--color-primary)',
                                transform: 'translateY(-2px)',
                                boxShadow: formType === 'manual'
                                    ? '0 8px 24px rgba(26, 35, 126, 0.4)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
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
                            py: 1.5,
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: { xs: '0.95rem', sm: '1.05rem' },
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            borderRadius: '12px',
                            minWidth: { xs: '140px', sm: '200px' },
                            border: '2px solid',
                            borderColor: formType === 'bulk' ? 'var(--color-primary)' : 'var(--color-border)',
                            backgroundColor: formType === 'bulk' ? 'var(--gradient-primary)' : 'var(--color-surface)',
                            color: formType === 'bulk' ? 'white' : 'var(--color-primary)',
                            boxShadow: formType === 'bulk'
                                ? '0 4px 16px rgba(26, 35, 126, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: formType === 'bulk' ? 'var(--gradient-primary)' : 'var(--color-surface-raised)',
                                borderColor: 'var(--color-primary)',
                                transform: 'translateY(-2px)',
                                boxShadow: formType === 'bulk'
                                    ? '0 8px 24px rgba(26, 35, 126, 0.4)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
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
