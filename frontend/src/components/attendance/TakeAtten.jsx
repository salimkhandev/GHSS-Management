import { useState, useEffect } from 'react';
import { Switch, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Container,CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
// import { useNavigate } from 'react-router-dom';
// import UpdateAttenStatusOfClsSec from './UpdateAttenStatusOfClsSec'
const AttendanceList = () => {


    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceDate] = useState(dayjs().format('YYYY-MM-DD')); // Get the current date
const [loading, setLoading]=useState(false)
    // const [authenticated, setAuthenticated] = useState(false);
    // const navigate = useNavigate();
    const [disableComponent, setDisableComponent] = useState(false); // Track if the component should be disabled

// send class_id and seciton_id to backend so that if the today was same with the backend last date then it will disable the t
    const [lastAttenDate, setLastAttenDate] = useState(null);

    useEffect(() => {
        const fetchLastDate = async () => {
            try {
                // Send a GET request to the backend to fetch the last attendance date
                const response = await axios.get('https://ghss-management-backend.vercel.app/lastAttendanceDate', { withCredentials: true });

                // Update the state with the fetched date
                if (response.data.last_attendance_date) {
                    setLastAttenDate(response.data.last_attendance_date);
                } else {
                    setLastAttenDate('No records found');
                }
            } catch (error) {
                console.error('Error fetching last attendance date:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLastDate();
    }, []);
    useEffect(() => {
        const storedDate = localStorage.getItem('attendanceSavedDate');
        const today = dayjs().format('YYYY-MM-DD');

        if (storedDate === today || today===lastAttenDate) {
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
    const response = await axios.get('https://ghss-management-backend.vercel.app/studentsAttendance', {withCredentials: true });
    setLoading(false)
    setStudents(response.data);
} catch (error) {
    console.error('Error fetching student data:', error);
    setLoading(false)
            }
        };

        fetchStudents();
    }, []);

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
            await axios.post('https://ghss-management-backend.vercel.app/saveAttendance', { attendanceData, attendanceDate });
            setLoading(false)
            alert('Attendance saved successfully!');
            localStorage.setItem('attendanceSavedDate', dayjs().format('YYYY-MM-DD')); // Store today's date in local storage
            setDisableComponent(true);
        } catch (error) {
            console.error('Error saving attendance:', error);
            setLoading(false)
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

if(disableComponent){
return(<>

    <h3>Attendance already taken</h3>
</>)
}

    return (
        
        <>
    
        <Container className="bg-white p-5 rounded-lg max-w-sm mx-auto">
              {loading ? (
                <div className="flex justify-center items-center min-h-[444px]">
                    <CircularProgress />
                </div>
            ):(
                <>
            <div className="flex justify-between mb-4">
                <Button variant="contained" color="success" onClick={handleSaveAttendance}>
                    Save Attendance
                </Button>
            </div>
            <TextField
                variant="outlined"
                placeholder="Search"
                fullWidth
                margin="normal"
                onChange={handleSearchChange}
                value={searchTerm}
            />
            <List className="space-y-2">
                {filteredStudents.map((student, index) => (
                    <ListItem key={student.id} className="bg-gray-100 rounded-md">
                        <ListItemText primary={`${index + 1}. ${student.name}`} />
                        <ListItemSecondaryAction>
                            <Switch
                                checked={selectedStudents.some(selected => selected.student_id === student.id)}
                                onChange={() => handleToggle(student, 'Present')}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
                    </>)}

                    </Container>
        </>
    );
};

export default AttendanceList;
