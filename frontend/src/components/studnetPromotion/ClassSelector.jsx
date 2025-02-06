import SearchIcon from '@mui/icons-material/Search';
import {
    Box, Card, CardContent, Checkbox, LinearProgress, FormControl,
    FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem,
    Select, TextField, Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Classes from './setClassIdSectionId';

const ClassSelector = () => {
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
        <Box sx={{ width: '100%' }}>
            <LinearProgress color="secondary" />
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
        <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
            {/* Header Section */}
            <Box className="w-full max-w-6xl">
                <Typography variant="h4" gutterBottom className="text-center mb-6">
                    Promote Students
                </Typography>

                <Box className="flex justify-between items-center mb-6">
                    <Typography variant="h6">
                        Promoting From {selectedClass && `- ${selectedClass}`}
                    </Typography>

                    <TextField
                        variant="outlined"
                        placeholder="Search students"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        className="w-64"
                    />
                </Box>

                {/* Class/Section Selectors */}
                <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={handleClassChange}
                                label="Select Class"
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

                {/* Student Cards */}
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {selectedClass && selectedSection && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                }
                                label={`Select All (${totalSelectedStudents}/${allIds.length} selected)`}
                                className="mb-4"
                            />
                        )}

                        {showNoStudentsMessage ? (
                            <Typography className="h-[300px] flex items-center justify-center">
                                No students found for the selected criteria.
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredStudents.map(student => (
                                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                                        <Card className="shadow-lg">
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    ID: {student.id}
                                                </Typography>
                                                <Typography gutterBottom>
                                                    Name: {student.student_name}
                                                </Typography>
                                                <Typography gutterBottom>
                                                    Class: {student.class_name}
                                                </Typography>
                                                <Typography gutterBottom>
                                                    Section: {student.section_name}
                                                </Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedStudentIds.includes(student.id)}
                                                            onChange={() => handleCheckboxChange(student.id)}
                                                        />
                                                    }
                                                    label="Select"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {/* Promotion Target Section */}
                {filteredStudents.length > 0 && !loading && (
                    <Box className="mt-8 w-full">
                        <Typography variant="h6" className="text-center mb-4">
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
            </Box>
        </div>
    );
};

export default ClassSelector;