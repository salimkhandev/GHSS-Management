import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';

const AttendancePieChart = ({ data}) => {
    const COLORS = ['#00C49F', '#FF8042'];
    const renderLabel = (entry) => {
        return `${Math.round(entry.value)}%`;
    };
    // Function to calculate outerRadius based on screen size
    const getOuterRadius = () => {
        const width = window.innerWidth;
        if (width < 330) return 50;  // For very small screens, use a very small radius
        if (width < 600) return 60;  // For small screens, use a smaller radius
        if (width < 640) return 50;  // For small screens, use a smaller radius
        if (width < 900) return 90;  // For medium screens, use a medium radius
        return 100;  // For large screens, use a larger radius
    };

    // Function to calculate PieChart width based on screen size
    const getPieChartWidth = () => {
        const width = window.innerWidth;
        if (width < 330) return 200;  // For very small screens, set width to 200px
        if (width < 400) return 260;  // For very small screens, set width to 200px
        if (width < 600) return 299;  // For small screens, set width to 300px
        if (width <= 678) return 270;  // For small screens, set width to 300px
        if (width <= 844) return 310;  // For small screens, set width to 300px
        if (width <= 1000) return 280;  // For small screens, set width to 300px
        if (width < 900) return 380;  // For small screens, set width to 300px
        if (width < 1200) return 310;  // For small screens, set width to 300px
        if (width < 1300) return 380;  // For small screens, set width to 300px
        return 340;  // For larger screens, set width to 450px
    };

    return (
        <Box sx={{ }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#333', fontWeight: 'bold' }}
            >
                Daily Attendance Overview
            </Typography>

         
                <Grid container spacing={3}>
                    {data.map((entry, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', mb: 2 }}
                                    >
                                        Date: {new Date(entry.attendance_date).toLocaleDateString()}
                                    </Typography>

                                    <PieChart width={getPieChartWidth()} height={250}>
                                        <Pie
                                            data={[
                                                { name: 'Present', value: parseFloat(entry.present_percentage) },
                                                { name: 'Absent', value: parseFloat(entry.absent_percentage) },
                                            ]}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={getOuterRadius()} // Dynamic outerRadius based on screen width
                                            label={renderLabel}
                                        >
                                            {[{ name: 'Present' }, { name: 'Absent' }].map((_, idx) => (
                                                <Cell key={idx} fill={COLORS[idx]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
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
    ).isRequired,
    className: PropTypes.string.isRequired,
    sectionName: PropTypes.string.isRequired,
};

export default AttendancePieChart;
