import PropTypes from 'prop-types';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';

const AttendancePieChart = ({ data }) => {
    const COLORS = ['#00C49F', '#FF8042'];

    const renderLabel = (entry) => `${Math.round(entry.value)}%`;

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
        return 340;
    };

    return (
        <Box>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#333', fontWeight: 'bold' }}
            >
                Monthly Attendance Overview
            </Typography>

            {data.length === 0 ? (
                <Typography variant="body1" align="center" color="textSecondary">
                    No data available.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {data.map((entry, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', mb: 2 }}
                                    >
                                        Month: {entry.month}
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
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

AttendancePieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            month: PropTypes.string.isRequired, // Month of attendance
            present_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            absent_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
};

export default AttendancePieChart;
