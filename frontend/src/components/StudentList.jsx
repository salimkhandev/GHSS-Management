import { ArrowBack, ArrowForward, Class as ClassIcon, Download as DownloadIcon, Groups as GroupsIcon, Person as PersonIcon, School as SchoolIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ExportToExcel from './ExportToExcel';

const StudentList = () => {
    
    
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowNoStudentsMessage(filteredStudents.length === 0 && !loading);
        }, 1000);
        if (filteredStudents.length != 0) {
            setShowNoStudentsMessage(false)
        }
        return () => clearTimeout(timeout); // Clear timeout on component unmount
    }, [filteredStudents, loading,selectedSection,selectedClass,selectedClassid,selectedSectionid,students]);

    const [page, setPage] = useState(1);
    const [totalpages, setTotalpages] = useState();


    const handleGetSections = async (clsid) => {
        setLoading(true);
    
        try {
            const response = await axios.post('https://ghss-management-backend.vercel.app/get-sections', { class_id: clsid });
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
            const response = await axios.post('https://ghss-management-backend.vercel.app/get-std', { section_id: secid });
            setStudents(response.data);
            setLoading(false)

        } catch (error) {
            console.error('Error fetching sections', error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {

                const classesResponse = await axios.get('https://ghss-management-backend.vercel.app/classes');
                setClasses(classesResponse.data);

                // setTimeout(() => {
                // }, 1000);
                setLoading(false);
                    
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    //testing 



    useEffect(() => {
        const fetchClasses = async () => {
            setStudents([]);
        
            setTotalDeptStudents()
           
            setLoading(true)
            try {
                const responseCls = await axios.get('https://ghss-management-backend.vercel.app/filteredSectionStd',

                    {
                        params: {
                            class_id: selectedClassid,
                            section_id: selectedSectionid
                        }
                    })
                // setTimeout(() => {
                    setLoading(false);
    
                // }, 3000);
                setStudents(responseCls.data.students);
                console.log('❤️❤️❤️❤️',responseCls.data.total);
                // setTotalDeptStudents(responseCls.data.total);
                    

            } catch (error) {
                console.error("Error fetching the classes data:", error);
            }
        };
        if (selectedClassid && selectedSectionid) {
            fetchClasses();
        }
    }, [selectedClassid, selectedSectionid]);
//testing 

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true)
                const response = await axios.get('https://ghss-management-backend.vercel.app/students',{params: {page:page}});
                setStudents(response.data.rows);
                setTotalpages(response.data.totalPages) // Update state with the fetched students data
                
               
                    
                    setLoading(false);
        
                // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching student data:', error);
                setLoading(false); // Set loading to false even if there is an error
            }
        };
        if (selectedClass==='') {
            fetchStudents(); // Call the fetch function
            
        }

    }, [selectedClass,page]);


    useEffect(() => {
        if (selectedClass === '') {
            setStudents([]);
            setTotalpages(0)

        }
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const responseCls = await axios.get('https://ghss-management-backend.vercel.app/filteredClassStd',

                    {
                        params: {
                            class_id: selectedClassid,
                            page:page
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
    }, [selectedClassid, selectedSectionid, selectedClass, page , selectedSection]);


// testing
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
    

    }, [selectedClass, searchQuery, students,selectedSection]);

    const handleClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value === 'All Classes' ? '' : value);
        // Reset section state
        setSelectedSection('');
        setSelectedSectionid('');
        setSections([]); // Clear the sections dropdown

        if(value!=='All Classes'){

            const getSelectedObj=classes.find(cls=>cls.name === value)
            if (getSelectedObj) {
                handleGetSections(getSelectedObj.id)
                setSelectedClassid(getSelectedObj.id)
            }
        }
    };
    const handleSectionsChange = async (e) => {
      const value=e.target.value;
        setSelectedSection(value === 'All Sections' ? setSelectedSectionid(''): value);
        if (value !== 'All Sections') {
            const getSelectedObj = sections.find(sec => sec.name === value);
            if (getSelectedObj) {
                console.log('My heart ❤️❌', getSelectedObj.id);
                setSelectedSectionid(getSelectedObj.id)

            }
            // handleGetStudentsSec(value);
        }
          handleGetStudentsSec(value)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    


    return (
        <div className="p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto">
                <div className="relative mb-8">
                    <Box className="flex justify-between items-center mb-6">
                        <Typography 
                            variant="h4" 
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <GroupsIcon fontSize="large" sx={{ color: '#1976d2' }} />
                            Student List
                        </Typography>

                        <TextField
                            variant="outlined"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{
                                width: { xs: '100%', sm: '300px' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2',
                                        }
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {selectedClass && !selectedSection && (
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 2
                            }}
                        >
                            <SchoolIcon />
                            Students in {selectedClass}: {totalDeptStudents}
                        </Typography>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <FormControl 
                            variant="outlined" 
                            sx={{ 
                                minWidth: 200,
                                backgroundColor: 'white',
                                borderRadius: 1
                            }}
                        >
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={selectedClass || 'All Classes'}
                                onChange={handleClassChange}
                                label="Select Class"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <ClassIcon color="primary" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="All Classes">All Classes</MenuItem>
                                {classes.map(cls => (
                                    <MenuItem key={cls.id} value={cls.name}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {sections.length > 0 && (
                            <FormControl 
                                variant="outlined" 
                                sx={{ 
                                    minWidth: 200,
                                    backgroundColor: 'white',
                                    borderRadius: 1
                                }}
                            >
                                <InputLabel>Select Section</InputLabel>
                                <Select
                                    value={selectedSection || 'All Sections'}
                                    onChange={handleSectionsChange}
                                    label="Select Section"
                                >
                                    <MenuItem value="All Sections">All Sections</MenuItem>
                                    {sections.map(cls => (
                                        <MenuItem key={cls.id} value={cls.name}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </div>
                </div>

                {showNoStudentsMessage && (
                    <Box 
                        sx={{ 
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            color: 'text.secondary'
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                        <Typography>No students found for the selected criteria.</Typography>
                    </Box>
                )}

                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <Card sx={{ 
                                    height: '100%',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    }
                                }}>
                                    <CardContent>
                                        {/* Student ID with Icon Skeleton */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            mb: 2 
                                        }}>
                                            <Skeleton variant="circular" width={24} height={24} />
                                            <Skeleton 
                                                variant="text" 
                                                width={120} 
                                                sx={{ 
                                                    height: 32,
                                                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                                    opacity: 0.1
                                                }} 
                                            />
                                        </Box>

                                        {/* Student Name Skeleton */}
                                        <Box sx={{ mb: 1 }}>
                                            <Skeleton variant="text" width="90%" height={24} />
                                        </Box>

                                        {/* Class Name Skeleton */}
                                        <Box sx={{ mb: 1 }}>
                                            <Skeleton variant="text" width="60%" height={24} />
                                        </Box>

                                        {/* Section Skeleton */}
                                        <Box>
                                            <Skeleton variant="text" width="40%" height={24} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {filteredStudents.map(student => (
                                <Grid item xs={12} sm={6} md={4} key={student.id}>
                                    <Card 
                                        sx={{ 
                                            height: '100%',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: '#1976d2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 2
                                                }}
                                            >
                                                <PersonIcon />
                                                ID: {student.id}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                Name: {student.student_name}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {student.class_name}
                                            </Typography>
                                            <Typography variant="body1">
                                                Section: {student.section_name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {!selectedSection && filteredStudents.length > 0 && !loading && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 2,
                                    mt: 4
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1 || loading}
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                                        }
                                    }}
                                >
                                    Previous
                                </Button>
                                <Typography variant="body1" sx={{ mx: 2 }}>
                                    Page {page} of {totalpages}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalpages || loading}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                                        }
                                    }}
                                >
                                    Next
                                </Button>
                            </Box>
                        )}
                    </>
                )}

                {selectedClass && selectedClassid && selectedSection && selectedSectionid && !loading && filteredStudents.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)'
                                }
                            }}
                        >
                            <ExportToExcel students={filteredStudents} />
                        </Button>
                    </Box>
                )}
            </div>
        </div>
    );
};

export default StudentList;
