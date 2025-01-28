import  { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { Typography, Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns'; // Import date-fns for formatting dates

const AttendancePieChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const COLORS = ['#00C49F', '#FF8042'];

    const renderLabel = (entry) => {
        return `${Math.round(entry.value)}%`;
    };

    // Function to calculate outerRadius based on screen size
    const getOuterRadius = () => {
        const width = window.innerWidth;
        if (width < 330) return 50;
        if (width < 600) return 60;
        if (width < 900) return 80;
        return 100;
    };

    // Function to calculate PieChart width based on screen size
    const getPieChartWidth = () => {
        const width = window.innerWidth;
        if (width < 330) return 200;
        if (width < 600) return 300;
        if (width < 800) return 330;
        if (width < 900) return 380;
        return 440;
    };

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/attenBasedSectionsPerformance'); // Adjust this URL to match your backend endpoint
                setData(response.data);

                // Extract and format start_date and end_date
                if (response.data.length > 0) {
                    const { start_date, end_date } = response.data[0];
                    setDateRange({
                        startDate: format(new Date(start_date), 'dd MMMM yyyy'),
                        endDate: format(new Date(end_date), 'dd MMMM yyyy'),
                    });
                }

                setLoading(false);
            } catch (error) {
                setError('Error fetching data.',error);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    return (
        <Box>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#333', fontWeight: 'bold' }}
            >
                Attendance Overview
            </Typography>

            {dateRange.startDate && dateRange.endDate && (
                <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    sx={{ color: '#555', fontStyle: 'italic' }}
                >
                    {`From ${dateRange.startDate} to ${dateRange.endDate}`}
                </Typography>
            )}

            {loading ? (
                <Typography variant="body1" align="center" color="textSecondary">
             <CircularProgress/>
                </Typography>
            ) : error ? (
                <Typography variant="body1" align="center" color="error">
                    {error}
                </Typography>
            ) : data.length === 0 ? (
                <Typography variant="body1" align="center" color="textSecondary">
                    No data available yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {data.map((entry, index) => {
                        const presentPercentage = parseFloat(entry.overall_percentage);
                        const isAttendanceNotTaken = isNaN(presentPercentage);

                        return (
                            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                        >
                                            {isAttendanceNotTaken
                                                ? `Attendance Not Taken Yet for ${entry.class_name} - ${entry.section_name}`
                                                : `${entry.class_name} - ${entry.section_name}`}
                                        </Typography>

                                        {isAttendanceNotTaken ? (
                                            <Typography variant="body2" align="center" color="textSecondary">
                                                No attendance data available.
                                            </Typography>
                                        ) : (
                                            <PieChart width={getPieChartWidth()} height={250}>
                                                <Pie
                                                    data={[
                                                        { name: 'Present', value: presentPercentage },
                                                        { name: 'Absent', value: 100 - presentPercentage }, // Subtracting from 100
                                                    ]}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    label={renderLabel}
                                                    outerRadius={getOuterRadius()} // Dynamic radius
                                                >
                                                    {[{ name: 'Present' }, { name: 'Absent' }].map((_, idx) => (
                                                        <Cell key={idx} fill={COLORS[idx]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
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
