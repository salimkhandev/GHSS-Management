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
    Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function TopDrawerWithToggle() {
    const [open, setOpen] = React.useState(false);
    const [expandedSections, setExpandedSections] = React.useState({});

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
                            <ListItemButton onClick={() => toggleSection(index)}>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{
                                                backgroundColor: "#2B4A91",
                                                color: "white",
                                                padding: "8px 26px",
                                                borderRadius: "4px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                            }}
                                        >
                                            {section.title}
                                            {expandedSections[index] ? (
                                                <ExpandLessIcon sx={{ fontSize: 22, marginLeft: 1 }} />
                                            ) : (
                                                <ExpandMoreIcon sx={{ fontSize: 22, marginLeft: 1 }} />
                                            )}
                                        </Typography>
                                    }
                                />
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
                                                    sx={{ fontFamily: "Poppins",fontWeight: "normal", color: "white" }}
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
