import { Assessment, Error as ErrorIcon, Timeline } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import apiBase from '../../../config/api';

const AttendancePieChart = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const COLORS = [theme.palette.success.main, theme.palette.warning.main];
    const RADIAN = Math.PI / 180;

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
        if (width < 330) return 60;
        if (width < 600) return 70;
        if (width < 900) return 90;
        return 110;
    };

    const getPieChartWidth = () => {
        const width = window.innerWidth;
        if (width < 330) return 220;
        if (width < 600) return 320;
        if (width < 800) return 350;
        if (width < 900) return 400;
        return 460;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiBase}/attenBasedSectionsPerformance`);
                setData(response.data);

                if (response.data.length > 0) {
                    const { start_date, end_date } = response.data[0];
                    setDateRange({
                        startDate: format(new Date(start_date), 'dd MMMM yyyy'),
                        endDate: format(new Date(end_date), 'dd MMMM yyyy'),
                    });
                }
            } catch {
                setError('Error fetching attendance data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{
                mb: { xs: 2, sm: 3, md: 4 },
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 0.75, sm: 1 },
                        fontWeight: 700,
                        mb: { xs: 1, sm: 1.5, md: 2 }
                    }}
                >
                    <Assessment sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.6rem' } }} />
                    Attendance Overview
                </Typography>

                {dateRange.startDate && dateRange.endDate && (
                    <Typography
                        variant="subtitle1"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: { xs: 0.5, sm: 1 },
                            opacity: 0.9,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        {`${dateRange.startDate} to ${dateRange.endDate}`}
                    </Typography>
                )}
            </Box>

            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} md={6} lg={6} key={item}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Skeleton variant="text" width="50%" height={28} />
                                    <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto', my: 2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : error ? (
                <Card sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    textAlign: 'center',
                    bgcolor: theme.palette.error.light,
                    color: theme.palette.error.dark
                }}>
                    <ErrorIcon sx={{ fontSize: { xs: 36, sm: 48 }, mb: { xs: 1, sm: 2 } }} />
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{error}</Typography>
                </Card>
            ) : data.length === 0 ? (
                <Card sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    textAlign: 'center',
                    bgcolor: theme.palette.grey[100]
                }}>
                    <Timeline sx={{ fontSize: { xs: 36, sm: 48 }, mb: { xs: 1, sm: 2 }, color: theme.palette.grey[500] }} />
                    <Typography variant="h6" color="textSecondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        No attendance data available yet.
                    </Typography>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {data.map((entry, index) => {
                        const presentPercentage = parseFloat(entry.overall_percentage);
                        const isAttendanceNotTaken = isNaN(presentPercentage);

                        return (
                            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
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
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: { xs: 1.5, sm: 2 },
                                                color: theme.palette.primary.main,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: { xs: 0.75, sm: 1 },
                                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                                            }}
                                        >
                                            <Assessment sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }} />
                                            {isAttendanceNotTaken
                                                ? `${entry.class_name} - ${entry.section_name} (No Data)`
                                                : `${entry.class_name} - ${entry.section_name}`}
                                        </Typography>

                                        {isAttendanceNotTaken ? (
                                            <Box sx={{
                                                p: { xs: 2, sm: 3 },
                                                textAlign: 'center',
                                                bgcolor: theme.palette.grey[50],
                                                borderRadius: 1
                                            }}>
                                                <Timeline sx={{ fontSize: { xs: 32, sm: 40 }, color: theme.palette.grey[400] }} />
                                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                                    Attendance not taken yet.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <PieChart width={getPieChartWidth()} height={250}>
                                                    <Pie
                                                        data={[
                                                            { name: 'Present', value: presentPercentage },
                                                            { name: 'Absent', value: 100 - presentPercentage },
                                                        ]}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={renderCustomizedLabel}
                                                        outerRadius={getOuterRadius()}
                                                        dataKey="value"
                                                        nameKey="name"
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
                                                        formatter={(value) => `${value.toFixed(1)}%`}
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
                                        )}
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
