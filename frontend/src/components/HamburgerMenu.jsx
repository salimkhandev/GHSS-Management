import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const HamburgerMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className=" p-2 rounded-md ">
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleClick}
                className="text-gray-700 hover:text-gray-100"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="mt-3 ml-[-18px]"
            >
                <MenuItem onClick={handleClose} className="hover:bg-gray-100">
                    <Link
                        to="/TakeAtten"
                        className="text-gray-800 hover:text-blue-500 transition-colors duration-200 no-underline"
                    >
                        Take Attendance
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="hover:bg-gray-100">
                    <Link
                        to="/PerformanceDashboard"
                        className="text-gray-800 hover:text-blue-500 transition-colors duration-200 no-underline"
                    >
                        Attendance Detail
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="hover:bg-gray-100">
                    <Link
                        to="/TeacherLogin"
                        className="text-gray-800 hover:text-blue-500 transition-colors duration-200 no-underline"
                    >
                        Login for your Class
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="hover:bg-gray-100">
                    <Link
                        to="/admin/TeacherRegistration"
                        className="text-gray-800 hover:text-blue-500 transition-colors duration-200 no-underline"
                    >
                        Register Teacher
                    </Link>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default HamburgerMenu;
