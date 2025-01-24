import { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Typography, Grid, Card,CircularProgress, CardContent } from '@mui/material';
import axios from 'axios';
import { Transform } from '@mui/icons-material';
import PieChart from "./PieChart";

const AttendanceStatusList = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]); // Store sections of selected class
    const [selectedClassId, setSelectedClassId] = useState(null); // Store selected class ID
    const [selectedSectionId, setSelectedSectionId] = useState(null); // Store selected section ID
    const [loading, setLoading] = useState(false)
    const [className,setClassName] = useState('')


    // Fetch classes data on component mount
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true)
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/classes');
                setClasses(response.data);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false)
            }
        };
        fetchClasses();
    }, []);

    // Fetch sections when selectedClassId changes (i.e., when a class is clicked)
    useEffect(() => {
        const fetchSections = async () => {
            setLoading(true)

            if (selectedClassId) { // Fetch only when a class is selected
                try {
                    const response = await axios.post('https://ghss-management-backend.vercel.app/getsec', { class_id: selectedClassId });
                    setSections(response.data); 
                    setLoading(false)
// Update the sections state with fetched sections
                } catch (error) {
                    console.error('Error fetching sections:', error);
                    setLoading(false)

                }
            }
        };
        fetchSections();
    }, [selectedClassId]); // Trigger fetchSections when selectedClassId changes

    // Fetch attendance status
    useEffect(() => {
        const fetchAttendanceStatus = async () => {
            setLoading(true)

            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/studentAttendanceStatus',{params:{class_id:selectedClassId,section_id:selectedSectionId}});
                setAttendanceRecords(response.data);
                setLoading(false)

            } catch (error) {
                console.error('Error fetching attendance status:', error);
                setLoading(false)

            }
        };
        fetchAttendanceStatus();
    }, [selectedClassId,selectedSectionId]);

    // Handle class click and fetch corresponding sections
    const handleClassClick = (classId) => {
        setSelectedClassId(classId); // Set the selected class ID
        setSections([]); // Clear previous sections while new ones are fetched
        setAttendanceRecords([]); // Clear previous sections while new ones are fetched
    };

    // Handle section click and store section_id
    const handleSectionClick = (sectionId) => {
        setSelectedSectionId(sectionId); // Store the selected section ID
        console.log('Selected Section ID:', sectionId); // Optional: For debugging, you can log the selected section ID
    };

    if(loading){
        
          return <div className='flex items-center justify-center min-h-screen'>
                <CircularProgress/>
            </div>
}
    return (
        <>
        
            {/* Display class cards */}
            {classes.length > 0 && (
                <Grid container spacing={2} alignItems="center">
                    {classes.map((classItem) => (
                        <Grid item key={classItem.id} xs={12} sm={6} md={4}>
                            <Card 
                            // sx={{ maxWidth: 345}}
                            //         className="transition-transform duration-300 ease-in-out transform scale-100 hover:scale-110 bg-blue-500 text-white"
                                sx={{
                                    // Dynamic styles using `sx` prop
                                    transition: 'transform 0.3s ease-in-out', // Transition effect
                                    transform: 'scale(1)', // Initial scale
                                    '&:hover': {
                                        transform: 'scale(1.1)', // Scale on hover
                                    },
                                }}
                            
                            style={{
                                    backgroundColor: classItem.id === selectedClassId ? '#d1e7dd' : '#f5f5f5'}} 
                            >
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        onClick={() => handleClassClick(classItem.id,setClassName(classItem.name))}
                                        style={{ cursor: 'pointer',
                                          



                                         }} // Make the text clickable
                                    >
                                        {classItem.name} {/* Assuming class_name is correct */}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Display sections of the selected class */}
            {sections.length > 0 && (
                <Container style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '600px', marginTop: '20px' }}>
                    <Typography variant="h6" gutterBottom>
                        Sections for Class: {className}
                    </Typography>
                    <List>
                        {sections.map((section) => (
                            <ListItem
                            
                                key={section.id}
                                style={{
                                    backgroundColor: section.id === selectedSectionId ? '#d1e7dd' : '#f5f5f5',

                                     marginBottom: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                onClick={() => handleSectionClick(section.id)} // Handle section click
                            >
                                <ListItemText primary={section.name} /> {/* Assuming section_name is the correct field */}
                            </ListItem>
                        ))}
                    </List>
                </Container>
            )}

            {/* Display attendance status */}
            <Container style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '600px', marginTop: '20px' }}>
                <div>
                    <PieChart />
                </div>
                <Typography variant="h5" gutterBottom>
                    Attendance Status
                </Typography>

                {/* Loop through attendance records grouped by date */}
                {
                    attendanceRecords<=0?(
                        <Typography variant="body2" color="textSecondary" component="p">
                            No attendance records found.
                        </Typography>

                    ):( 
                        
                        <>
                        {attendanceRecords.map((record, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                        {/* Display the attendance date as a header */}
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                            {record.attendance_date}
                        </Typography>
                        <List>
                            {/* Loop through each student under this date */}
                            {record.attendance_records.map((student, studentIndex) => (
                                <ListItem
                                    key={studentIndex}
                                    style={{ backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '5px' }}
                                >
                                    <ListItemText
                                        primary={student.name}
                                        secondary={`Status: ${student.status}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                ))}
                </>
                    )
                }
            </Container>
        </>
    );
};

export default AttendanceStatusList;
