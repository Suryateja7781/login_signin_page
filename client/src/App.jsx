import {React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate , useNavigate} from "react-router-dom";
import {Home} from "./Components/Home";
import {Login} from "./Components/Login";
import {Signup} from "./Components/Signup";
import { Navbar } from "./Components/Navbar";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
      axios.get('http://localhost:3002/user', { withCredentials: true })
          .then(response => {
              if (response.data.user) {
                  setIsLoggedIn(true);
                  // navigate("/home", { state: { user: response.data.user } });
              } else {
                  setIsLoggedIn(false);
              }
          })
          .catch(() => setIsLoggedIn(false));
  }, []);

  return (
      <div>
          <BrowserRouter>
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup setIsLoggedIn={setIsLoggedIn} />} />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;
