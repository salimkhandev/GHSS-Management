import * as React from "react";
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
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function TopDrawerWithToggle() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (state) => (event) => {
        if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setOpen(state);
    };

    // Menu Sections with Links
    const menuItems = [
        {
            title: "Teachers Portal",
            links: [
                { label: "Take Attendance", path: "/TakeAtten" },
                { label: "Login for your class", path: "/TeacherLogin" },
                { label: "Update Attendance Status", path: "/updateAttenStatus" },
            ],
        },
        {
            title: "Admin Portal",
            links: [
                { label: "Login As Admin", path: "/admin" },
                { label: "Assign Class", path: "/admin/TeacherRegistration" },
                { label: "Register New Admin", path: "/admin/TeacherRegistration/AdminRegistration" },
                { label: "Promote Students to Next Class", path: "/promote" },
                { label: "Register New Students", path: "/contact" },
    
            ],
        },
    ];

    const list = () => (
        <Box
            sx={{

                width: 250,
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
            {/* Close Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "50%",
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            backgroundColor: '#3e3e3e',
                            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                        },
                    }}
                >
                    <CloseIcon
                        sx={{
                            fontSize: 30,
                            color: '#f1f1f1',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.2)',
                                color: '#ff6347', // Classic red on hover
                            },
                            padding: '5px',
                        }}
                    />
                </IconButton>
            </Box>

            {/* Menu Sections */}
            {menuItems.map((section, index) => (
                <React.Fragment key={index}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{
                                                backgroundColor: "#2B4A91", // Background color for title
                                                color: "white",
                                                padding: "8px 26px", // Padding around the title
                                                borderRadius: "4px", // Rounded corners for title
                                                marginBottom: "1px", // Space below the title
                                            }}
                                        >
                                            {section.title}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                        {section.links.map((item, idx) => (
                            <ListItem key={idx} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={toggleDrawer(false)} // Close the drawer on click
                                    sx={{
                                        fontFamily: "Poppins",
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                        '&:hover': { backgroundColor: '#800080' },
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
