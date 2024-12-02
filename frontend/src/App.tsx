import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/:userId" element={<Dashboard />} />
       <Route path="/history/:userId" element={<HistoryPage/>} />

      </Routes>
    </Router>
  );
};

export default App;
