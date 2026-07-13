import {
    Error as ErrorIcon,
    Leaderboard as LeaderboardIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Star as StarIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Skeleton,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';
import apiBase from '../../../config/api';

const AttendancePieChart = () => {
    const theme = useTheme();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);

    const COLORS = [theme.palette.success.main, theme.palette.warning.main];
    const RADIAN = Math.PI / 180;

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`${apiBase}/Top10StudentsAtten`);
                if (!response.ok) throw new Error('Failed to fetch attendance data');
                const data = await response.json();
                setAttendanceData(data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const getOuterRadius = () => {
        const width = window.innerWidth;
        if (width < 600) return 50;
        if (width < 900) return 50;
        return 60;
    };

    const getChartWidth = () => {
        const width = window.innerWidth;
        if (width < 600) return 300;
        if (width < 900) return 400;
        return 340;
    };

    if (loading) {
        return (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Compact centered header skeleton */}
                <Skeleton
                    variant="rectangular"
                    sx={{
                        mb: { xs: 2, sm: 3, md: 4 },
                        height: { xs: 44, sm: 52, md: 56 },
                        width: { xs: 220, sm: 300, md: 360 },
                        mx: 'auto',
                        borderRadius: 2,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                    }}
                />

                <Grid container spacing={3} justifyContent="center">
                    {[1, 2, 3].map((item) => (
                        <Grid item xs={12} md={6} lg={4} key={item}>
                            <Card sx={{
                                boxShadow: 3,
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}>
                                <CardContent>
                                    {/* Rank Badge Skeleton */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <Skeleton
                                            variant="rectangular"
                                            width={120}
                                            height={40}
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </Box>

                                    {/* Name Skeleton */}
                                    <Skeleton
                                        variant="text"
                                        sx={{
                                            height: 32,
                                            width: '60%',
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    />

                                    {/* Student Info Skeleton */}
                                    <Grid container spacing={1} sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Skeleton height={24} width="90%" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Skeleton height={24} width="90%" />
                                        </Grid>
                                    </Grid>

                                    {/* Pie Chart Skeleton */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        my: 2
                                    }}>
                                        <Skeleton
                                            variant="circular"
                                            width={120}
                                            height={120}
                                        />
                                    </Box>

                                    {/* Legend Skeleton */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 2,
                                        mb: 2
                                    }}>
                                        <Skeleton width={60} height={24} />
                                        <Skeleton width={60} height={24} />
                                    </Box>

                                    {/* Stats Box Skeleton */}
                                    <Box sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: 1
                                    }}>
                                        <Skeleton
                                            variant="text"
                                            sx={{
                                                height: 32,
                                                width: '80%',
                                                mx: 'auto',
                                                mb: 1
                                            }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            sx={{
                                                height: 24,
                                                width: '60%',
                                                mx: 'auto'
                                            }}
                                        />
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
            <Paper
                sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: theme.palette.error.light,
                    color: theme.palette.error.dark,
                    borderRadius: 2,
                    maxWidth: 500,
                    mx: 'auto',
                    mt: 4
                }}
            >
                <ErrorIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6">
                    Failed to load attendance data. Please try again later.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{
                mb: { xs: 3, sm: 4 },
                textAlign: 'center',
                width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
                mx: 'auto',
                background: 'var(--gradient-primary)',
                borderRadius: 4,
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2.5, sm: 3 },
                color: 'white',
                boxShadow: '0 4px 16px rgba(26, 35, 126, 0.3)'
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 1, sm: 1.5, md: 2 },
                        fontWeight: 700,
                        fontFamily: '"Poppins", sans-serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        mb: 0
                    }}
                >
                    <LeaderboardIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' } }} />
                    Top 10 Ranked Students
                </Typography>
            </Box>

            {attendanceData.length === 0 ? (
                <Box sx={{
                    textAlign: 'center',
                    p: 4,
                    bgcolor: theme.palette.grey[100],
                    borderRadius: 2
                }}>
                    <PersonIcon sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
                    <Typography color="textSecondary">
                        No attendance data available.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {attendanceData.slice(0, visibleCount).map((entry, index) => {
                        const overallPercentage = Math.round(parseFloat(entry.attendance_percentage));
                        const absentPercentage = 100 - overallPercentage;

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    borderRadius: 3,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                    background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-raised))',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                        borderColor: 'var(--color-primary)',
                                    }
                                }}>
                                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mb: 2,
                                            gap: 1,
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                bgcolor: index < 3 ? 'primary.main' : 'success.main',
                                                color: 'white',
                                                px: 2,
                                                py: 1,
                                                borderRadius: 2,
                                                boxShadow: 2
                                            }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    Rank #{entry.rank}
                                                </Typography>
                                            </Box>
                                            {overallPercentage === 100 && (
                                                <StarIcon sx={{
                                                    color: 'var(--color-warning)',
                                                    fontSize: 32,
                                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                                }} />
                                            )}
                                        </Box>

                                        <Typography
                                            variant="h6"
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.primary.main,
                                                mb: 2
                                            }}
                                        >
                                            {entry.student_name}
                                        </Typography>

                                        <Grid container spacing={1} sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    color: theme.palette.text.secondary
                                                }}>
                                                    <PersonIcon fontSize="small" />
                                                    <Typography variant="body2">
                                                        ID: {entry.student_id}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    color: theme.palette.text.secondary
                                                }}>
                                                    <SchoolIcon fontSize="small" />
                                                    <Typography variant="body2">
                                                        {entry.class_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ display: 'flex', justifyContent: 'center', height: 250, width: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: 'Present', value: overallPercentage },
                                                            { name: 'Absent', value: absentPercentage }
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={renderCustomizedLabel}
                                                        outerRadius={getOuterRadius()}
                                                        dataKey="value"
                                                    >
                                                        {[0, 1].map((index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={COLORS[index]}
                                                                stroke={theme.palette.background.paper}
                                                                strokeWidth={2}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value) => `${value}%`}
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                            border: 'none',
                                                            borderRadius: 8,
                                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Legend
                                                        verticalAlign="bottom"
                                                        height={36}
                                                        formatter={(value) => (
                                                            <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                                {value}
                                                            </span>
                                                        )}
                                                        wrapperStyle={{ whiteSpace: 'nowrap' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>

                                        <Box sx={{
                                            mt: 2,
                                            p: 2,
                                            bgcolor: theme.palette.grey[50],
                                            borderRadius: 1
                                        }}>
                                            <Typography
                                                variant="h6"
                                                align="center"
                                                sx={{
                                                    color: theme.palette.success.main,
                                                    fontWeight: 600,
                                                    mb: 1
                                                }}
                                            >
                                                {entry.attendance_percentage}% Attendance
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                align="center"
                                                sx={{ color: theme.palette.text.secondary }}
                                            >
                                                Present: {entry.present_count} | Absent: {entry.absent_count}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
            
            {!loading && !error && attendanceData.length > visibleCount && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button 
                        variant="contained" 
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        sx={{
                            px: 4, py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            background: 'var(--gradient-primary)',
                            boxShadow: '0 4px 12px rgba(27, 47, 110, 0.2)',
                            '&:hover': {
                                boxShadow: '0 6px 16px rgba(27, 47, 110, 0.3)'
                            }
                        }}
                    >
                        See More
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default AttendancePieChart;
