import {
    School as SchoolIcon,
    Person as TeacherIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Skeleton,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TeachersList = () => {
    const theme = useTheme();
    const [teachers, setTeachers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/TeachersList');
                setTeachers(response.data);
            } catch (err) {
                setError('Failed to fetch teachers data');
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) {
        return (
            <Box sx={{ p: { xs: 4, sm: 6 } }}>
                {/* Header Skeleton */}
                <Skeleton 
                    variant="rectangular"
                    sx={{
                        height: { xs: 60, sm: 80 },
                        width: '50%',
                        mx: 'auto',
                        mb: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        opacity: 0.1,
                        // p: { xs: 2, sm: 3, md: ['8px'] },
                      
                    }}
                />
                
                {/* Class Title Skeleton */}
                <Skeleton 
                    variant="text" 
                    width={200}
                    sx={{ 
                        height: 40,
                        mb: 3,
                        borderRadius: 1
                    }}
                />

                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <Card sx={{
                                height: '100%',
                                borderRadius: 2,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    {/* Teacher Name with Icon */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Skeleton variant="circular" width={32} height={32} />
                                        <Skeleton variant="text" width="70%" height={32} />
                                    </Box>
                                    
                                    {/* Section Info */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <Skeleton variant="text" width="50%" height={24} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                color: theme.palette.error.main
            }}>
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 4 },
            background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)'
        }}>
            <Box sx={{ 
                mb: { xs: 4, sm: 6 },
                textAlign: 'center',
                width: '50%',
                mx: 'auto',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                borderRadius: 2,
                p: { xs: 2, sm: 3, md: ['8px'] },
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center',
                        gap: 2,
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1rem', md: '1.6rem' },
                        fontFamily: "'Poppins', sans-serif",
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    <TeacherIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' } }} />
                    Teachers List
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {Object.keys(teachers).map((className, index) => (
                    <Grid item xs={12} key={index}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 3,
                                fontWeight: 600,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                fontFamily: "'Poppins', sans-serif",
                                color: theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                pl: 1,
                                borderLeft: `4px solid ${theme.palette.primary.main}`
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }} />
                            {className}
                        </Typography>

                        <Grid container spacing={3}>
                            {teachers[className].map((teacher, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            '& .teacher-name': {
                                                color: theme.palette.primary.main
                                            }
                                        },
                                        background: 'linear-gradient(135deg, white, #fafafa)'
                                    }}>
                                        <CardContent sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            gap: 2,
                                            p: { xs: 2, sm: 3 }
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                <TeacherIcon sx={{ 
                                                    color: theme.palette.primary.main,
                                                    fontSize: { xs: '1.5rem', sm: '1.75rem' }
                                                }} />
                                                <Typography 
                                                    className="teacher-name"
                                                    variant="h6" 
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                                        fontFamily: "'Poppins', sans-serif",
                                                        transition: 'color 0.3s ease'
                                                    }}
                                                >
                                                    {teacher.teacher_name}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                color: theme.palette.text.secondary
                                            }}>
                                                
                                                <Typography sx={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }}>
                                                    Section: {teacher.section_name}
                                                </Typography>
                                            </Box>
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
