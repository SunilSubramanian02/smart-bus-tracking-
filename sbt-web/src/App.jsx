import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import ScannerPage from './pages/student/Scanner';
import ProfilePage from './pages/student/ProfilePage';
import ProfileDetails from './pages/student/ProfileDetails';
import PlaceholderPage from './pages/student/PlaceholderPage';
import TrackingPage from './pages/student/TrackingPage';
import SOSPage from './pages/student/SOSPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}`} />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>} />
          <Route path="/student/scan" element={<ProtectedRoute allowedRoles={['student']}><ScannerPage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/student/profile/details" element={<ProtectedRoute allowedRoles={['student']}><ProfileDetails /></ProtectedRoute>} />
          <Route path="/student/profile/password" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="Change Password" /></ProtectedRoute>} />
          <Route path="/student/profile/support" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="Help & Support" /></ProtectedRoute>} />
          <Route path="/student/track" element={<ProtectedRoute allowedRoles={['student']}><TrackingPage /></ProtectedRoute>} />
          <Route path="/student/sos" element={<ProtectedRoute allowedRoles={['student']}><SOSPage /></ProtectedRoute>} />
          
          <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
          <Route path="/driver" element={<ProtectedRoute allowedRoles={['driver']}><DriverDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
