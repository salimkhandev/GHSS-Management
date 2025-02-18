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

                                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                    <PieChart width={getPieChartWidth()} height={280}>
                                        <Pie
                                            data={[
                                                { name: 'Present', value: parseFloat(entry.present_percentage) },
                                                { name: 'Absent', value: parseFloat(entry.absent_percentage) }
                                            ]}
                                            cx="50%"
                                            cy="45%"
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
                                                backgroundColor: '#ffffff',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: 8,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                padding: '8px 16px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                textAlign: 'center'
                                            }}
                                            position={{ y: 10 }}
                                            wrapperStyle={{
                                                zIndex: 100,
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        />
                                   
                                    </PieChart>

                                    <Box sx={{ 
                                        mt: 2,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 1,
                                        bgcolor: 'transparent',
                                        p: 2,
                                        borderRadius: 2,
                                        width: 'fit-content',
                                        minWidth: '150px'
                                    }}>
                                        <Typography 
                                            sx={{ 
                                                color: theme.palette.success.main,
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Present: {entry.present_percentage}%
                                        </Typography>
                                        <Typography 
                                            sx={{ 
                                                color: theme.palette.error.main,
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Absent: {entry.absent_percentage}%
                                        </Typography>
                                    </Box>
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
