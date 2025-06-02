import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ProfilePage from './pages/dashboard/ProfilePage';
import BookingsPage from './pages/dashboard/BookingsPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCarsPage from './pages/admin/ManageCarsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Stores
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isDarkMode } = useThemeStore();
  const { user, isAdmin } = useAuthStore();
  
  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={
            user ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> : <LoginPage />
          } />
          
          {/* Protected car routes */}
          <Route path="/cars" element={
            <ProtectedRoute>
              <CarsPage />
            </ProtectedRoute>
          } />
          <Route path="/cars/:id" element={
            <ProtectedRoute>
              <CarDetailsPage />
            </ProtectedRoute>
          } />
          
          {/* Protected user routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ProfilePage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
          </Route>
          
          {/* Protected admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="cars" element={<ManageCarsPage />} />
            <Route path="bookings" element={<ManageBookingsPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;