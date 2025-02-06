import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import HamburgerMenu from "./HamburgerMenu";
import MobileHamberger from "./MobileHamberger";
import { Link } from 'react-router-dom';
import logo from "../images/ghssLogo.png"; // Adjust the path to your logo

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
                    <div className="flex items-center space-x-2"> {/* Flex container for logo and text */}
                        <img
                            src={logo}
                            alt="School Logo"
                            className="h-10 w-10 object-contain transform transition-transform duration-300 hover:scale-110"
                        />
                        <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                            GHSS Luqman Banda
                        </Typography>
                    </div>
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
