import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import HamburgerMenu from "./HamburgerMenu";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar
            position="sticky"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
        >
            <Toolbar className="flex justify-between">
            <HamburgerMenu />
                <Typography variant="h6" className="font-bold">
                    MyApp
                </Typography>
                <div className="flex space-x-4">
                    <Button component={Link} to="/" color="inherit">
                        Home
                    </Button>
                    <Button component={Link} to="/promote" color="inherit">
                        Promote Students
                    </Button>
                    <Button component={Link} to="/studentlist" color="inherit">
                        Students List
                    </Button>
                    <Button component={Link} to="/contact" color="inherit">
                        Student Form
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
