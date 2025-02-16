import * as React from "react";
import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { SnackbarProvider, useSnackbar } from "notistack";
import {
    AdminPanelSettings as AdminIcon,
    Key as KeyIcon,
    ExitToApp as LogoutIcon,
    School as SchoolIcon,
    SupervisorAccount as TeacherAdminIcon
} from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from './admin/AuthProvider';
import ProfilePicManager from './teacher/ProfilePic.jsx';

const THEME_COLORS = {
    primary: '#1a237e', // Deep indigo
    secondary: '#303f9f',
    accent: '#3949ab',
    hover: '#283593',
    text: '#ffffff',
    danger: '#d32f2f'
};

// Add these modal styles
const modalStyles = {
    dialog: {
        '& .MuiDialog-paper': {
            borderRadius: 3,
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
            padding: { xs: 2, sm: 3 },
            width: { xs: '95%', sm: '80%', md: '70%' },
            maxWidth: '800px',
            minWidth: { sm: '400px' },
            overflow: 'hidden',
            animation: 'modalFadeIn 0.3s ease-out'
        },
        '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)'
        }
    },
    credentialsBox: {
        backgroundColor: 'rgba(255, 248, 220, 0.9)',
        borderRadius: 2,
        padding: { xs: 1.5, sm: 2 },
        margin: { xs: 1, sm: 2 },
        border: '1px solid #ffe4b5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        animation: 'slideDown 0.3s ease-out'
    },
    title: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: 1, sm: 2 },
        borderBottom: '2px solid #f0f0f0',
        marginBottom: 2
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 2 },
        padding: { xs: 2, sm: 3 },
        justifyContent: 'center',
        width: '100%'
    },
    button: (color) => ({
        minWidth: { xs: '100%', sm: '180px' },
        padding: '12px 24px',
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        '& .MuiSvgIcon-root': {
            fontSize: '24px',
            transition: 'transform 0.3s ease'
        },
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backgroundColor: `${color}dd`, // Adding transparency to hover color
            '& .MuiSvgIcon-root': {
                transform: 'scale(1.1) rotate(10deg)'
            }
        }
    })
};

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
                backgroundColor: THEME_COLORS.primary,
                color: THEME_COLORS.text,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                borderRight: "none",
                overflowY: "auto",
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                }
            }}
            role="presentation"
        >
            {(isAuthenticated || isAuthenticatedTeacher) && (
                <Button
                    startIcon={<LogoutIcon />}
                    sx={{
                        color: THEME_COLORS.text,
                        backgroundColor: THEME_COLORS.danger,
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontFamily: "'Poppins', sans-serif",
                        textTransform: "none",
                        margin: "16px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            backgroundColor: "#b71c1c",
                            transform: "translateY(-1px)",
                        },
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>)}

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
                            sx={modalStyles.dialog}
                        >
                            <Box sx={modalStyles.credentialsBox}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <KeyIcon sx={{ color: '#ffa000', fontSize: 24 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#555' }}>
                                        Demo Credentials
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AdminIcon sx={{ color: '#d9534f', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Admin: <span style={{ color: '#d9534f', fontWeight: 500 }}>Username: admin | Password: admin</span>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SchoolIcon sx={{ color: '#5cb85c', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Teacher: <span style={{ color: '#5cb85c', fontWeight: 500 }}>Username: Kamal | Password: Kamal</span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={modalStyles.title}>
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 700,
                                    fontFamily: "'Poppins', sans-serif",
                                    color: '#2c3e50'
                                }}>
                                    Select Role
                                </Typography>
                                <IconButton 
                                    onClick={() => setShowRoleModal(false)}
                                    sx={{ 
                                        color: '#555',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'rotate(90deg)',
                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Box sx={modalStyles.buttonsContainer}>
                                <Button
                                    onClick={() => handleRoleSelection("admin")}
                                    startIcon={<AdminIcon />}
                                    sx={modalStyles.button('#ff6b6b')}
                                >
                                    Admin
                                </Button>
                                <Button
                                    onClick={() => handleRoleSelection("teacher")}
                                    startIcon={<SchoolIcon />}
                                    sx={modalStyles.button('#4CAF50')}
                                >
                                    Teacher
                                </Button>
                                <Button
                                    onClick={() => handleRoleSelection("teacherAdmin")}
                                    startIcon={<TeacherAdminIcon />}
                                    sx={modalStyles.button('#2196F3')}
                                >
                                    Teacher & Admin
                                </Button>
                            </Box>

                            <style jsx global>{`
                                @keyframes modalFadeIn {
                                    from { opacity: 0; transform: scale(0.95); }
                                    to { opacity: 1; transform: scale(1); }
                                }
                                @keyframes slideDown {
                                    from { opacity: 0; transform: translateY(-10px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                            `}</style>
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
                                    backgroundColor: expandedSections[index] ? THEME_COLORS.accent : THEME_COLORS.secondary,
                                    margin: "4px 8px",
                                    borderRadius: "8px",
                                    padding: "12px 16px",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: THEME_COLORS.hover,
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                {section.title === 'Teachers Portal' ? (
                                    <SchoolIcon sx={{ mr: 2, fontSize: 24 }} />
                                ) : (
                                    <AdminIcon sx={{ mr: 2, fontSize: 24 }} />
                                )}

                                <ListItemText
                                    primary={section.title}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontFamily: "'Poppins', sans-serif",
                                            fontWeight: 600,
                                            fontSize: "1rem"
                                        },
                                    }}
                                />
                                {expandedSections[index] ? (
                                    <ExpandLessIcon />
                                ) : (
                                    <ExpandMoreIcon />
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
                                            fontFamily: "'Poppins', sans-serif",
                                            padding: "8px 16px",
                                            marginLeft: "24px",
                                            marginRight: "8px",
                                            marginY: "2px",
                                            borderRadius: "8px",
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                transform: "translateX(4px)",
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: "'Poppins', sans-serif",
                                                        fontWeight: 400,
                                                        color: THEME_COLORS.text,
                                                        fontSize: "0.875rem"
                                                    }}
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
                    {index !== menuItems.length - 1 && (
                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: "8px 16px" }} />
                    )}
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