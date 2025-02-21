import { Box, Card, CardContent, Grid, Typography, useTheme, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

const DailyAttenPieChart = () => {
    const theme = useTheme();
    const [pieData, setPieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = [theme.palette.success.main, theme.palette.error.main];
    const RADIAN = Math.PI / 180;

    useEffect(() => {
        const fetchPieData = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/todayAttenPieModal', {
                    withCredentials: true
                });
                setPieData(response.data[0]);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch attendance data');
                setLoading(false);
            }
        };

        fetchPieData();
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!pieData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography>No attendance data available</Typography>
            </Box>
        );
    }

    const chartData = [
        { name: 'Present', value: parseFloat(pieData.present_percentage) },
        { name: 'Absent', value: parseFloat(pieData.absent_percentage) }
    ];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Card sx={{
                        boxShadow: theme.shadows[3],
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[6]
                        }
                    }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                {new Date(pieData.attendance_date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <PieChart width={320} height={280}>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={90}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
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
                                            backgroundColor: '#ffffff',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            borderRadius: 8,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            padding: '8px 16px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            textAlign: 'center'
                                        }}
                                    />
                                </PieChart>

                                <Box sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    width: '100%'
                                }}>
                                    <Typography sx={{ color: COLORS[0], fontWeight: 600 }}>
                                        Present: {pieData.present_percentage}%
                                    </Typography>
                                    <Typography sx={{ color: COLORS[1], fontWeight: 600 }}>
                                        Absent: {pieData.absent_percentage}%
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DailyAttenPieChart;