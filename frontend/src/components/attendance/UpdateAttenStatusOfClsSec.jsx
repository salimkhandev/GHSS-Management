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
import apiBase from '../../config/api';

const UpdateAttenStatusOfClsSec = () => {
    const theme = useTheme();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDate, setExpandedDate] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`${apiBase}/attendanceGroupedByDate`, {
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
            await axios.put(`${apiBase}/updateAttendance`, {
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
                    height={40}
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
        <Container sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
            <Box sx={{
                mb: { xs: 2.5, sm: 3, md: 4 },
                textAlign: 'center',
                background: 'var(--gradient-primary)',
                borderRadius: 4,
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2.5, sm: 3 },
                color: 'white',
                boxShadow: '0 4px 16px rgba(26, 35, 126, 0.3)'
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 1, sm: 1.5, md: 2 },
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                        fontFamily: '"Poppins", sans-serif',
                        whiteSpace: 'nowrap',
                        flexWrap: 'nowrap'
                    }}
                >
                    <UpdateIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' } }} />
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
                            mb: { xs: 2, sm: 2.5 },
                            borderRadius: 4,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: { xs: 0.5, sm: 1 },
                                            color: 'var(--color-primary)',
                                            fontFamily: '"Poppins", sans-serif',
                                            fontWeight: 700,
                                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                                        }}
                                    >
                                        <DateIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                                        <Box component="span" sx={{
                                            display: { xs: 'none', sm: 'inline' }
                                        }}>
                                            {new Date(attendanceGroup.attendance_date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Box>
                                        <Box component="span" sx={{
                                            display: { xs: 'inline', sm: 'none' }
                                        }}>
                                            {new Date(attendanceGroup.attendance_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={() => handleDateClick(attendanceGroup.attendance_date)}
                                        sx={{
                                            transform: expandedDate === attendanceGroup.attendance_date ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            color: 'var(--color-primary)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(26, 35, 126, 0.1)'
                                            }
                                        }}
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            <Collapse in={expandedDate === attendanceGroup.attendance_date} timeout="auto">
                                <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                                    {attendanceGroup.records.map((record) => (
                                        <Paper
                                            key={record.id}
                                            sx={{
                                                p: { xs: 2, sm: 2.5 },
                                                mb: { xs: 1.5, sm: 2 },
                                                borderRadius: 3,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
                                                    borderColor: 'var(--color-primary)'
                                                }
                                            }}
                                        >
                                            <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
                                                <Grid item xs={12} sm={4}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: { xs: 0.75, sm: 1 }
                                                    }}>
                                                        <StudentIcon
                                                            color="primary"
                                                            sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontFamily: '"Poppins", sans-serif',
                                                                fontSize: { xs: '0.95rem', sm: '1.05rem' }
                                                            }}
                                                        >
                                                            {record.student_name}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography
                                                        color="text.secondary"
                                                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}
                                                    >
                                                        ID: {record.id}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 500 }}>Status</InputLabel>
                                                        <Select
                                                            value={record.status}
                                                            onChange={(e) => handleStatusChange(record.id, e.target.value)}
                                                            label="Status"
                                                            sx={{
                                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                                '.MuiSelect-select': {
                                                                    color: record.status === 'Absent' ?
                                                                        'var(--color-danger)' :
                                                                        'var(--color-success)',
                                                                    fontWeight: 600
                                                                },
                                                                '.MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: record.status === 'Absent' ?
                                                                        'var(--color-danger)' :
                                                                        'var(--color-success)',
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: record.status === 'Absent' ?
                                                                        'var(--color-danger-dark)' :
                                                                        'var(--color-success-dark)',
                                                                },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: record.status === 'Absent' ?
                                                                        'var(--color-danger)' :
                                                                        'var(--color-success)',
                                                                    borderWidth: 2,
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem
                                                                value="Present"
                                                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 500 }}
                                                            >
                                                                Present
                                                            </MenuItem>
                                                            <MenuItem
                                                                value="Absent"
                                                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 500 }}
                                                            >
                                                                Absent
                                                            </MenuItem>
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
