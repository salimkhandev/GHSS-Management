   import { useState, useEffect } from 'react';
import {
    Container,
    List,
    ListItem,
    ListItemText,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Box,
    Button,
    Collapse,
    IconButton,
    Modal,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ClassSectionSelector = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [className, setClassName] = useState('');
    const [expandedRecords, setExpandedRecords] = useState({});
    const [sectionModalOpen, setSectionModalOpen] = useState(false);

    // Fetch classes on component mount
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/classes');
                setClasses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Fetch sections when selectedClassId changes
    useEffect(() => {
        const fetchSections = async () => {
            if (selectedClassId) {
                setLoading(true);
                try {
                    const response = await axios.post('http://localhost:3000/getsec', { class_id: selectedClassId });
                    setSections(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching sections:', error);
                    setLoading(false);
                }
            }
        };
        fetchSections();
    }, [selectedClassId]);

    // Fetch attendance when class and section are selected
    useEffect(() => {
        const fetchAttendanceStatus = async () => {
            if (selectedClassId && selectedSectionId) {
                setLoading(true);
                try {
                    const response = await axios.get('http://localhost:3000/studentAttendanceStatus', {
                        params: { class_id: selectedClassId, section_id: selectedSectionId }
                    });
                    setAttendanceRecords(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching attendance status:', error);
                    setLoading(false);
                }
            }
        };
        fetchAttendanceStatus();
    }, [selectedClassId, selectedSectionId]);

    const handleClassClick = (classId, name) => {
        setClassName(name);
        setSelectedClassId(classId);
        setSections([]);
        setAttendanceRecords([]);
        setSectionModalOpen(true); // Open the section modal when a class is selected
    };

    const handleSectionClick = (sectionId) => {
        setSelectedSectionId(sectionId);
        setSectionModalOpen(false); // Close the section modal when a section is selected
    };

    const handleCloseSectionModal = () => {
        setSectionModalOpen(false);
        setSelectedClassId(null);
    };

    const toggleCollapse = (date) => {
        setExpandedRecords((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>
                Class & Section Selector
            </Typography>

            {/* Class Selection */}
            <Grid container spacing={2}>
                {classes.map((classItem) => (
                    <Grid item key={classItem.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                backgroundColor: '#f0f4c3',
                                cursor: 'pointer',
                                borderRadius: '12px',
                                textAlign: 'center',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                            }}
                            onClick={() => handleClassClick(classItem.id, classItem.name)}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#558b2f' }}>
                                    {classItem.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Section Selection Modal */}
            <Modal open={sectionModalOpen} onClose={handleCloseSectionModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <IconButton onClick={handleCloseSectionModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Sections for {className}
                    </Typography>
                    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {sections.map((section) => (
                            <Button
                                key={section.id}
                                onClick={() => handleSectionClick(section.id)}
                                sx={{
                                    width: '100%',
                                    mb: 1,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    backgroundColor: '#aed581',
                                    '&:hover': {
                                        backgroundColor: '#9ccc65',
                                    },
                                }}
                            >
                                {section.name}
                            </Button>
                        ))}
                    </List>
                </Box>
            </Modal>

            {/* Attendance Records */}
            <Container sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#33691e' }}>
                    Attendance Records
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : attendanceRecords.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        No attendance records found.
                    </Typography>
                ) : (
                    attendanceRecords.map((record, index) => (
                        <Card key={index} sx={{ mb: 2, backgroundColor: '#f1f8e9' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                                <Typography variant="subtitle1">
                                    Date: {record.attendance_date}
                                </Typography>
                                <IconButton onClick={() => toggleCollapse(record.attendance_date)}>
                                    {expandedRecords[record.attendance_date] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                            <Collapse in={expandedRecords[record.attendance_date]} timeout="auto" unmountOnExit>
                                <Divider />
                                <List sx={{ p: 2 }}>
                                    {record.attendance_records.map((student, studentIndex) => (
                                        <ListItem key={studentIndex}>
                                            <ListItemText
                                                primary={student.name}
                                                secondary={`Status: ${student.status}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </Card>
                    ))
                )}
            </Container>
        </Container>
    );
};

export default ClassSectionSelector;
