import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import FindBookingPage from './pages/FindBookingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import { Typography, Box, CircularProgress } from '@mui/material';
import './ModernApp.css';

function Loader() {
  return (
    <Box minHeight="40vh" display="grid" sx={{ placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<MainPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="find-booking" element={<FindBookingPage />} />
                <Route path="booking-success" element={<BookingSuccessPage />} />
                <Route path="admin">
                  <Route path="login" element={<AdminLoginPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                  </Route>
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route path="my-bookings" element={<MyBookingsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route
                  path="*"
                  element={
                    <Box textAlign="center" py={8}>
                      <Typography variant="h4" fontWeight={800}>
                        Page not found
                      </Typography>
                      <Typography color="text.secondary">
                        The page you’re looking for doesn’t exist.
                      </Typography>
                    </Box>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
