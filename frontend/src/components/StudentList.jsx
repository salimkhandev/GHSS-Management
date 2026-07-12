import {
    ArrowBack,
    ArrowForward,
    Class as ClassIcon,
    Close as CloseIcon,
    FilterList as FilterListIcon,
    Groups as GroupsIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useScrollTrigger,
    useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import apiBase from '../config/api';
import ExportToExcel from './ExportToExcel';

const StudentList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    // Collapse title row when user has scrolled down
    const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 60 });

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
    const [showFilters, setShowFilters] = useState(false);

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
                    <Card sx={{ borderRadius: 4 }}>
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
                {/* Sticky Header: full at top, compact when scrolled */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        bgcolor: 'background.default',
                        // Less padding when scrolled
                        py: scrolled ? 0.5 : 1,
                        mb: { xs: 1, md: 2 },
                        transition: 'padding 0.2s ease',
                    }}
                >
                    {/* Title row — hidden when scrolled */}
                    <Collapse in={!scrolled} timeout={200}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={2}
                            sx={{ mb: 1.5 }}
                        >
                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                sx={{
                                    fontWeight: 700,
                                    fontFamily: '"Poppins", sans-serif',
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                }}
                            >
                                Student Directory
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center">
                                {isMobile && (
                                    <IconButton
                                        onClick={() => setShowFilters(!showFilters)}
                                        sx={{
                                            bgcolor: showFilters ? 'primary.main' : 'background.paper',
                                            color: showFilters ? 'white' : 'primary.main',
                                            boxShadow: 2,
                                            '&:hover': { bgcolor: showFilters ? 'primary.dark' : 'action.hover' }
                                        }}
                                    >
                                        {showFilters ? <CloseIcon /> : <FilterListIcon />}
                                    </IconButton>
                                )}
                                <Chip
                                    icon={<GroupsIcon />}
                                    label={`${filteredStudents.length || students.length} Students`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                {selectedClass && selectedSection && (
                                    <ExportToExcel data={filteredStudents.length > 0 ? filteredStudents : students} />
                                )}
                            </Stack>
                        </Stack>
                    </Collapse>

                    {/* Filter bar — always visible, compact size when scrolled */}
                    <Collapse in={!isMobile || showFilters} timeout="auto">
                        <Card sx={{ mb: 0, p: scrolled ? { xs: 0.75, md: 1 } : { xs: 1.5, md: 2 }, borderRadius: 3, boxShadow: 3, transition: 'padding 0.2s ease' }}>
                            <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="center">
                            {/* Search Field */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Search Students"
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name..."
                                    size="small" // Make input thinner
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            height: { xs: 48, sm: 56 },
                                            '& fieldset': {
                                                borderWidth: '2px',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'var(--color-primary)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'var(--color-primary)',
                                                borderWidth: 2,
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            '&.Mui-focused': {
                                                color: 'var(--color-primary)',
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
                                <FormControl fullWidth size="small">
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
                                <FormControl fullWidth disabled={!selectedClass} size="small">
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
                    </Collapse>
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
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={student.id || index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.5)',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                                transform: 'translateY(-4px)',
                                                borderColor: 'var(--color-primary)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: { xs: 45, md: 50 },
                                                        height: { xs: 45, md: 50 },
                                                        bgcolor: 'var(--color-primary)',
                                                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                                                        fontWeight: 700,
                                                        mb: 1,
                                                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
                                                    }}
                                                >
                                                    {student.student_name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography
                                                    variant={isMobile ? 'body1' : 'subtitle1'}
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontFamily: '"Poppins", sans-serif',
                                                        textAlign: 'center',
                                                        color: 'text.primary',
                                                        mb: 0.5,
                                                        fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {student.student_name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    ID: 
                                                    <Chip
                                                        label={student.id}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <ClassIcon sx={{ fontSize: '1rem' }} color="action" />
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                        <strong>{student.class_name || 'N/A'}</strong>
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <GroupsIcon sx={{ fontSize: '1rem' }} color="action" />
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                        Section: <strong>{student.section_name || 'N/A'}</strong>
                                                    </Typography>
                                                </Box>
                                                {student.father_name && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PersonIcon sx={{ fontSize: '1rem' }} color="action" />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '0.8rem'
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
                                        bgcolor: 'var(--color-primary)',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': { 
                                            bgcolor: 'var(--color-primary-dark)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(26, 35, 126, 0.4)',
                                        },
                                        '&:disabled': { 
                                            bgcolor: 'action.disabledBackground',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>

                                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: '"Poppins", sans-serif', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                    Page {page} of {totalpages}
                                </Typography>

                                <IconButton
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalpages}
                                    sx={{
                                        bgcolor: 'var(--color-primary)',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': { 
                                            bgcolor: 'var(--color-primary-dark)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(26, 35, 126, 0.4)',
                                        },
                                        '&:disabled': { 
                                            bgcolor: 'action.disabledBackground',
                                            boxShadow: 'none',
                                        },
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
