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
import apiBase from '../../config/api';

const TeachersList = () => {
    const theme = useTheme();
    const [teachers, setTeachers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`${apiBase}/TeachersList`);
                setTeachers(response.data);
            } catch (err) {
                setError('Failed to fetch teachers data');
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // fetch profile pic from the database

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
                mb: { xs: 3, sm: 4, md: 6 },
                textAlign: 'center',
                width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
                mx: 'auto',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                borderRadius: 2,
                p: { xs: 1.5, sm: 2, md: 3 },
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
                        gap: { xs: 1, sm: 1.5, md: 2 },
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem', lg: '1.8rem' },
                        fontFamily: "'Poppins', sans-serif",
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    <TeacherIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' } }} />
                    Teachers List
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {Object.keys(teachers).map((className, index) => (
                    <Grid item xs={12} key={index}>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: { xs: 2, sm: 2.5, md: 3 },
                                fontWeight: 600,
                                fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.75rem', lg: '2rem' },
                                fontFamily: "'Poppins', sans-serif",
                                color: theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 0.75, sm: 1 },
                                pl: { xs: 0.75, sm: 1 },
                                borderLeft: `4px solid ${theme.palette.primary.main}`
                            }}
                        >
                            {/* code for profile pic */}

                            <SchoolIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' } }} />
                            {className}
                        </Typography>

                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
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
                                            gap: { xs: 1.5, sm: 2 },
                                            p: { xs: 1.5, sm: 2, md: 3 }
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: { xs: 0.75, sm: 1 }
                                            }}>
                                                {/* code for profile pic */}

                                                {teacher.profile_pic_url ? (
                                                    <Box
                                                        component="img"
                                                        src={teacher.profile_pic_url}
                                                        alt="Teacher"
                                                        sx={{
                                                            width: { xs: 36, sm: 42, md: 48 },
                                                            height: { xs: 36, sm: 42, md: 48 },
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '2px solid #fff',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                                                            backgroundColor: '#f5f5f5',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                            verticalAlign: 'middle',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                                transition: 'transform 0.2s ease-in-out',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <TeacherIcon
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                                            backgroundColor: '#f5f5f5',
                                                            padding: { xs: '4px', sm: '5px' },
                                                            borderRadius: '50%',
                                                            border: '2px solid #fff',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                                                            flexShrink: 0,
                                                            verticalAlign: 'middle',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                                transition: 'transform 0.2s ease-in-out',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                            }
                                                        }}
                                                    />
                                                )}
                                                <Typography
                                                    className="teacher-name"
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' },
                                                        fontFamily: "'Poppins', sans-serif",
                                                        transition: 'color 0.3s ease',
                                                        lineHeight: 1.3,
                                                        wordBreak: 'break-word',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {teacher.teacher_name}
                                                </Typography>

                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: { xs: 0.5, sm: 1 },
                                                color: theme.palette.text.secondary
                                            }}>

                                                <Typography sx={{
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                                                    whiteSpace: 'nowrap'
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
