import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import { Height } from "@mui/icons-material";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    // Menu items
    // const menuItems = [
    //     { text: "Home", path: "/" },
    //     { text: "Promote Students", path: "/promote" },
    //     { text: "Students List", path: "/studentlist" },
    //     { text: "Student Form", path: "/contact" },
        
    // ];
    const menuItems = [
        { text: " Take Attendance", path: "//TakeAtten" },
        { text: " Show Attendance Status", path: "/ShowAttenStatus" },
        { text: "Login for your Class", path: "/TeacherLogin" },
        { text: " Register Teacher", path: "/admin/TeacherRegistration" },

    ];
    // Toggle mobile drawer
    const toggleDrawer = () => setOpen(!open);

    return (
        <AppBar position="static" className="bg-blue-900">
            <Toolbar className="flex justify-between">
                {/* Hamburger Menu for Mobile View */}
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>

                {/* School Name */}
                <Typography variant="h6" sx={{ fontWeight: "bold",whiteSpace:'nowrap', textTransform: "capitalize" }}>
                    Teachers Section
                </Typography>
            </Toolbar>

            {/* Mobile Drawer Navigation */}
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                sx={{
                    width: 240,  // Width of the drawer
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 240,
                        marginTop: 35, // Adjust this value to move the drawer inward
                        marginLeft: 2, // Adjust this value to move the drawer inward
                        height: 309, // Adjust this value to move the drawer inward
                        backgroundColor: "#1E3A8A"  // Optional: Keep the background color the same
                    }
                }}
            >
                <div className="h-full p-4">
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem button key={index} component={Link} to={item.path} onClick={toggleDrawer}>
                                <ListItemText primary={item.text} className="text-white text-lg font-semibold" />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
