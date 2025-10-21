import {
    HowToReg as AttendanceIcon,
    EventAvailable as CalendarIcon,
    CheckCircle as CheckIcon,
    PersonOutline as PersonIcon,
    Save as SaveIcon,
    Search as SearchIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    InputAdornment,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Switch,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { SnackbarProvider, useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import TodayAttenPie from './pieChart/DailyAttenAfterSuccess';
import apiBase from '../../config/api';

const AttendanceList = () => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceDate] = useState(dayjs().format('YYYY-MM-DD')); // Get the current date
    const [loading, setLoading] = useState(false);

    // const [authenticated, setAuthenticated] = useState(false);
    // const navigate = useNavigate();
    const [disableComponent, setDisableComponent] = useState(false); // Track if the component should be disabled
    const [pieModal, setPieModal] = useState(false); // Track if the component should be disabled

    // send class_id and seciton_id to backend so that if the today was same with the backend last date then it will disable the t
    const [lastAttenDate, setLastAttenDate] = useState(null);


    useEffect(() => {
        const fetchLastDate = async () => {
            try {
                // Send a GET request to the backend to fetch the last attendance date
                const response = await axios.get(`${apiBase}/lastAttendanceDate`, { withCredentials: true });

                // Update the state with the fetched date
                if (response.data.last_attendance_date) {
                    setLastAttenDate(response.data.last_attendance_date);
                } else {
                    setLastAttenDate('No records found');
                }
            } catch (error) {
                console.error('Error fetching last attendance date:', error);
                enqueueSnackbar('Error fetching attendance data', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchLastDate();
    }, []);

    useEffect(() => {
        const storedDate = localStorage.getItem('attendanceSavedDate');
        const today = dayjs().format('YYYY-MM-DD');

        if (storedDate === today || today === lastAttenDate) {
            setDisableComponent(true); // Disable the component if the button has been clicked today
        } else {
            setDisableComponent(false); // Enable the component if the date has changed 
        }
    }, [lastAttenDate]);
    // Role is set to 'teacher' by default and doesn't need to be changed

    useEffect(() => {
        setLoading(true)
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${apiBase}/studentsAttendance`, { withCredentials: true });
                // const response = await axios.get('http://localhost:3000/studentsAttendance', {withCredentials: true });
                setLoading(false)
                setStudents(response.data);
            } catch (error) {
                enqueueSnackbar('Error fetching student data', { variant: 'error' });
                setLoading(false)
            }
        };

        fetchStudents();
    }, [enqueueSnackbar]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleToggle = (student, status) => {


        setSelectedStudents(prevSelected => {
            const isSelected = prevSelected.some(selected => selected.student_id === student.id);
            if (isSelected) {
                return prevSelected.filter(selected => selected.student_id !== student.id);
            } else {
                return [
                    ...prevSelected,
                    {
                        student_id: student.id,
                        class_id: student.class_id,
                        section_id: student.section_id,
                        status,
                    }
                ];
            }
        });
    };

    const handleSaveAttendance = async () => {
        setLoading(true)
        const absentees = students.filter(student =>
            !selectedStudents.some(selected => selected.student_id === student.id)
        ).map(absentStudent => ({
            student_id: absentStudent.id,
            class_id: absentStudent.class_id,
            section_id: absentStudent.section_id,
            status: 'Absent',
        }));

        const attendanceData = [...selectedStudents, ...absentees];

        try {
            await axios.post(`${apiBase}/saveAttendance`, { attendanceData, attendanceDate });
            setLoading(false)
            localStorage.setItem('attendanceSavedDate', dayjs().format('YYYY-MM-DD'));
            setPieModal(true);
            // setDisableComponent(true);

            enqueueSnackbar('Attendance saved successfully!', {
                // color should be blue
                style: {
                    backgroundColor: '#2196f3',
                    color: 'white'
                },
                variant: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'center' }
            });
        } catch (error) {
            enqueueSnackbar('Error saving attendance', { variant: 'error' });
            setLoading(false)
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const CountdownTimer = () => {
        const [timeLeft, setTimeLeft] = useState('');

        useEffect(() => {
            const calculateTimeLeft = () => {
                const now = dayjs();
                const tomorrow = dayjs().add(1, 'day').startOf('day'); // Get start of next day
                const diff = tomorrow.diff(now);

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                return `${hours}h ${minutes}m ${seconds}s`;
            };

            // Update timer immediately
            setTimeLeft(calculateTimeLeft());

            // Update timer every second
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(timer);
        }, []);

        return timeLeft;
    };

    if (disableComponent) {
        return (
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mt: 14,
                        textAlign: 'center',
                        background: 'linear-gradient(to bottom, #fff, #f8f9fa)',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'warning.light'
                    }}
                >
                    <WarningIcon
                        sx={{
                            fontSize: 48,
                            color: 'warning.main',
                            mb: 2,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                    />
                    <Typography variant="h5" color="warning.dark" gutterBottom fontWeight="600">
                        Attendance Already Taken
                    </Typography>

                    <Box sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: 'rgba(0,0,0,0.04)',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'linear-gradient(to bottom, #fff, #f8f9fa)',
                        gap: 1
                    }}>
                        <Typography variant="subtitle1" color="primary.main" fontWeight="500">
                            Next attendance can be taken in:
                        </Typography>
                        <Typography
                            variant="h4"
                            color="primary.dark"
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 'bold',

                            }}
                        >
                            <CountdownTimer />
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        );
    }

    if (pieModal) {
        return <TodayAttenPie />
    }

    return (

        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'linear-gradient(to bottom, #fff, #f8f9fa)'
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontWeight: 600
                        }}
                    >
                        <AttendanceIcon />
                        Attendance Sheet
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mt: 1,
                            opacity: 0.9,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <CalendarIcon fontSize="small" />
                        {dayjs(attendanceDate).format('MMMM D, YYYY')}
                    </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleSaveAttendance}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        fullWidth
                        sx={{
                            mb: 3,
                            py: 1.5,
                            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                            color: 'white',
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)'
                            },
                            '&:disabled': {
                                opacity: 0.7
                            }
                        }}
                    >
                        Save Attendance
                    </Button>

                    <TextField
                        variant="outlined"
                        placeholder="Search students..."
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                }
                            }
                        }}
                    />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {filteredStudents.map((student, index) => (
                                <Box key={student.id}>
                                    {index > 0 && <Divider />}
                                    <ListItem
                                        sx={{
                                            py: 1.5,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon color="action" />
                                                    <Typography sx={{ fontWeight: 500 }}>
                                                        {`${index + 1}. ${student.name}`}

                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                edge="end"
                                                checked={selectedStudents.some(
                                                    selected => selected.student_id === student.id
                                                )}
                                                onChange={() => handleToggle(student, 'Present')}
                                                color="success"
                                                checkedIcon={<CheckIcon />}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#4caf50'
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#4caf50'
                                                    }
                                                }}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    )}
                </Box>

            </Paper>
        </Container>
    );
};

const AttendanceListWithSnackbar = () => (
    <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
        <AttendanceList />
    </SnackbarProvider>
);

export default AttendanceListWithSnackbar;
