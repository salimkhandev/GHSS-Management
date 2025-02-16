import * as React from "react";
import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { SnackbarProvider, useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import {
    Box,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    Collapse,
    CircularProgress
} from "@mui/material";
import { useAuth } from './admin/AuthProvider';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProfilePicManager from './teacher/ProfilePic.jsx'


export default function TopDrawerWithToggle() {
    const navigate = useNavigate();
    
    // const [RoleOpen, setRoleOpen] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // const toggleRoleDrawer = (state) => (event) => {
    //     if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    //     setRoleOpen(state);
    // };


    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        setShowRoleModal(false); // Close modal after selection
    };



    const [open, setOpen] = useState(false);
    const [expandedSections, setExpandedSections] = React.useState({});
    const { isAuthenticated, isAuthenticatedTeacher, logEvent } = useAuth();
    // const [keepProfilePicUpdated, setKeepProfilePicUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (selectedRole === "admin") {
            navigate('/admin');
            // close the modal
            setShowRoleModal(false);
            // close the drawer
            setOpen(false);
            // reset the selected role
            setSelectedRole(null);
            // close the role modal
        } else if (selectedRole === "teacher") {
            navigate('/teacherLogin');
            // close the modal
            setShowRoleModal(false);
            // close the drawer
            setOpen(false);
            // reset the selected role
            setSelectedRole(null);
        }
        else if (selectedRole === "teacherAdmin") {
            navigate('/teacherAdminLogin');
            // close the modal
            setShowRoleModal(false);
            // close the drawer
            setOpen(false);
            // reset the selected role
            setSelectedRole(null);
        }
    }, [selectedRole, navigate]);

    useEffect(() => {
        const fetchProfilePic = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://ghss-management-backend.vercel.app/profile-pic", { withCredentials: true });

                if (response.data.imageUrl) {
                    setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
                }
                setUsername(response.data.teacherName);
            } catch (error) {
                //   enqueueSnackbar("Failed to fetch profile picture.", { variant: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchProfilePic();
    }, [logEvent]);

    const toggleDrawer = (state) => (event) => {
        if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setOpen(state);
    };

    const toggleSection = (index) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
// use fetch to logout

    const handleLogout = async () => {
        try {
            await fetch("https://ghss-management-backend.vercel.app/logout", {
                method: "POST",
                credentials: "include", // Ensures cookies are sent
            });

            navigate("/"); // Redirect to home
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Menu Sections with Links
    const menuItems = [
        {
            title: "Teachers Portal",
            links: [
                { label: "Take Attendance", path: "/TakeAtten" },
                // { label: "Login for your class", path: "/TeacherLogin" },
                { label: "Update Attendance Status", path: "/updateAttenStatus" },
            ],
        },
        {
            title: "Admin Portal",
            links: [
                { label: "Assign Class", path: "/admin/TeacherRegistration" },
                { label: "Register New Admin", path: "/admin/TeacherRegistration/AdminRegistration" },
                { label: "Promote Students to Next Class", path: "/promote" },
                { label: "Register New Students", path: "/admission" },
            ],
        },
    ];


    const list = () => (

        <Box
            sx={{
                width: 280,
                height: "100%",
                backgroundColor: "#1E3A8A", // Deep Blue Background
                color: "white", // White Text
                display: "flex",
                flexDirection: "column",
                boxShadow: "4px 0 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                borderRight: "3px solid #fff", // Elegant border
                overflowY: "auto", // Make the drawer scrollable
            }}
            role="presentation"
        >
           {(isAuthenticated || isAuthenticatedTeacher) && (
                <Button
                    sx={{
                        color: "white",
                        backgroundColor: "#DC2626", 
                        // Tailwind `red-600`
                        textAlign: "left",
                        fontSize: "0.875rem", // Equivalent to Tailwind `text-sm`
                        textTransform: "capitalize",
                        margin: "10px 6px",    
                        width: "30%",
                        padding: "3px 20px",
                        borderRadius: "20px",
                        
                        "&:hover": {
                            backgroundColor: "#B91C1C", // Tailwind `red-700`
                        },
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>           )}
           
            {
                (isAuthenticated || isAuthenticatedTeacher) ? (<div className="text-center">
                    <div onClick={() => setShowModal(true)} className="mb-2 cursor-pointer">
                          
                        <div className="w-20 h-20 rounded-full mx-auto border-blue-500 border-4 flex justify-center items-center overflow-hidden bg-gray-200">

                            {loading ? (
                                <CircularProgress sx={{ color: "green", width: "80%", height: "80%" }} />

                            ) : imageUrl ? (
                                // for logo a btn
                                // add a wraper
                             
                                <img key={imageUrl} src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                              
                            ) : (
                                // for default profile picture
                                <img src="/images/defaultPicPerson.svg" alt="Profile" className="w-full h-full object-cover" />


                            )}
                        </div>
                        <h3 className="text-lg font-bold text-white mt-2">{username}</h3>
                    </div>
                    
                </div>) :
                    <div>
                        {/* <Drawer anchor="left" open={RoleOpen} onClose={toggleRoleDrawer(false)}> */}
                            <Box sx={{ width: 280, backgroundColor: "#1E3A8A", color: "white", height: "100%" }}>
                                <Button
                                onClick={() => setShowRoleModal(true)}


                                sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    margin: "10px auto",
                                    padding: "3px 20px",
                                    borderRadius: "20px",
                                    display: "flex",    
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textTransform: "capitalize",
                                    border: "2px solid white",
                                    background: "linear-gradient(to bottom, #4d4dff, #1A8CFF)",
                                    "&:hover": { background: "linear-gradient(to bottom, #4d4dff, #4d4dff)" },
                                }}
                            >
                                Login
                            </Button>
                </Box>
            {/* </Drawer> */}

     
                        <Dialog
                            open={showRoleModal}
                            onClose={() => setShowRoleModal(false)}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    border: "1px solid #ddd",
                                    boxShadow: 5,
                                    // background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                                    backgroundColor: "#ffffcc",
                                    padding: 2,
                                    width: 450
                                }
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: 12,color: "#333" }}>
                                🔑 For Admin: <span style={{ color: "#d9534f" }}>Username: admin | Password: admin</span>
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: 12,color: "#333" }}>
                                📚 For Teacher: <span style={{ color: "#5cb85c" }}>Username: Kamal | Password: Kamal</span>
                            </Typography>
                            <DialogTitle
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontFamily: "serif",
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    
                                }}
                            >
                                Login as:
                                <IconButton onClick={() => setShowRoleModal(false)} sx={{ color: "#555" }}>
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
                                <Button
                                    onClick={() => handleRoleSelection("admin")}
                                    sx={{
                                        backgroundColor: " #ff9999",
                                        color: "white",
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#ff6666" }
                                    }}
                                >
                                    Admin
                                </Button>
                                <Button
                                    onClick={() => handleRoleSelection("teacher")}
                                    sx={{
                                        backgroundColor: "#28A745",
                                        color: "white",
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#218838" }
                                    }}
                                >
                                    Teacher
                                </Button>
                                <Button
                                    onClick={() => handleRoleSelection("teacherAdmin")}
                                    sx={{
                                        backgroundColor: "#28A745",
                                        color: "white",
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#218838" }
                                    }}
                                >
                                    Teacher & Admin
                                </Button>   
                                
                            </DialogActions>
                        </Dialog>

            </div>
            }
            {/* Profile Picture */}
            <Box className="flex flex-col items-center justify-center">
                {/* <Avatar
                    // src="/images/profilePic.jpg" // Change this to dynamic user image
                    alt="User Profile"
                    sx={{ width: 50, height: 50, border: "2px solid white", mr: 2 }}
                /> */}
                < ProfilePicManager showModal={showModal} setShowModal={setShowModal} imageUrl={imageUrl} setImageUrl={setImageUrl} onImageUpdate={setImageUrl} />



            </Box>

            <Divider sx={{ backgroundColor: "white" }} />

            {/* Close Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "50%",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            backgroundColor: "#3e3e3e",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                        },
                    }}
                >
                    <CloseIcon
                        sx={{
                            fontSize: 30,
                            color: "#f1f1f1",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.2)",
                                color: "#ff6347", // Classic red on hover
                            },
                            padding: "5px",
                        }}
                    />
                </IconButton>
            </Box>

            {/* Menu Sections */}

            {menuItems.map((section, index) => (
                <React.Fragment key={index}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => toggleSection(index)}
                                sx={{
                                    backgroundColor: expandedSections[index] ? "#4990CF" : "#2B4A91", // Only applies when expanded
                                    borderRadius: "6px", // Ensures border radius applies
                                    padding: "8px 26px", // Matches Tailwind padding
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    "&:hover": { backgroundColor: "#4990CF" }, // MUI hover override
                                }}
                            >
                                {section.title === 'Teachers Portal' ? (
                                    <img
                                        src="/images/teacherIcon.png"
                                        alt="Teacher Icon"
                                        className="w-14 mr-2 h-12"
                                    />
                                ) : <img
                                    src="/images/adminIcon.png"
                                    alt="Admin Icon"
                                    className="w-13 mr-1 h-12"
                                />}

                                <ListItemText primary={section.title} primaryTypographyProps={{
                                    sx: { fontFamily: "Inter, sans-serif", fontWeight: "bold" },
                                    className: "m-0",
                                }} />
                                {expandedSections[index] ? (
                                    <ExpandLessIcon className="text-lg ml-2" />
                                ) : (
                                    <ExpandMoreIcon className="text-lg ml-2" />
                                )}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={expandedSections[index]} timeout="auto" unmountOnExit>
                            {section.links.map((item, idx) => (
                                <ListItem key={idx} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        onClick={toggleDrawer(false)}
                                        sx={{
                                            fontFamily: "Poppins",
                                            paddingLeft: 3,

                                            borderRadius: "0 25px 25px 0",


                                            marginBottom: "5px",
                                            backgroundColor: "#1E40AF",
                                            paddingRight: 2,
                                            "&:hover": { backgroundColor: "#800080" },
                                        }}
                                    >
                                        <ListItemText

                                            primary={
                                                <Typography
                                                    variant="body1"

                                                    component="span"
                                                    sx={{ fontFamily: "Poppins", fontWeight: "normal", color: "white" }}
                                                >
                                                    {item.label}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>

                            ))}
                        </Collapse>

                    </List>
                    {index !== menuItems.length - 1 && <Divider sx={{ backgroundColor: "white" }} />}
                </React.Fragment>
            ))}
        </Box>
    );

    return (
        <div>
            {/* Button to Open Drawer */}
            <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                {list()}

            </Drawer>
        </div>
    );
}