import React from "react";
import { ReactDOM } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage"; //don't need ./ cause of jsonConfig file
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import "./index.css";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={LoginPage} />
                    <Route path="/home" element={HomePage} />
                    <Route path="/profile/:userId" element={ProfilePage} />
                </Routes>
            </BrowserRouter>
            <h1>Hello world</h1>
        </div>
    );
}
export default App;