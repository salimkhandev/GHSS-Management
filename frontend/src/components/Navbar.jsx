import {
    Menu as MenuIcon,
    MenuBook as AttendanceIcon,
    Home as HomeIcon,
    People as StudentsIcon,
    School as TeachersIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    Divider
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from "./HamburgerMenu";
import logo from "/images/ghssLogo.png";

const Navbar = () => {
    const isMobile = useMediaQuery('(max-width:1136px)');
    const isVerySmall = useMediaQuery('(max-width:438px)');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'Attendance Detail', path: '/PerformanceDashboard', icon: <AttendanceIcon /> },
        { label: 'Overall Enrolled Students', path: '/studentlist', icon: <StudentsIcon /> },
        { label: 'Teachers List', path: '/TeachersList', icon: <TeachersIcon /> }
    ];

    return (
        <div className='flex justify-start mb-16'>
            <AppBar
                sx={{
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    position: '!sticky',
                    top: 0,
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
                    <HamburgerMenu />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="School Logo"
                            sx={{
                                display: { xs: isVerySmall ? 'none' : 'block', sm: 'block' },
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
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton
                                onClick={handleDrawerOpen}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Drawer
                                anchor="right"
                                open={drawerOpen}
                                onClose={handleDrawerClose}
                                sx={{
                                    '& .MuiDrawer-paper': {
                                        width: { xs: '280px', sm: '320px' },
                                        background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 50%, #3d5fa8 100%)',
                                        color: 'white',
                                        boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                                    }
                                }}
                            >
                                {/* Drawer Header */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.5rem 1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderBottom: '2px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Box
                                            component="img"
                                            src={logo}
                                            alt="School Logo"
                                            sx={{
                                                height: '40px',
                                                width: '40px',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: "'Playfair Display', serif",
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            Navigation
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={handleDrawerClose}
                                        sx={{
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                transform: 'rotate(90deg)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                                {/* Navigation Items */}
                                <List sx={{ padding: '1rem 0', flex: 1 }}>
                                    {navItems.map((item, index) => (
                                        <ListItem key={item.path} disablePadding>
                                            <ListItemButton
                                                component={Link}
                                                to={item.path}
                                                onClick={handleDrawerClose}
                                                sx={{
                                                    padding: '1rem 1.5rem',
                                                    margin: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                                        transform: 'translateX(-8px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                                    }
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        color: 'white',
                                                        minWidth: '45px',
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '1.5rem',
                                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                                        }
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.label}
                                                    primaryTypographyProps={{
                                                        fontFamily: "'Poppins', sans-serif",
                                                        fontWeight: 500,
                                                        fontSize: '0.95rem',
                                                        letterSpacing: '0.3px'
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>

                                {/* Footer */}
                                <Box
                                    sx={{
                                        padding: '1.5rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderTop: '2px solid rgba(255,255,255,0.1)',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: "'Poppins', sans-serif",
                                            opacity: 0.7,
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        GHSS Luqman Banda
                                    </Typography>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
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
                                        fontWeight: 600,
                                        fontSize: '1.05rem',
                                        letterSpacing: '0.5px',
                                        padding: '0.7rem 1.5rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        '& .MuiButton-startIcon': {
                                            marginRight: '0.5rem',
                                            fontSize: '1.3rem'
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
