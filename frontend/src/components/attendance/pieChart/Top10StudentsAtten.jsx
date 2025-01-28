import  { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { Typography, Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Star } from '@mui/icons-material'; // Icon for 100% attendance

const AttendancePieChart = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const COLORS = ['#00C49F', '#FF8042'];

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch('https://ghss-management-backend.vercel.app/Top10StudentsAtten');
                if (!response.ok) throw new Error('Failed to fetch attendance data');
                const data = await response.json();
                setAttendanceData(data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    const renderLabel = (entry) => `${Math.round(entry.value)}%`;

    const getOuterRadius = () => {
        const width = window.innerWidth;
        if (width < 600) return 50;
        if (width < 900) return 50;
        return 60;
    };

    const getChartWidth = () => {
        const width = window.innerWidth;
        if (width < 600) return 300;
        if (width < 900) return 400;
        return 340;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    Failed to load attendance data. Please try again later.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
               Top 10 Ranked Students
            </Typography>

            {attendanceData.length === 0 ? (
                <Typography variant="body1" align="center" color="textSecondary">
                    No data available.
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {attendanceData.map((entry, index) => {
                        const rank = entry.rank; // Fetch rank directly from the data
                        const overallPercentage = Math.round(parseFloat(entry.attendance_percentage));
                        const absentPercentage = 100 - overallPercentage;

                        return (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        {/* Rank with Medal/Star for 100% Attendance */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                mb: 2,
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#00C49F',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    p: 1,
                                                }}
                                            >
                                                Rank #{rank}
                                            </Typography>
                                            {overallPercentage === 100 && (
                                                <Star
                                                    sx={{
                                                        color: '#FFD700', // Gold color for the medal/star
                                                        fontSize: '1.8rem',
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }} align="center">
                                            {entry.student_name}
                                        </Typography>

                                        <Typography variant="body1" align="center" sx={{ color: '#555', mb: 1 }}>
                                            <strong>Student ID:</strong> {entry.student_id}
                                        </Typography>
                                        <Typography variant="body1" align="center" sx={{ color: '#555', mb: 1 }}>
                                            <strong>Section:</strong> {entry.section_name}
                                        </Typography>
                                        <Typography variant="body1" align="center" sx={{ color: '#555', mb: 2 }}>
                                            <strong>Class:</strong> {entry.class_name}
                                        </Typography>

                                        <Typography variant="body1" align="center" sx={{ color: '#555', mb: 1 }}>
                                            <strong>Teacher:</strong> {entry.teacher_name || 'No teacher assigned'}
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

                                        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                                            Attendance Percentage: {entry.attendance_percentage}%
                                        </Typography>
                                        <Typography variant="body2" align="center" sx={{ color: '#555' }}>
                                            Present: {entry.present_count} | Absent: {entry.absent_count}
                                        </Typography>
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
