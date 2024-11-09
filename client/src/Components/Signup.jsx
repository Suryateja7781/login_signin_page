import React, {useState} from 'react'
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import {Grid, Paper, TextField,Typography, Button} from "@mui/material";

export const Signup = () => {

    const paperStyle = {padding: "2rem", margin: "100px auto", borderRadius:"1rem", boxShadow: "10px 10px 10px"};
    const heading = {fontSize:"2.5rem", fontWeight:"600"}
    const row = {display:"flex", marginTop:"2rem"}
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSignup = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3002/signup", { name, email, password })
            .then(result => {
                if (result.status === 201) {
                    console.log("User created Successfully")
                    navigate("/login");
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    window.alert("Email already exists. Please use a different email.");
                } else {
                   console.log(err);
               } 
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
                <Typography component="h1" variant="h5" style={heading}> Signup </Typography>

                <form onSubmit={handleSignup}>
                    <TextField onChange={(e)=>setName(e.target.value)} name="name" required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth type="text" label="Enter Name" ></TextField>
                    <TextField onChange={(e)=>setEmail(e.target.value)} name="email" required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Email" variant="outlined" type="email" placeholder="Enter Email" ></TextField>              
                    <TextField onChange={(e)=>setPassword(e.target.value)} name="password" required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Password" variant="outlined" type="password" placeholder="Enter Password" ></TextField>
                    <Button style={btnStyle} variant="contained" type="submit">SignUp</Button>                    
                </form>

                <p>Already have an account?<Link to="/login"> Login</Link></p>
        </Paper>
    </Grid>
    
  )
}

