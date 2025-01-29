import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Classes from './setClassIdSectionId';

const ClassSelector = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [selectedClassid, setSelectedClassid] = useState();
    const [selectedSectionid, setSelectedSectionid] = useState();
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [allIds, setAllIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('https://ghss-management-backend.vercel.app/verify-token-asAdmin', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.authenticated) {
                    setAuthenticated(true);
                } else {
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                navigate('/admin');
            }
        };
        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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
        if (selectedClassid && selectedSectionid) {
            const fetchStudents = async () => {
                setLoading(true);
                try {
                    const response = await axios.get('https://ghss-management-backend.vercel.app/filteredSectionStd', {
                        params: { class_id: selectedClassid, section_id: selectedSectionid }
                    });
                    setStudents(response.data.students);
                    setAllIds(response.data.allIds);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching students:', error);
                    setLoading(false);
                }
            };
            fetchStudents();
        }
    }, [selectedClassid, selectedSectionid]);

    if (!authenticated) {
        return <CircularProgress />;
    }

    return (
        <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
            <Box>
                <Typography variant="h4" gutterBottom>Promote Students</Typography>
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
                    style={{ marginBottom: '10px' }}
                />
            </Box>

            <FormControl fullWidth variant="outlined" className="max-w-xs">
                <InputLabel>Select Class</InputLabel>
                <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    {classes.map(cls => (
                        <MenuItem key={cls.id} value={cls.name}>{cls.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {filteredStudents.map(student => (
                        <Grid item xs={12} sm={6} md={4} key={student.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">ID: {student.id}</Typography>
                                    <Typography variant="body1">Name: {student.student_name}</Typography>
                                    <Typography variant="body1">Section: {student.section_name}</Typography>
                                    <FormControlLabel
                                        control={<Checkbox checked={selectedStudentIds.includes(student.id)} onChange={() => setSelectedStudentIds([...selectedStudentIds, student.id])} />}
                                        label="Select"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default ClassSelector;
