import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Reset Password
                </Typography>
                {
                    user?
                    (<>
                        <Button color="inherit" component={Link} to="/home">Home</Button>
                        <Button color='inherit' onClick={logout}>Logout</Button>
                    </>):

                    (<>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </>)
                }
                
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
