// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        // Implement logout logic here
        dispatch(logout()); // Dispatch the logout action to clear auth state
        window.location.href = '/login'; // Redirect to login after logout
    };

    const handleManageMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleManageMenuClose = () => {
        setAnchorEl(null);
    };

    const handleManageNavigation = (path) => {
        handleManageMenuClose();
        navigate(path);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => handleNavigation('/mainscheduling')}
                >
                    <img src="/logo.png" alt="Logo" style={{ height: '60px', width: 'auto' }} />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ marginRight: 4 }}>
                    GreenCrew
                </Typography>
                
                <Button color="inherit"onClick={handleManageMenuOpen}>Manage</Button>
                
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleManageMenuClose}
                >
                    <MenuItem onClick={() => handleManageNavigation('/manage-crew')}>Crew</MenuItem>
                    <MenuItem onClick={() => handleManageNavigation('/manage-crew-members')}>Crew Members</MenuItem>
                    <MenuItem onClick={() => handleManageNavigation('/manage-customers')}>Customers</MenuItem>
                </Menu>
                
                <Button color="inherit" onClick={() => handleNavigation('/reports')}>Reports</Button>
                <Button color="inherit" onClick={() => handleNavigation('/proposal')}>Proposal</Button>
                <Button color="inherit" onClick={() => handleNavigation('/billing')}>Billing</Button>
                
                <div style={{ flexGrow: 1 }} />
                
                <IconButton
                    color="inherit"
                    onClick={() => handleNavigation('/settings')}
                >
                    <SettingsIcon />
                </IconButton>
                
                <IconButton
                    color="inherit"
                    onClick={handleLogout}
                >
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
