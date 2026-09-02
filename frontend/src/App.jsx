import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Bids from './pages/Bids';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MyImages from './pages/MyImages';
import UploadImages from './pages/UploadImages';
import Albums from './pages/Albums';
import Analytics from './pages/Analytics';
import Trash from './pages/Trash';
import Pricing from './pages/Pricing';
import ImageDetails from './pages/ImageDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bids" element={<Bids />} />
        <Route path="/saved" element={<Navigate to="/dashboard" replace />} />
        <Route path="/my-images" element={<MyImages />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/shared-links" element={<Navigate to="/dashboard" replace />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/image/:id" element={<ImageDetails />} />
        <Route path="/upload" element={<UploadImages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
