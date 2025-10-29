import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

const DailyAttenPieChart = ({ data }) => {
    const theme = useTheme();

    const COLORS = [theme.palette.success.main, theme.palette.error.main];
    const RADIAN = Math.PI / 180;

    const normalizedData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data.map((d) => ({
            attendance_date: d.attendance_date,
            present_percentage: Number.parseFloat(d.present_percentage),
            absent_percentage: Number.parseFloat(d.absent_percentage)
        }));
    }, [data]);

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

    if (!normalizedData.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography>No attendance data available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3} justifyContent="center">
                {normalizedData.map((entry, idx) => {
                    const chartData = [
                        { name: 'Present', value: entry.present_percentage },
                        { name: 'Absent', value: entry.absent_percentage }
                    ];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={`${entry.attendance_date}-${idx}`}>
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
                                                {chartData.map((c, i) => (
                                                    <Cell
                                                        key={`cell-${i}`}
                                                        fill={COLORS[i]}
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
                                                Present: {entry.present_percentage}%
                                            </Typography>
                                            <Typography sx={{ color: COLORS[1], fontWeight: 600 }}>
                                                Absent: {entry.absent_percentage}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default DailyAttenPieChart;

DailyAttenPieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            present_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            absent_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            attendance_date: PropTypes.string
        })
    )
};
