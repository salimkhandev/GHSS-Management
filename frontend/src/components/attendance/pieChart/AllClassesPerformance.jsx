import { Assessment, DateRange, Error as ErrorIcon, Timeline } from '@mui/icons-material';
import { Box, Card, CardContent, CircularProgress, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

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
                const response = await axios.get('https://ghss-management-backend.vercel.app/attenBasedSectionsPerformance');
                setData(response.data);

                if (response.data.length > 0) {
                    const { start_date, end_date } = response.data[0];
                    setDateRange({
                        startDate: format(new Date(start_date), 'dd MMMM yyyy'),
                        endDate: format(new Date(end_date), 'dd MMMM yyyy'),
                    });
                }
            } catch (err) {
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
                mb: 4, 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                borderRadius: 2,
                p: 3,
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Typography
                    variant="h4"
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontWeight: 700,
                        mb: 2
                    }}
                >
                    <Assessment fontSize="large" />
                    Attendance Overview
                </Typography>

                {dateRange.startDate && dateRange.endDate && (
                    <Typography
                        variant="subtitle1"
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            opacity: 0.9
                        }}
                    >
                        <DateRange />
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
                                    <Skeleton variant="text" width="60%" height={40} />
                                    <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', my: 2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : error ? (
                <Card sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: theme.palette.error.light,
                    color: theme.palette.error.dark
                }}>
                    <ErrorIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6">{error}</Typography>
                </Card>
            ) : data.length === 0 ? (
                <Card sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: theme.palette.grey[100]
                }}>
                    <Timeline sx={{ fontSize: 48, mb: 2, color: theme.palette.grey[500] }} />
                    <Typography variant="h6" color="textSecondary">
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
                                                mb: 2,
                                                color: theme.palette.primary.main,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Assessment />
                                            {isAttendanceNotTaken
                                                ? `${entry.class_name} - ${entry.section_name} (No Data)`
                                                : `${entry.class_name} - ${entry.section_name}`}
                                        </Typography>

                                        {isAttendanceNotTaken ? (
                                            <Box sx={{ 
                                                p: 3, 
                                                textAlign: 'center',
                                                bgcolor: theme.palette.grey[50],
                                                borderRadius: 1
                                            }}>
                                                <Timeline sx={{ fontSize: 40, color: theme.palette.grey[400] }} />
                                                <Typography variant="body2" color="textSecondary">
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
                                                            <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>
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
