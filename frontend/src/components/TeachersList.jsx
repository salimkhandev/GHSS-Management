import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const TeachersList = () => {
    const [teachers, setTeachers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch teachers' data from the API
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/TeachersList');
                setTeachers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch teachers data');
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress size={60} color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold',fontFamily: "Poppins", color: '#1976d2' }}>
                Teachers List
            </Typography>
            <Grid container spacing={4}>
                {Object.keys(teachers).map((className, index) => (
                    <Grid item xs={12} key={index}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold',fontFamily: "Poppins", color: '#1976d2' }}>
                            {className}
                        </Typography>
                        <Grid container spacing={3}>
                            {teachers[className].map((teacher, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Card sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        '&:hover': {
                                            boxShadow: 6,
                                        }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                                marginBottom: 1
                                            }}>
                                                {teacher.teacher_name}
                                            </Typography>
                                            <Typography variant="body1" sx={{
                                                color: '#555',
                                                marginBottom: 2
                                            }}>
                                                Section: {teacher.section_name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TeachersList;
