import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { Typography, Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { format } from 'date-fns'; // Import the date-fns library

const OverallAttenPieChart = ({ data, startDate, endDate, className, sectionName }) => {
    const [loading, setLoading] = useState(true); // State to handle loading

    const COLORS = ['#00C49F', '#FF8042'];

    // Custom function to render label with percentage and % sign
    const renderLabel = (entry) => `${Math.round(entry.value)}%`;

    // Format the start and end dates
    const formattedStartDate = format(new Date(startDate), 'dd MMM yyyy');
    const formattedEndDate = format(new Date(endDate), 'dd MMM yyyy');

    // Function to get dynamic outer radius based on screen width
    const getOuterRadius = () => {
        const width = window.innerWidth;
        if (width < 600) return 60;
        if (width < 900) return 80;
        return 100;
    };

    // Function to get dynamic chart width
    const getChartWidth = () => {
        const width = window.innerWidth;
        if (width < 345) return 233;
        if (width <= 376) return 266;
        if (width <= 390) return 311;
        if (width < 480) return 344;
        if (width <= 768) return 640;
        if (width < 800) return 700;
        if (width < 850) return 760;
        if (width < 900) return 800;
        if (width < 1024) return 700;
        if (width < 1440) return 368;
        return 340;
    };

    useEffect(() => {
        // Simulate loading delay
        if (data.length > 0) {
            setLoading(false); // Set loading to false once data is available
        }
    }, [data]);

    return (
        <Box>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#333', fontWeight: 'bold' }}
            >
                Overall Attendance Overview
            </Typography>

            <Typography
                variant="subtitle1"
                align="center"
                gutterBottom
                sx={{ color: '#555' }}
            >
                Date Range: {formattedStartDate} to {formattedEndDate}
            </Typography>

            <Typography
                variant="subtitle2"
                align="center"
                gutterBottom
                sx={{ color: '#555' }}
            >
                Class: {className} | Section: {sectionName}
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            ) : data.length === 0 ? (
                <Typography variant="body1" align="center" color="textSecondary">
                    No data available.
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {data.map((entry, index) => {
                        const overallPercentage = Math.round(parseFloat(entry.overall_percentage));
                        const absentPercentage = 100 - overallPercentage;

                        return (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                            align="center"
                                        >
                                            Overall Attendance
                                        </Typography>

                                        <PieChart width={getChartWidth()} height={250}>
                                            <Pie
                                                data={[{ name: 'Present', value: overallPercentage }, { name: 'Absent', value: absentPercentage }]}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={getOuterRadius()}
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
                        );
                    })}
                </Grid>
            )}
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
    startDate: PropTypes.string.isRequired, // Start date for the date range
    endDate: PropTypes.string.isRequired,   // End date for the date range
    className: PropTypes.string.isRequired, // Class name
    sectionName: PropTypes.string.isRequired, // Section name
};

export default OverallAttenPieChart;
