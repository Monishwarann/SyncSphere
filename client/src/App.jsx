import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateDiscussionPage from './pages/CreateDiscussionPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import { socket } from './sockets/socket';

const App = () => {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Load user session on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Instantly open socket stream for logged-in user
      socket.connect();
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    socket.connect();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    socket.disconnect();
    showToast('Logged out of portfolio space', 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Protected Route Wrapper
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-obsidian-950 text-obsidian-100 selection:bg-indigo-500 selection:text-white">
        {/* Navigation */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Routes */}
        <main className="flex-1 flex flex-col">
          <Routes>
            {/* Public Auth routes */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage onLoginSuccess={handleLoginSuccess} showToast={showToast} />
                )
              }
            />
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <RegisterPage onLoginSuccess={handleLoginSuccess} showToast={showToast} />
                )
              }
            />

            {/* Protected Core routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage user={user} showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-discussion"
              element={
                <PrivateRoute>
                  <CreateDiscussionPage showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/discussion/:id"
              element={
                <PrivateRoute>
                  <DiscussionDetailPage user={user} showToast={showToast} />
                </PrivateRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Floating Toast Alert */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
