import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import HamburgerMenu from './managementMobile'

const Navbar = () => {
    const [open, setOpen] = useState(false);

    // Menu items
    const menuItems = [
        { text: "Home", path: "/" },
        { text: "Promote Students", path: "/promote" },
        { text: "Students List", path: "/studentlist" },
        { text: "Student Form", path: "/contact" },
    ];

    // Toggle mobile drawer
    const toggleDrawer = () => setOpen(!open);

    return (
        <AppBar position="static hideOnLargerScreen" className="bg-blue-900">
            <Toolbar className="flex justify-between">

                {/* Hamburger Menu for Mobile View */}
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>
                {/* School Name */}
                <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                    GHSS Luqman Banda
                </Typography>
            </Toolbar>

            {/* Mobile Drawer Navigation */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                <div className="w-64 h-full bg-blue-900 p-4">
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem button key={index} component={Link} to={item.path} onClick={toggleDrawer}>
                                <ListItemText primary={item.text} className="text-white text-lg font-semibold" />
                            </ListItem>
                        ))}
                    </List>
                        <HamburgerMenu />
                </div>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
