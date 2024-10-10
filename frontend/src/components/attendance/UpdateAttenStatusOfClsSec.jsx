import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    Collapse,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const UpdateAttenStatusOfClsSec = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDate, setExpandedDate] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
        
            try {
                const response = await fetch('http://localhost:3000/attendanceGroupedByDate', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
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
            const response = await axios.put(`http://localhost:3000/updateAttendance`, {
                id,
                status // Ensure this matches the backend's expected key
            });

            console.log(response.data.message);

            setAttendanceData((prevData) =>
                prevData.map((group) => ({
                    ...group,
                    records: group.records.map((record) =>
                        record.id === id ? { ...record, status: status } : record // Compare record.id with id
                    ),
                }))
            );
        } catch (error) {
            console.error('Failed to update status:', error.response ? error.response.data : error.message);
        }
    };

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Attendance Records
            </Typography>
            {attendanceData.length === 0 ? (
                <Typography>No records found.</Typography>
            ) : (
                attendanceData.map((attendanceGroup) => (
                    <Card key={attendanceGroup.attendance_date} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h6">
                                        Date: {attendanceGroup.attendance_date}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={() => handleDateClick(attendanceGroup.attendance_date)}
                                        sx={{
                                            transform: expandedDate === attendanceGroup.attendance_date ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.9s',
                                        }}
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Collapse in={expandedDate === attendanceGroup.attendance_date} timeout="auto" unmountOnExit>
                                {attendanceGroup.records.map((record) => (
                                    <Paper key={record.id} sx={{ padding: 1, marginBottom: 1 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={4}>
                                                <Typography>ID: {record.id}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography> {record.student_name}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Status</InputLabel>
                                                    <Select

                                                        value={record.status}
                                                        onChange={(e) => handleStatusChange(record.id, e.target.value)}
                                                        label="Status"
                                                        sx={{
                                                            // Apply styles conditionally
                                                            '.MuiSelect-select': {
                                                                color: record.status === 'Absent' ? 'red' : 'green', // Change text color based on status
                                                            },
                                                            '.MuiOutlinedInput-notchedOutline': {
                                                                borderColor: record.status === 'Absent' ? 'red' : 'green', // Change border color based on status
                                                            },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: record.status === 'Absent' ? 'darkred' : 'darkgreen', // Change border color on hover
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem 
                                                         value="Present">Present</MenuItem>
                                                        <MenuItem value="Absent">Absent</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Collapse>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default UpdateAttenStatusOfClsSec;
