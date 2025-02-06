import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import HamburgerMenu from "./HamburgerMenu";
import MobileHamberger from "./MobileHamberger";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <MobileHamberger/>
        <AppBar
            position="sticky"
            className="bg-gradient-to-r navbarHide from-blue-500 to-blue-700 text-white shadow-lg"
        >
            <Toolbar className="flex justify-between">
                <HamburgerMenu />
                <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    GHSS Luqman Banda
                </Typography>
                <div className="flex space-x-4">
                    <Button component={Link} to="/" color="inherit" sx={{ textTransform: 'capitalize' }}>
                        Home
                    </Button>
                        <Button component={Link} to="/PerformanceDashboard" color="inherit" sx={{ textTransform: 'capitalize' }}>
                        Attendance Detail
                    </Button>
                    <Button component={Link} to="/studentlist" color="inherit" sx={{ textTransform: 'capitalize' }}>
                        Overall Entrolled Students
                    </Button>
                        <Button component={Link} to="/TeachersList" color="inherit" sx={{ textTransform: 'capitalize' }}>
                            TeachersList
                    </Button>

                </div>
            </Toolbar>
        </AppBar>
            </div>
    );
};

export default Navbar;
