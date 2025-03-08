import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Auth from "./components/Auth"
import Layout from "./components/Layout"
import LandingPage from './components/LandingPage';
import SignupPage from './components/Auth';


const App = () => {
  return (
    <Router>
      <div id="main-content" className="transition-opacity duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Layout />} />
          
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
};

export default App;

