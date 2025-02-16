import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const AttendancePieChart = ({ data }) => {
    const theme = useTheme();
    const COLORS = [theme.palette.success.main, theme.palette.error.main];
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
        if (width < 330) return 50;
        if (width < 600) return 60;
        if (width < 900) return 80;
        return 90;
    };

    const getPieChartWidth = () => {
        const width = window.innerWidth;
        if (width < 330) return 200;
        if (width < 600) return 280;
        if (width < 900) return 320;
        return 340;
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
                mb: 4, 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                borderRadius: 2,
                p: 3,
                color: 'white',
                boxShadow: theme.shadows[4]
            }}>
                <Typography
                    variant="h4"
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        fontWeight: 700
                    }}
                >
                    <CalendarIcon fontSize="large" />
                    Daily Attendance Overview
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {data.map((entry, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
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
                                    {new Date(entry.attendance_date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <PieChart width={getPieChartWidth()} height={250}>
                                        <Pie
                                            data={[
                                                { name: 'Present', value: parseFloat(entry.present_percentage) },
                                                { name: 'Absent', value: parseFloat(entry.absent_percentage) }
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
                                            formatter={(value) => `${value.toFixed(1)}%`}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: 8,
                                                boxShadow: theme.shadows[3],
                                                padding: '8px 12px'
                                            }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36}
                                            formatter={(value) => (
                                                <span style={{ 
                                                    color: theme.palette.text.primary,
                                                    fontWeight: 500
                                                }}>
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </Box>

                                <Box sx={{ 
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    bgcolor: theme.palette.grey[50],
                                    p: 2,
                                    borderRadius: 1
                                }}>
                                    <Typography 
                                        sx={{ 
                                            color: theme.palette.success.main,
                                            fontWeight: 500
                                        }}
                                    >
                                        {entry.present_percentage}% Present
                                    </Typography>
                                    <Typography 
                                        sx={{ 
                                            color: theme.palette.error.main,
                                            fontWeight: 500
                                        }}
                                    >
                                        {entry.absent_percentage}% Absent
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

AttendancePieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            class_id: PropTypes.string.isRequired,
            section_id: PropTypes.string.isRequired,
            attendance_date: PropTypes.string.isRequired,
            present_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            absent_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired
};

export default AttendancePieChart;
