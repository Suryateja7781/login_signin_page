import React from 'react'
import {Link} from 'react-router-dom'
import {Logout} from './Logout';
import {AppBar, Typography, Toolbar, Button} from "@mui/material";

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const button={marginRight:'20px', fontSize:'1.2rem', fontWeight:'700', padding:'0.3rem 1.4rem'}
    return (
            <AppBar sx={{ bgcolor: '#333' }}>
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        PrediX
                    </Typography>
                    {!isLoggedIn ? (
                        <>
                            <Button variant="contained" style={button} color="error" component={Link} to="/login">
                                Login 
                            </Button>

                            <Button variant="contained" style={button} color="success" component={Link} to="/signup">
                                Signup
                            </Button>
                        </>
                    ) : (
                        <Logout setIsLoggedIn={setIsLoggedIn} />
                    )}
                </Toolbar>
            </AppBar>
    );
};