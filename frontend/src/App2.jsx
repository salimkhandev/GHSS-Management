import React, { useState } from "react";
import { Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Import Material-UI Menu icon

const HamburgerMenu = () => {
    const [open, setOpen] = useState(false);

    // Toggle the menu open/close
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Menu items
    const menuItems = ["Home", "About", "Services", "Contact"];

    return (
        <div>
            {/* Hamburger Icon Button for Mobile View */}
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                className="md:hidden text-white" // Make icon white
            >
                <MenuIcon /> {/* Use Material-UI's Menu Icon for the hamburger menu */}
            </IconButton>

            {/* Drawer for Mobile Menu */}
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                className="md:hidden" // Hide in desktop view (Tailwind)
                sx={{
                    "& .MuiDrawer-paper": {
                        backgroundColor: "#1E3A8A", // Dark blue background color (previous color)
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                        transition: "transform 0.3s ease", // Smooth transition for opening
                    },
                }}
            >
                <div className="w-64 h-full p-4">
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={toggleDrawer}
                                className="hover:bg-gray-700 transition-all duration-200" // Hover effect
                            >
                                <ListItemText
                                    primary={item}
                                    className="font-semibold text-white text-lg" // Modern font style and text color
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <div class="hidden md:flex">
                This content is visible on mobile (smaller than `md`) and hidden on medium and larger screens.
            </div>

            <div className="hidden md:flex space-x-8 items-center">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="text-white text-lg font-semibold hover:text-blue-400 transition-all duration-200"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HamburgerMenu;
