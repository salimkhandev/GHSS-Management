import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Classes from './setClassIdSectionId'; // Import the Classes component

import { useNavigate } from 'react-router-dom';

const ClassSelector = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [totalDeptStudents, setTotalDeptStudents] = useState([]);
    const [studentInSec, setStudentInSec] = useState();
    const [selectedSectionid, setSelectedSectionid] = useState();
    const [selectedClassid, setSelectedClassid] = useState();
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [allIds, setAllIds] = useState([]);
    const [showNoStudentsMessage, setShowNoStudentsMessage] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        
        const checkAuth = async () => {
            try {
                const response = await fetch('https://ghss-management-backend.vercel.app/verify-token-asAdmin', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
                console.log(data);


                if (data.authenticated) {
                    setAuthenticated(true);
                } else {
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowNoStudentsMessage(filteredStudents.length === 0 && !loading && selectedClass && selectedSection &&selectedClassid && selectedSectionid);
        }, 1000);
        if (filteredStudents.length != 0) {
            setShowNoStudentsMessage(false)
        }
        return () => clearTimeout(timeout); // Clear timeout on component unmount
    }, [filteredStudents, loading, selectedSection, selectedClass, selectedClassid, selectedSectionid]);
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            // const selectAllids = filteredStudents.map(student => student.id)
            setSelectedStudentIds(allIds)
        } else {
            setSelectedStudentIds([])
        }
    }

    const handleGetSections = async (clsid) => {
        setLoading(true)
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


    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true);
            try {

                const classesResponse = await axios.get('https://ghss-management-backend.vercel.app/classes');
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
         
        setAllIds([])
            // setTotalDeptStudents([])
            setLoading(true)
            
            try {
                const responseCls = await axios.get('https://ghss-management-backend.vercel.app/filteredSectionStd',
                    
                    {
                        params: {
                            class_id: selectedClassid,
                            section_id: selectedSectionid
                        }
                    })
                    setLoading(false);
                    if (selectedSection!='') {
                        
                        setStudents(responseCls.data.students);
                    }else{
                        setStudents([])
                    }
                    // setTesting(responseCls.data.allIds)
                    setAllIds(responseCls.data.allIds);
                setTotalDeptStudents(responseCls.data.total);


            } catch (error) {
                console.error("Error fetching the classes data:", error);
            }
        };
     
        if (selectedClassid && selectedSectionid) {
            fetchClasses();
        }
    }, [selectedClassid, selectedSectionid,selectedSection,]);



    useEffect(() => {
        let result = students;
        if (selectedSection !== '') {
            const totalStudentsInSelectedSection = result.filter(student => student.section_name.toLowerCase() === selectedSection.toLowerCase()).length;
            setStudentInSec(totalStudentsInSelectedSection);
        }
     const clearTime=setTimeout(() => {
    if (searchQuery) {
        result = result.filter(student =>
            student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    setFilteredStudents(result);
    
}, 300);
return () => clearTimeout(clearTime);


    }, [selectedClass, searchQuery, students, selectedSection]);



    const handleClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value);
        setStudents([])
        setFilteredStudents([])
        // Reset section state
        setSelectedSection('');
        setSelectedSectionid('');
        setSections([]); // Clear the sections dropdown

    

            const getSelectedObj = classes.find(cls => cls.name === value)
            if (getSelectedObj) {
                handleGetSections(getSelectedObj.id)
                setSelectedClassid(getSelectedObj.id)
            }
        
    };

    const handleSectionsChange = async (e) => {
        const value = e.target.value;
        setSelectedSection(value);
        setStudents([])
        setFilteredStudents([])
setShowNoStudentsMessage(false)
const getSelectedObj = sections.find(sec => sec.name === value);
if (getSelectedObj) {
    setSelectedSectionid(getSelectedObj.id)

        }
        
    }
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCheckboxChange = (studentId) => {
        setSelectedStudentIds(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };
    let totalSelectedStudents = selectedStudentIds.length;
   

    return (
        <> {authenticated &&(
        <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="relative">
                <Box>
                    <Typography variant="h4" component="h2" gutterBottom className="whitespace-nowrap mb-6">
                        Promote Students
              
                    </Typography>

                                <Typography variant="h6" color="initial" className='flex justify-center'>
                Promoting From
            </Typography>
                    
                    
                    <div className='flex w-full'>
                        <Typography variant="h6" color="initial">
                            {selectedClass && !selectedSection ? ` Students in ${selectedClass}: ${totalDeptStudents}` : ''}
                        </Typography>
                        <Typography variant="span"  color="initial">
                            {selectedSection ? `Total students in ${selectedSection}: ${studentInSec}` : ''}

                        </Typography>
                    </div>
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

            <div className='sticky top-36 items-center'>
              
                <FormControl fullWidth variant="outlined" className="max-w-xs" style={{ marginTop: '-55px' }}>
                    <InputLabel htmlFor="class_select">Select Class</InputLabel>
                    <Select
                        id="class_select"
                        value={selectedClass}
                        onChange={handleClassChange}
                        label="Select Class"
                        className='w-36'
                    >

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
                                value={selectedSection}
                                onChange={handleSectionsChange}
                                label="select section"
                                className='w-36'
                            >
                            
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
            {loading ? (
                <div className="flex justify-center items-center min-h-[444px]">
                    <CircularProgress />
                </div>
            ) : (
                <div>

                        {selectedClass && selectedSection && filteredStudents.length >0 &&

                    <FormControlLabel
                    control={
                        <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                        />
                    }
                    
                                label={`Select All (${totalSelectedStudents}/${totalDeptStudents} selected)`}
                    
                    />
                }   

                    <Grid container spacing={2}>

                                  
                            {showNoStudentsMessage &&  (

                    <Typography variant="body1" className='h-[300px] justify-center flex items-center' color="textSecondary">
                    No students found for the selected criteria.
                    </Typography>
                ) 
                }
                            <Grid container style={{ margin: 0, padding: '10px' }}  spacing={2}>

                        {filteredStudents.map(student => (
                            <Grid  item xs={12} sm={6} md={4} key={student.id} >
                                <Card className="shadow-lg" style={{minWidth:250}}>
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
            </Grid>
                </div>
            )}
            
            {filteredStudents.length > 0 && !loading && (
                <>
            <Typography variant="h6" color="initial" className='flex justify-center'>
                Promoting To
            </Typography>
            <Classes
                selectedClass={selectedClassid}
                selectedSection={selectedSectionid}
                studentIds={selectedStudentIds} 
                selectedSectionName={selectedSection}
                        totalSelectedStudents={totalSelectedStudents}
                        setFilteredStudents={setFilteredStudents}
                        handleSelectAllChange={handleSelectAllChange}
                />
                </>
            )}
        </div>
                                
                                        )        
                                        }
                                        </>
    );
};

export default ClassSelector;
