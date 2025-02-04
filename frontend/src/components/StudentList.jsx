import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, Button, CardContent, Grid, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExportToExcel from './ExportToExcel';

import { ArrowBack, ArrowForward } from '@mui/icons-material';

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
                const response = await axios.get('https://ghss-management-backend.vercel.app/mystudents',{params: {page:page}});
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
        <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="relative">
              
            <div className='flex w-full'>
                <Typography variant="h6" color="initial">
                   {selectedClass && !selectedSection?` Students in ${selectedClass}: ${totalDeptStudents}`:''}
                </Typography>
                </div>

  <Box> 
    <Typography variant="h4" component="h2" gutterBottom className="whitespace-nowrap mb-6">
                    Student List
                </Typography>
                        </Box>
                <TextField

                    variant="outlined"
                    placeholder="Search students"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    
                    style={{ marginLeft: '960px', marginTop: '0px' }} // Optional: add some spacing
                />

            </div>


                    <div className='sticky top-36  items-center'>
                <FormControl fullWidth variant="outlined" className="max-w-xs" style={{ marginTop: '-55px' }}>
                    <InputLabel htmlFor="class_select">Select Class</InputLabel>
                    <Select
                        id="class_select"
                        value={selectedClass || 'All Classes'}
                        onChange={handleClassChange}
                        label="Select Class"
                    >
                        <MenuItem value="All Classes" >All Classes</MenuItem>
                        {classes.map(cls => (
                            <MenuItem key={cls.id} value={cls.name}>

                                    {cls.name}
                                 
                                
                            </MenuItem>
                        ))}
                    </Select>
                        {sections.length > 0 && (
                        <FormControl fullWidth variant="outlined" className="max-w-xs" style={{ marginTop: '12px' }}>
                            <InputLabel htmlFor="select_section">Select Section</InputLabel>
                            
                            <Select
                        id="select_section"
                                value={selectedSection || 'All Sections'}
                                                        onChange={handleSectionsChange}
                        label="select section"
                    >
                                <MenuItem value="All Sections" >All Sections</MenuItem>
                        {sections.map(cls => (
                            <MenuItem key={cls.id} value={cls.name}>

                                    {cls.name}
                                 
                                
                            </MenuItem>
                        ))}
                    </Select>
                    </FormControl>

                        )}
                        
                </FormControl>
              
                </div>


           
            
                
                    
                { showNoStudentsMessage && (

                    <Typography variant="body1" className='h-[300px] justify-center flex items-center' color="textSecondary">
                    No students found for the selected criteria.
                    </Typography>
                ) 
                }
            
            
            
            
            {loading ? (
                <div className="flex justify-center items-center min-h-[444px]">
                    <CircularProgress />
                </div>
            ) : (<>
          
                <Grid container spacing={2}>
                    {filteredStudents.map(student => (
                        <Grid item xs={12} sm={6} md={4} key={student.id}>
                            <Card className="shadow-lg">
                                <CardContent>
                                    <Typography variant="h6" component="div" className="font-bold mb-2">
                                        ID: {student.id}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" className="mb-1">
                                        Name: {student.student_name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" className="mb-1">
                                         {student.class_name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        Section: {student.section_name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
 
                </Grid>
{!selectedSection && filteredStudents.length != 0 && !loading &&

                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                p={2}
                                mt={2}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1 || loading}
                                    startIcon={<ArrowBack />}
                                >
                                    Previous
                                </Button>
                                <Typography variant="body1" mx={2}>
                                    {page}/{totalpages}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalpages || loading}
                                    endIcon={<ArrowForward />}
                                >
                                    Next
                                </Button>
                            </Box>
                        }
  </>
            )}
            { selectedClass && selectedClassid && selectedSection && selectedSectionid && !loading && filteredStudents.length>0 &&
                <ExportToExcel students={filteredStudents} />

            }

        </div>
    );
};

export default StudentList;
