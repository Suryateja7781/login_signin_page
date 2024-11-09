const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const session = require("express-session");
const UserModel= require("./model/User")


dotenv.config();
const app = express()
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
  }));



app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 1000 * 60 * 60 * 1, 
    },
  }));
  
mongoose.connect("mongodb://localhost:27017/signup")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.listen(3002, () => {
    console.log(`Server is running on port ${process.env.PORT }`);
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email };
                console.log(user.name);
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});


app.get('/user', (req, res) => {
    console.log("Session Data:", req.session);
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});


// const express = require("express");
// const mongoose = require('mongoose');
// const cors = require("cors");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const UserModel = require('./models/User');
// const refreshTokens = [];

// const app = express();
// app.use(express.json());

// const corsOptions = {
//   origin: 'http://localhost:5173', // Update to match the origin of your front-end
//   credentials: true, // Allow credentials
// };
// app.use(cors(corsOptions));

// mongoose.connect("mongodb://localhost:27017/user")
//   .then(() => {
//     console.log("Connected to MongoDB");
//   }).catch(err => {
//     console.error("Error connecting to MongoDB", err);
//   });

// const generateAccessToken = (user) => {
//   return jwt.sign(user, 'accessSecret', { expiresIn: '15m' });
// };

// const generateRefreshToken = (user) => {
//   const refreshToken = jwt.sign(user, 'refreshSecret');
//   refreshTokens.push(refreshToken);
//   return refreshToken;
// };

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   UserModel.findOne({ email: email })
//     .then(user => {
//       if (user) {
//         bcrypt.compare(password, user.password, (err, result) => {
//           if (result) {
//             const accessToken = generateAccessToken({ email: user.email });
//             const refreshToken = generateRefreshToken({ email: user.email });
//             res.json({ accessToken, refreshToken });
//           } else {
//             res.json("Incorrect password");
//           }
//         });
//       } else {
//         res.json("Incorrect email");
//       }
//     })
//     .catch(err => res.json(err));
// });

// app.post('/register', (req, res) => {
//   const { name, email, password } = req.body;
//   UserModel.findOne({ email: email })
//     .then(user => {
//       if (user) {
//         res.json("User already registered");
//       } else {
//         bcrypt.hash(password, 10, (err, hash) => {
//           if (err) {
//             return res.json(err);
//           }
//           const newUser = new UserModel({ name, email, password: hash });
//           newUser.save()
//             .then(user => res.status(201).json(user)) // Changed to status 201
//             .catch(err => res.json(err));
//         });
//       }
//     })
//     .catch(err => res.json(err));
// });

// app.post('/token', (req, res) => {
//   const { token } = req.body;
//   if (!token) return res.sendStatus(401);
//   if (!refreshTokens.includes(token)) return res.sendStatus(403);

//   jwt.verify(token, 'refreshSecret', (err, user) => {
//     if (err) return res.sendStatus(403);
//     const accessToken = generateAccessToken({ email: user.email });
//     res.json({ accessToken });
//   });
// });

// app.listen(3002, () => {
//   console.log("Server is running on port 3002");
// });
