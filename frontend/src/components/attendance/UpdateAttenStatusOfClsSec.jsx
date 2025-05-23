import {
    CalendarToday as DateIcon,
    ExpandMore as ExpandMoreIcon,
    Person as StudentIcon,
    Update as UpdateIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Collapse,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const UpdateAttenStatusOfClsSec = () => {
    const theme = useTheme();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDate, setExpandedDate] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch('https://ghss-management-backend.vercel.app/attendanceGroupedByDate', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setAttendanceData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    const handleDateClick = (date) => {
        setExpandedDate(expandedDate === date ? null : date);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put('https://ghss-management-backend.vercel.app/updateAttendance', {
                id,
                status
            });

            setAttendanceData((prevData) =>
                prevData.map((group) => ({
                    ...group,
                    records: group.records.map((record) =>
                        record.id === id ? { ...record, status } : record
                    ),
                }))
            );
        } catch (error) {
            console.error('Failed to update status:', error.response?.data || error.message);
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 4 }}>
                <Skeleton 
                    variant="text" 
                    width="300px" 
                    height={60} 
                    sx={{ mb: 4 }} 
                />
                {[1, 2, 3].map((item) => (
                    <Skeleton 
                        key={item}
                        variant="rectangular" 
                        height={100} 
                        sx={{ 
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: 'rgba(0,0,0,0.04)'
                        }} 
                    />
                ))}
            </Container>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                color: theme.palette.error.main
            }}>
                <Typography variant="h6">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
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
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif"
                    }}
                >
                    <UpdateIcon fontSize="large" />
                    Attendance Records
                </Typography>
            </Box>

            {attendanceData.length === 0 ? (
                <Typography 
                    variant="h6" 
                    align="center"
                    color="text.secondary"
                >
                    No records found.
                </Typography>
            ) : (
                attendanceData.map((attendanceGroup) => (
                    <Card 
                        key={attendanceGroup.attendance_date} 
                        sx={{ 
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: theme.shadows[3]
                        }}
                    >
                        <CardContent>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: theme.palette.primary.main,
                                            fontFamily: "'Poppins', sans-serif",
                                            fontWeight: 600
                                        }}
                                    >
                                        <DateIcon />
                                        {new Date(attendanceGroup.attendance_date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={() => handleDateClick(attendanceGroup.attendance_date)}
                                        sx={{
                                            transform: expandedDate === attendanceGroup.attendance_date ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s',
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            <Collapse in={expandedDate === attendanceGroup.attendance_date} timeout="auto">
                                <Box sx={{ mt: 2 }}>
                                    {attendanceGroup.records.map((record) => (
                                        <Paper 
                                            key={record.id} 
                                            sx={{ 
                                                p: 2, 
                                                mb: 2,
                                                borderRadius: 2,
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[2]
                                                }
                                            }}
                                        >
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={4}>
                                                    <Box sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}>
                                                        <StudentIcon color="primary" />
                                                        <Typography 
                                                            sx={{ 
                                                                fontWeight: 500,
                                                                fontFamily: "'Poppins', sans-serif"
                                                            }}
                                                        >
                                                            {record.student_name}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography color="text.secondary">
                                                        ID: {record.id}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Status</InputLabel>
                                                        <Select
                                                            value={record.status}
                                                            onChange={(e) => handleStatusChange(record.id, e.target.value)}
                                                            label="Status"
                                                            sx={{
                                                                '.MuiSelect-select': {
                                                                    color: record.status === 'Absent' ? 
                                                                        theme.palette.error.main : 
                                                                        theme.palette.success.main,
                                                                    fontWeight: 500
                                                                },
                                                                '.MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: record.status === 'Absent' ? 
                                                                        theme.palette.error.main : 
                                                                        theme.palette.success.main,
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: record.status === 'Absent' ? 
                                                                        theme.palette.error.dark : 
                                                                        theme.palette.success.dark,
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="Present">Present</MenuItem>
                                                            <MenuItem value="Absent">Absent</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    ))}
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default UpdateAttenStatusOfClsSec;
