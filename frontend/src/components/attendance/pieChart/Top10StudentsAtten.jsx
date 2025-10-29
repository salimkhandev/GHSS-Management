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
    Card,
    CardContent,
    Grid,
    Paper,
    Skeleton,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import apiBase from '../../../config/api';

const AttendancePieChart = () => {
    const theme = useTheme();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
                mb: 4,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #1e88e5, #42a5f5)',
                borderRadius: 2,
                p: { xs: 1, sm: 1.25, md: 2 },
                color: 'white',
                width: 'fit-content',
                maxWidth: '100%',
                mx: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        fontWeight: 700,
                        mb: 1
                    }}
                >
                    <LeaderboardIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.6rem' } }} />
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
                    {attendanceData.map((entry, index) => {
                        const overallPercentage = Math.round(parseFloat(entry.attendance_percentage));
                        const absentPercentage = 100 - overallPercentage;

                        return (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card sx={{
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}>
                                    <CardContent>
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
                                                <TrophyIcon />
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    Rank #{entry.rank}
                                                </Typography>
                                            </Box>
                                            {overallPercentage === 100 && (
                                                <StarIcon sx={{
                                                    color: '#FFD700',
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

                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <PieChart width={getChartWidth()} height={250}>
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
                                                        <span style={{ color: theme.palette.text.primary, fontWeight: 500, marginRight: '40px' }}>
                                                            {value}
                                                        </span>
                                                    )}
                                                />
                                            </PieChart>
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
        </Box>
    );
};

export default AttendancePieChart;
