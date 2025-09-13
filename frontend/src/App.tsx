import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from './ThemeProvider';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MyBookingsPage from './MyBookingsPage';
import BookingSuccessPage from './BookingSuccessPage';
import FindBookingPage from './FindBookingPage';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './AdminDashboard';
import { Box, CircularProgress } from '@mui/material';
import PageTransition from './PageTransition';
import './ModernApp.css';

function Loader() {
  return (
    <Box minHeight="40vh" display="grid" placeItems="center">
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
