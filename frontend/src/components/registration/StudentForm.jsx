import { useState } from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import StudentRegistrationForm from './StudentRegistrationForm';
import StudentBulkUpload from './StudentBulkUpload';

function StudentForm() {
    const [formType, setFormType] = useState(null);

    const handleFormSelection = (form) => {
        setFormType(form);
    };

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Grid container spacing={3} sx={{ maxWidth: 600, width: '100%' }}>
                <Grid item xs={12} textAlign="center">
                    {formType==null &&(<Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                        How do you want to add Students?
                    </Typography>)}
                </Grid>
                <Grid item xs={12} textAlign="center">
                    <Button
                        // variant="contained"
                        sx={{
                            px: 4,

                            mb: {
                                xs: '21px',  // Extra-small screens (default breakpoint is 0px - 600px)
                                sm: '21px',  // Small screens (600px - 960px)
                                md: '0px',  // Medium screens (960px - 1280px)
                                lg: '0px',   // Large screens (1280px - 1920px)
                                xl: '0px',   // Extra-large screens (1920px and above)
                            },                            px: 2, 
                            py: 1.26, 
                            fontFamily: "'Poppins', sans-serif" ,
                            // fontWeight:'bold',// Padding Left & Right (16px)
                         // Padding Top & Bottom (12px)
                            m: "0 20px", // Margin Left & Right
                            textTransform: "capitalize", // Capitalize first letter
                            borderRadius: "10px", // Rounded corners
                            color: '#3F51B5',
                            fontSize: '1rem',// Text color
                            backgroundColor: formType === 'manual' ?"#f0f0f0":"white", 
                            border: formType === 'manual' ?'2px solid #3F51B5':'2px solid #f0f0f0', // Border color
                            boxShadow: formType === 'manual' ?'0px 0px 4px 2px #D6D6E': "0px 4px 8px rgba(45, 35, 66, 0.4)", // Shadow effect
                            transition: "all 0.15s ease-in-out", // Smooth transition
                            "&:hover": {
                                backgroundColor: "#f0f0f0", // Light gray on hover
                                boxShadow: "0px 6px 12px rgba(45, 35, 66, 0.3)",
                                transform: "translateY(-2px)", // Lift effect
                            },
                           
                            "&:active": {
                                boxShadow: "inset 0px 3px 7px #D6D6E7",
                                transform: "translateY(2px)", // Pressed effect
                            },
                        }}
                        onClick={() => handleFormSelection("manual")}
                    >
                        Manual Registration
                    </Button>
                    <Button
                        // variant="contained"
                        // color="secondary"
                        sx={{
                            px: 4, // Padding Left & Right (16px)
                            py: 1.26, // Padding Top & Bottom (12px)
                            borderRadius: "8px", 
                            color:'#3F51B5',
                            fontSize: '1rem',
                            textTransform: "capitalize", // First letter capitalized
                            backgroundColor: formType === 'bulk' ? "#f0f0f0" : "white",
                            border: formType === 'bulk' ? '2px solid #3F51B5' : '2px solid #f0f0f0', // Border color
                            boxShadow: formType === 'bulk' ? '0px 0px 4px 2px #D6D6E' : "0px 4px 8px rgba(45, 35, 66, 0.4)", // Shadow effect
                            transition: "all 0.15s ease-in-out", // Smooth transition
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)", // Slightly lighter on hover
                                boxShadow: "0px 6px 12px rgba(45, 35, 66, 0.3)",
                                transform: "translateY(-2px)", // Lift effect
                            },
                            
                            "&:active": {
                                boxShadow: "inset 0px 3px 7px #D6D6E7",
                                transform: "translateY(2px)", // Pressed effect
                            },
                        }}
                        onClick={() => handleFormSelection("bulk")}
                    >
                        Bulk Upload
                    </Button>

                </Grid>
                <Grid item xs={12} sx={{
                    mt: {
                        xs: '-111px',  // Extra-small screens (default breakpoint is 0px - 600px)
                        sm: '-138px',  // Small screens (600px - 960px)
                        md: '-180px',  // Medium screens (960px - 1280px)
                        lg: '-180px',   // Large screens (1280px - 1920px)
                        xl: '-180px',   // Extra-large screens (1920px and above)
                    }
}}>
                    {formType === 'manual' && <StudentRegistrationForm />}
                    {formType === 'bulk' && <StudentBulkUpload />}
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentForm;
