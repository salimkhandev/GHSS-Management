import { 
    ArrowForward as ArrowIcon,
    Class as ClassIcon,
    Groups as GroupsIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    School as SchoolIcon,
    SwitchLeft as PromoteIcon 
} from '@mui/icons-material';
import {
    Box, 
    Card, 
    CardContent, 
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel, 
    Grid, 
    InputAdornment, 
    InputLabel, 
    MenuItem,
    Paper,
    Select, 
    Skeleton,
    TextField, 
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Classes from './setClassIdSectionId';

const ClassSelector = () => {
    const theme = useTheme();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNoStudentsMessage, setShowNoStudentsMessage] = useState(false);

    // Selections state
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');

    // Search and selection state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [allIds, setAllIds] = useState([]);

    // Derived state
    const totalSelectedStudents = selectedStudentIds.length;
    const studentInSection = filteredStudents.filter(
        student => student.section_name?.toLowerCase() === selectedSection?.toLowerCase()
    ).length;

    const Loader = () => (
        <Box sx={{ width: '100%', p: 4 }}>
            <Grid container spacing={3}>
                {[1, 2, 3].map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item}>
                        <Skeleton 
                            variant="rectangular" 
                            height={200} 
                            sx={{ 
                                borderRadius: 2,
                                bgcolor: 'rgba(0,0,0,0.04)'
                            }} 
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    // Fetch initial classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/classes');
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Fetch sections when class is selected
    const fetchSections = async (classId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://ghss-management-backend.vercel.app/get-sections',
                { class_id: classId }
            );
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch students when section is selected
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedClassId || !selectedSectionId) return;

            setLoading(true);
            try {
                const response = await axios.get(
                    'https://ghss-management-backend.vercel.app/filteredSectionStd',
                    {
                        params: {
                            class_id: selectedClassId,
                            section_id: selectedSectionId
                        }
                    }
                );

                setStudents(response.data.students);
                setAllIds(response.data.allIds);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [selectedClassId, selectedSectionId]);

    // Filter students based on search
    useEffect(() => {
        const timeout = setTimeout(() => {
            const filtered = students.filter(student =>
                student.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStudents(filtered);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, students]);

    // Show no students message
    useEffect(() => {
        const timeout = setTimeout(() => {
            const shouldShow = filteredStudents.length === 0 && !loading &&
                selectedClass && selectedSection;
            setShowNoStudentsMessage(shouldShow);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [filteredStudents, loading, selectedSection, selectedClass]);

    // Handlers
    const handleClassChange = (e) => {
        const className = e.target.value;
        const classObj = classes.find(c => c.name === className);

        setSelectedClass(className);
        setSelectedSection('');
        setSelectedSectionId('');
        setStudents([]);
        setFilteredStudents([]);

        if (classObj) {
            setSelectedClassId(classObj.id);
            fetchSections(classObj.id);
        }
    };

    const handleSectionChange = (e) => {
        const sectionName = e.target.value;
        const sectionObj = sections.find(s => s.name === sectionName);

        setSelectedSection(sectionName);
        setSelectedSectionId(sectionObj?.id || '');
        setStudents([]);
        setFilteredStudents([]);
    };

    const handleSelectAll = () => {
        setSelectAll(prev => !prev);
        setSelectedStudentIds(prev => prev.length === allIds.length ? [] : allIds);
    };

    const handleCheckboxChange = (studentId) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <Box sx={{ 
            p: 4, 
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)'
        }}>
            <Paper 
                elevation={3}
                sx={{ 
                    maxWidth: '1200px', 
                    mx: 'auto',
                    p: 3,
                    borderRadius: 2
                }}
            >
                {/* Header Section */}
                <Box sx={{ 
                    mb: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                    p: 3,
                    borderRadius: 2,
                    color: 'white'
                }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            fontWeight: 700,
                            mb: 1
                        }}
                    >
                        <PromoteIcon fontSize="large" />
                        Promote Students
                    </Typography>
                    {selectedClass && (
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                            Promoting From {selectedClass}
                        </Typography>
                    )}
                </Box>

                {/* Search Bar */}
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 3
                }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ 
                            width: { xs: '100%', sm: '300px' },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'white',
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                }
                            }
                        }}
                    />
                </Box>

                {/* Class/Section Selectors */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={handleClassChange}
                                label="Select Class"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <ClassIcon color="primary" />
                                    </InputAdornment>
                                }
                            >
                                {classes.map(cls => (
                                    <MenuItem key={cls.id} value={cls.name}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth disabled={!selectedClass}>
                            <InputLabel>Select Section</InputLabel>
                            <Select
                                value={selectedSection}
                                onChange={handleSectionChange}
                                label="Select Section"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SchoolIcon color="primary" />
                                    </InputAdornment>
                                }
                            >
                                {sections.map(sec => (
                                    <MenuItem key={sec.id} value={sec.name}>
                                        {sec.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Student Selection Section */}
                {selectedClass && selectedSection && (
                    <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: 1,
                                    color: theme.palette.text.primary
                                }}>
                                    <GroupsIcon color="primary" fontSize="small" />
                                    {`Select All (${totalSelectedStudents}/${allIds.length} selected)`}
                                </Typography>
                            }
                        />
                    </Box>
                )}

                {/* Student Cards */}
                {loading ? (
                    <Loader />
                ) : showNoStudentsMessage ? (
                    <Box sx={{ 
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2,
                        color: theme.palette.text.secondary
                    }}>
                        <PersonIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                        <Typography>No students found for the selected criteria.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredStudents.map(student => (
                            <Grid item xs={12} sm={6} md={4} key={student.id}>
                                <Card sx={{ 
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}>
                                    <CardContent>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 2,
                                            color: theme.palette.primary.main
                                        }}>
                                            <PersonIcon />
                                            <Typography variant="h6">
                                                ID: {student.id}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ mb: 1 }}>
                                            Name: {student.student_name}
                                        </Typography>
                                        <Typography sx={{ mb: 1 }}>
                                            Class: {student.class_name}
                                        </Typography>
                                        <Typography sx={{ mb: 2 }}>
                                            Section: {student.section_name}
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => handleCheckboxChange(student.id)}
                                                    color="primary"
                                                />
                                            }
                                            label="Select for Promotion"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Promotion Target Section */}
                {filteredStudents.length > 0 && !loading && (
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                mb: 3,
                                color: theme.palette.primary.main,
                                fontWeight: 600
                            }}
                        >
                            <ArrowIcon />
                            Promoting To
                        </Typography>
                        <Classes
                            selectedClass={selectedClassId}
                            selectedSection={selectedSectionId}
                            studentIds={selectedStudentIds}
                            selectedSectionName={selectedSection}
                            totalSelectedStudents={totalSelectedStudents}
                            setFilteredStudents={setFilteredStudents}
                            handleSelectAllChange={handleSelectAll}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ClassSelector;