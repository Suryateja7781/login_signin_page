import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import {Grid , Paper, TextField,Typography, Button} from "@mui/material";

export const Login = ({ setIsLoggedIn, isLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const paperStyle = {padding: "2rem", margin: "100px auto", borderRadius:"1rem", boxShadow: "10px 10px 10px"};
    const heading = {fontSize:"2.5rem", fontWeight:"600"}
    const row = {display:"flex", marginTop:"2rem"}
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3002/login", { email, password }, { withCredentials: true })
            .then(result => {
                if (result.status === 200 && result.data === "Success") {
                    // If login is successful, get the user data
                    axios.get('http://localhost:3002/user', { withCredentials: true })
                        .then(response => {
                            if (response.status === 200 && response.data.user) {
                                setIsLoggedIn(true);
                                navigate("/home", { state: { user: response.data.user } });
                            } else {
                                console.error("Failed to fetch user data.");
                                alert("Something went wrong while fetching user data.");
                            }
                        })
                        .catch(err => {
                            console.error("Error while fetching user data:", err);
                            alert("Something went wrong.");
                        });
                } else {
                    console.log("Login failed:", result.data);
                    alert("Login failed. Please check your credentials.");
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                alert("An error occurred while logging in.");
            });
    };
    
  return (
    
    <Grid align="center" className="wrapper">
        <Paper style={paperStyle} sx={{width: {
            xs: '80vw',     // 0
            sm: '50vw',     // 600                   
            md: '40vw',     // 900
            lg: '30vw',     // 1200
            xl: '20vw',     // 1536 
            },
            height:'60vh', }}>
                <Typography component="h1" variant="h5" style={heading}> Login </Typography>

                <form onSubmit={handleLogin}>
                    <TextField onChange={(e) => setEmail(e.target.value)} required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Email" variant="outlined" type="email" placeholder="Enter Email" name="email" ></TextField>              
                    <TextField onChange={(e) => setPassword(e.target.value)} required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Password" variant="outlined" type="password" placeholder="Enter Password" name="password"></TextField>
                    <Button style={btnStyle} variant="contained" type="submit">Login</Button>                    
                </form>

                <p>Don't have an account? <Link to="/signup">SignUp</Link></p>
        </Paper>
    </Grid>
  )
}
