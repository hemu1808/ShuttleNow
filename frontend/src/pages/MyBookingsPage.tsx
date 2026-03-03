import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Stack,
} from '@mui/material';
import GlassCard from '../components/GlassCard';
import { useColorMode } from '../contexts/ThemeProvider';
import { motion } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

interface User {
  name: string;
  email: string;
  phone?: string;
}

interface Event {
  _id: string;
  name: string;
  date: string;
}

interface Booking {
  _id: string;
  event: Event;
  seats: string[];
  bookingId: string;
  qrCode: string;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { mode } = useColorMode();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const [bookingsRes, userRes] = await Promise.all([
          api.get<Booking[]>('/bookings/my-bookings'),
          api.get<User>('/auth/me')
        ]);
        setBookings(bookingsRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading your bookings...</Typography>
    </Box>
  );

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, minHeight: 'calc(100vh - 96px)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight={900} sx={{
          background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1
        }}>
          My Bookings
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          ← Back to Events
        </Button>
      </Stack>

      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard sx={{ p: 4, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%',
              bgcolor: mode === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(45, 212, 191, 0.1)',
              color: mode === 'light' ? '#3b82f6' : '#2dd4bf',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <PersonOutlineIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box flex={1}>
              <Typography variant="h4" fontWeight={900} mb={1}>
                {user.name || 'User'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} color="text.secondary">
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon fontSize="small" />
                  <Typography variant="body1" fontWeight={500}>{user.email}</Typography>
                </Stack>
                {user.phone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body1" fontWeight={500}>{user.phone}</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            <Button
              component={Link}
              to="/settings"
              variant="outlined"
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              Account Settings
            </Button>
          </GlassCard>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {bookings.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <GlassCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You have no bookings yet.
              </Typography>
            </GlassCard>
          </Grid>
        ) : (
          bookings.map((booking: Booking, index: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking._id} sx={{ mb: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 2, letterSpacing: -0.5 }}>
                    {booking.event.name}
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, borderRadius: 3, bgcolor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <strong style={{ color: mode === 'light' ? '#1e293b' : '#f8fafc' }}>Date:</strong> {new Date(booking.event.date).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <strong style={{ color: mode === 'light' ? '#1e293b' : '#f8fafc' }}>Seats:</strong> {booking.seats.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong style={{ color: mode === 'light' ? '#1e293b' : '#f8fafc' }}>ID:</strong> {booking.bookingId}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 'auto', textAlign: 'center', p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 4, bgcolor: 'background.paper' }}>
                    <img src={booking.qrCode} alt="Booking QR Code" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                    <Typography variant="caption" display="block" sx={{ mt: 2, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Scan at Entry
                    </Typography>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};
export default MyBookingsPage;