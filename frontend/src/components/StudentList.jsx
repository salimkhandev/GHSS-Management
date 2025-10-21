import {
    ArrowBack,
    ArrowForward,
    Class as ClassIcon,
    Download as DownloadIcon,
    Groups as GroupsIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Skeleton,
    useMediaQuery,
    useTheme,
    Container,
    Stack,
    Chip,
    IconButton,
    Avatar
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ExportToExcel from './ExportToExcel';
import apiBase from '../config/api';

const StudentList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [selectedSectionid, setSelectedSectionid] = useState();
    const [selectedClassid, setSelectedClassid] = useState();
    const [totalDeptStudents, setTotalDeptStudents] = useState([]);
    const [showNoStudentsMessage, setShowNoStudentsMessage] = useState(false);
    const [page, setPage] = useState(1);
    const [totalpages, setTotalpages] = useState();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowNoStudentsMessage(filteredStudents.length === 0 && !loading);
        }, 1000);
        if (filteredStudents.length != 0) {
            setShowNoStudentsMessage(false)
        }
        return () => clearTimeout(timeout);
    }, [filteredStudents, loading, selectedSection, selectedClass, selectedClassid, selectedSectionid, students]);

    const handleGetSections = async (clsid) => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiBase}/get-sections`, { class_id: clsid });
            if (response) {
                setSections(response.data);
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching sections', error);
        }
    };

    const handleGetStudentsSec = async (secid) => {
        setLoading(true)
        try {
            const response = await axios.post(`${apiBase}/get-std`, { section_id: secid });
            setStudents(response.data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching sections', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classesResponse = await axios.get(`${apiBase}/classes`);
                setClasses(classesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            setStudents([]);
            setTotalDeptStudents()
            setLoading(true)
            try {
                const responseCls = await axios.get(`${apiBase}/filteredSectionStd`, {
                    params: {
                        class_id: selectedClassid,
                        section_id: selectedSectionid
                    }
                })
                setLoading(false);
                setStudents(responseCls.data.students);
            } catch (error) {
                console.error("Error fetching the classes data:", error);
            }
        };
        if (selectedClassid && selectedSectionid) {
            fetchClasses();
        }
    }, [selectedClassid, selectedSectionid]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${apiBase}/students`, { params: { page: page } });
                setStudents(response.data.rows);
                setTotalpages(response.data.totalPages)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student data:', error);
                setLoading(false);
            }
        };
        if (selectedClass === '') {
            fetchStudents();
        }
    }, [selectedClass, page]);

    useEffect(() => {
        if (selectedClass === '') {
            setStudents([]);
            setTotalpages(0)
        }
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const responseCls = await axios.get(`${apiBase}/filteredClassStd`, {
                    params: {
                        class_id: selectedClassid,
                        page: page
                    }
                })
                setLoading(false);
                setStudents(responseCls.data.students);
                setTotalDeptStudents(responseCls.data.totalCount);
                setTotalpages(responseCls.data.totalPages)
            } catch (error) {
                console.error("Error fetching the classes data:", error);
            }
        };
        if (selectedClassid && selectedClass != '' && (!selectedSectionid || selectedSection === '')) {
            fetchClasses();
        }
    }, [selectedClassid, selectedSectionid, selectedClass, page, selectedSection]);

    useEffect(() => {
        let result = students;
        setTimeout(() => {
            if (searchQuery) {
                result = result.filter(student =>
                    student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setFilteredStudents(result);
        }, 300);
    }, [selectedClass, searchQuery, students, selectedSection]);

    const handleClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value === 'All Classes' ? '' : value);
        setSelectedSection('');
        setSelectedSectionid('');
        setSections([]);

        if (value !== 'All Classes') {
            const getSelectedObj = classes.find(cls => cls.name === value)
            if (getSelectedObj) {
                handleGetSections(getSelectedObj.id)
                setSelectedClassid(getSelectedObj.id)
            }
        }
    };

    const handleSectionsChange = async (e) => {
        const value = e.target.value;
        setSelectedSection(value === 'All Sections' ? setSelectedSectionid('') : value);
        if (value !== 'All Sections') {
            const getSelectedObj = sections.find(sec => sec.name === value);
            if (getSelectedObj) {
                setSelectedSectionid(getSelectedObj.id)
            }
        }
        handleGetStudentsSec(value)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const LoadingSkeleton = () => (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Skeleton variant="circular" width={60} height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="text" height={30} width="80%" />
                            <Skeleton variant="text" height={20} width="60%" />
                            <Skeleton variant="text" height={20} width="70%" />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                py: { xs: 2, md: 4 },
                px: { xs: 1, sm: 2, md: 3 },
            }}
        >
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: { xs: 56, md: 64 },
                        zIndex: 10,
                        bgcolor: 'background.default',
                        py: 2,
                        mb: { xs: 2, md: 3 },
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Typography
                            variant={isMobile ? 'h5' : 'h4'}
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Student Directory
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                icon={<GroupsIcon />}
                                label={`${filteredStudents.length || students.length} Students`}
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                            <ExportToExcel data={filteredStudents.length > 0 ? filteredStudents : students} />
                        </Stack>
                    </Stack>

                    {/* Filters Section */}
                    <Card sx={{ mb: 0, p: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: 3 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            {/* Search Field */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Search Students"
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            '& fieldset': {
                                                borderWidth: '2px',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Class Filter */}
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        value={selectedClass || 'All Classes'}
                                        onChange={handleClassChange}
                                        label="Class"
                                        sx={{
                                            borderRadius: 3,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '2px',
                                            },
                                        }}
                                    >
                                        <MenuItem value="All Classes">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SchoolIcon fontSize="small" />
                                                All Classes
                                            </Box>
                                        </MenuItem>
                                        {classes.map((cls) => (
                                            <MenuItem key={cls.id} value={cls.name}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <ClassIcon fontSize="small" />
                                                    {cls.name}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Section Filter */}
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth disabled={!selectedClass}>
                                    <InputLabel>Section</InputLabel>
                                    <Select
                                        value={selectedSection || 'All Sections'}
                                        onChange={handleSectionsChange}
                                        label="Section"
                                        sx={{
                                            borderRadius: 3,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '2px',
                                            },
                                        }}
                                    >
                                        <MenuItem value="All Sections">All Sections</MenuItem>
                                        {sections.map((sec) => (
                                            <MenuItem key={sec.id} value={sec.name}>
                                                {sec.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Card>
                </Box>

                {/* Students Grid */}
                {loading ? (
                    <LoadingSkeleton />
                ) : showNoStudentsMessage ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '50vh',
                            textAlign: 'center',
                            px: 2,
                        }}
                    >
                        <SchoolIcon sx={{ fontSize: { xs: 80, md: 120 }, color: 'primary.light', mb: 2 }} />
                        <Typography variant={isMobile ? 'h6' : 'h5'} color="text.secondary" sx={{ mb: 1 }}>
                            No Students Found
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            Try adjusting your filters or search query
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            {(filteredStudents.length > 0 ? filteredStudents : students).map((student, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={student.id || index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: 6,
                                                transform: 'translateY(-8px)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: { xs: 60, md: 70 },
                                                        height: { xs: 60, md: 70 },
                                                        bgcolor: 'primary.main',
                                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                                        fontWeight: 700,
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    {student.student_name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography
                                                    variant={isMobile ? 'body1' : 'h6'}
                                                    sx={{
                                                        fontWeight: 600,
                                                        textAlign: 'center',
                                                        color: 'text.primary',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {student.student_name}
                                                </Typography>
                                                <Chip
                                                    label={student.roll_no}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <ClassIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Class: <strong>{student.class_name || 'N/A'}</strong>
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <GroupsIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Section: <strong>{student.section_name || 'N/A'}</strong>
                                                    </Typography>
                                                </Box>
                                                {student.father_name && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PersonIcon fontSize="small" color="action" />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Father: <strong>{student.father_name}</strong>
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalpages > 1 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: 4,
                                    gap: 2,
                                }}
                            >
                                <IconButton
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        '&:disabled': { bgcolor: 'action.disabledBackground' },
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>

                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Page {page} of {totalpages}
                                </Typography>

                                <IconButton
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalpages}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        '&:disabled': { bgcolor: 'action.disabledBackground' },
                                    }}
                                >
                                    <ArrowForward />
                                </IconButton>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default StudentList;
