import { DateRange as DateIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns'; // Import the date-fns library
import PropTypes from 'prop-types';
import React from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const OverallAttenPieChart = ({ data, startDate, endDate, className, sectionName }) => {
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
        if (width < 600) return 60;
        if (width < 900) return 80;
        return 90;
    };

    const getChartWidth = () => {
        const width = window.innerWidth;
        if (width < 345) return 233;
        if (width <= 376) return 266;
        if (width <= 390) return 311;
        if (width < 480) return 320;
        if (width < 900) return 340;
        return 360;
    };

    const formattedStartDate = format(new Date(startDate), 'dd MMM yyyy');
    const formattedEndDate = format(new Date(endDate), 'dd MMM yyyy');

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
               

                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    opacity: 0.9,
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <Typography 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '1rem',
                            '& .MuiSvgIcon-root': {
                                color: 'white'
                            }
                        }}
                    >
                        <DateIcon fontSize="small" />
                        <span style={{ fontWeight: 600 }}>{formattedStartDate}</span>
                        <span style={{ margin: '0 4px' }}>to</span>
                        <span style={{ fontWeight: 600 }}>{formattedEndDate}</span>
                    </Typography>
                    <Typography 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            color: 'text.secondary',
                            fontSize: '0.95rem'
                        }}
                    >
                        <span style={{ fontWeight: 500, color: 'white' }}>Class: {className}</span>
                        <span style={{ color: '#666' }}>|</span>
                        <span style={{ fontWeight: 500, color: 'white' }}>Section: {sectionName}</span>
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {data.map((entry, index) => {
                    const overallPercentage = Math.round(parseFloat(entry.overall_percentage));
                    const absentPercentage = 100 - overallPercentage;

                    return (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card sx={{ 
                                boxShadow: theme.shadows[3], 
                                borderRadius: 2,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[6]
                                }
                            }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ 
                                            mt: 2,
                                            color: theme.palette.primary.main,
                                            fontWeight: 600,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Overall Attendance
                                    </Typography>

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
                                                align="center"
                                                formatter={(value) => (
                                                    <span style={{ 
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                        textAlign: 'center',
                                                        // width: '100%',
                                                        // padding: '0 8px'
                                                    }}>
                                                        {value}
                                                    </span>
                                                )}
                                                wrapperStyle={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    margin: '0 auto'
                                                }}
                                            />
                                        </PieChart>
                                    </Box>

                                    <Box sx={{ 
                                        mt: 2,
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                        borderRadius: 1
                                    }}>
                                        <Typography 
                                            sx={{ 
                                                color: theme.palette.success.main,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {overallPercentage}% Present
                                        </Typography>
                                        <Typography 
                                            sx={{ 
                                                color: theme.palette.error.main,
                                                fontWeight: 500
                                            }}
                                        >
                                            {absentPercentage}% Absent
                                        </Typography>
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

OverallAttenPieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            class_id: PropTypes.string.isRequired,
            section_id: PropTypes.string.isRequired,
            overall_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    sectionName: PropTypes.string.isRequired
};

export default OverallAttenPieChart;
