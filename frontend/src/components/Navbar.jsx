import {
    AdminPanelSettings as AdminIcon,
    MenuBook as AttendanceIcon,
    Home as HomeIcon,
    People as StudentsIcon,
    School as TeachersIcon
} from '@mui/icons-material';
import {
    AppBar,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from "./HamburgerMenu";
import logo from "/images/ghssLogo.png";

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'Attendance Detail', path: '/PerformanceDashboard', icon: <AttendanceIcon /> },
        { label: 'Overall Enrolled Students', path: '/studentlist', icon: <StudentsIcon /> },
        { label: 'Teachers List', path: '/TeachersList', icon: <TeachersIcon /> }
    ];

    return (
        <div className='flex  justify-start mb-16'>
            <AppBar
                sx={{
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    position: '!sticky',
                    top: 0,  // Sticks to the top of the viewport
                    zIndex: 50,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1e3c72 10%, #2a5298 90%)',
                    }
                }}
            
            >
           


                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: { xs: '0.5rem 1rem', md: '0.5rem 2rem' }
                }}>
                    {<HamburgerMenu />}
                    
                    <div
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem'
                    }}>
                        <img
                            src={logo}
                            alt="School Logo"
                            style={{
                                height: '48px',
                                width: '48px',
                                objectFit: 'contain',
                                transition: 'transform 0.3s ease',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                '&:hover': {
                                    transform: 'scale(1.1)'
                                }
                            }}
                        />
                        <Typography 
                            variant={isMobile ? "h6" : "h5"}
                            sx={{ 
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                                marginLeft: '0.5rem'
                            }}
                        >
                            GHSS Luqman Banda
                        </Typography>
                    </div>

                    {isMobile ? (
                        <>
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{ 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                <AdminIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        backgroundColor: '#fff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        mt: 1
                                    }
                                }}
                            >
                                {navItems.map((item) => (
                                    <MenuItem 
                                        key={item.path}
                                        onClick={handleMenuClose}
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1.5rem',
                                            fontFamily: "'Poppins', sans-serif",
                                            color: '#333',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.04)'
                                            }
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    startIcon={item.icon}
                                    sx={{
                                        color: 'white',
                                        textTransform: 'none',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontWeight: 500,
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
