import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, InputLabel, Typography, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegisterTeacher = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [classes, setClasses] = useState([]);
    const [sectionId, setSectionId] = useState('');
    const [sectionsOfClsId, setSectionsOfClsId] = useState([]);
    const [classId, setClassId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]=useState(false)

    const handleTogglePassword = () => {
        setShowPassword(!showPassword); // Toggle the state
    };
    const role = 'teacher';


    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/classes');
                setClasses(response.data);
             
            } catch (err) {
                setError('Failed to fetch classes');
                console.error("Error fetching classes:", err);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchSectionsOfClassID = async () => {
            if (classId) {
                try {
                    const response = await axios.post('https://ghss-management-backend.vercel.app/get-sections', { class_id: classId });
                    setSectionsOfClsId(response.data);
                } catch (err) {
                    setError('Failed to fetch sections');
                    console.error("Error fetching sections:", err);
                }
            }
        };

        fetchSectionsOfClassID();
    }, [classId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true)

        try {
            const response = await axios.post('https://ghss-management-backend.vercel.app/register-teacher', {
                username,
                password,
                class_id: classId,
                section_id: sectionId,
                role,
            }, { withCredentials: true });

            setMessage(response.data.message);
        } catch (err) {
            setMessage('Error registering teacher');
        }
finally {
        setLoading(false); // Ensure loading is stopped after the request finishes
    }
    };

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (

            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    gap: 2,
                    maxWidth: 400,
                    margin: '0 auto',
                    padding: 3,
                    backgroundColor: 'white',
                    boxShadow: 3,
                    borderRadius: 2
                }}
                onSubmit={handleSubmit}
            >
                <Typography variant="h4" sx={{ mb: 2 }}>Register Teacher</Typography>

                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    type={showPassword ? "text" : "password"} // Switch between text and password

                    label="Password"
                    autoComplete="current-password"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePassword}
                                    edge="end"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="class-label">Select Class</InputLabel>
                    <Select
                        labelId="class-label"
                        value={classId}
                        onChange={(e) => {setSectionId('') ,setClassId(e.target.value)}}
                        label="Select Class"
                    >
                        {classes.map((classItem) => (
                            <MenuItem value={classItem.id} key={classItem.id}>
                                {classItem.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="section-label">Select Section</InputLabel>
                    <Select
                        labelId="section-label"
                        value={sectionId}
                        onChange={(e) => {setSectionId(e.target.value)}}
                        label="Select Section"
                    >
                        {sectionsOfClsId.map((sectionItem) => (
                            <MenuItem value={sectionItem.id} key={sectionItem.id}>
                                {sectionItem.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {message && (
                    <Typography color="primary" variant="body2" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}

                <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2 }}>
                    {loading?<CircularProgress size={24}/>:' Register'}       
                </Button>

                <Button
                    component={Link}
                    to="/admin/TeacherRegistration/AdminRegistration"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    
                >
                        Register Admin        
                </Button>
            </Box>
        
    );
};

export default RegisterTeacher;
