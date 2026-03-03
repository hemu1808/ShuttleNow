import React, { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Grid,
  Alert,
} from '@mui/material';
import GlassCard from '../components/GlassCard';
import { useColorMode } from '../contexts/ThemeProvider';
import { motion } from 'framer-motion';

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

const FindBookingPage = () => {
  const [phone, setPhone] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const { mode } = useColorMode();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await api.post<Booking[]>('/bookings/find-by-phone', { phone });
      setBookings(res.data);
    } catch (err: any) {
      setBookings([]);
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 96px)',
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <GlassCard sx={{ p: { xs: 4, md: 5 }, maxWidth: 650, width: '100%', mb: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h3" component="h1" fontWeight={900} sx={{
            background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: -1
          }}>
            Find Ticket
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            ← Home
          </Button>
        </Stack>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Enter the phone number you used to book as a guest to retrieve your active tickets.
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Your Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 3,
                bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                '&.Mui-focused': {
                  bgcolor: mode === 'light' ? '#fff' : 'rgba(0,0,0,0.5)'
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 800,
              fontSize: '1.1rem',
              backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
              boxShadow: mode === 'light' ? '0 8px 20px rgba(59, 130, 246, 0.4)' : '0 8px 20px rgba(45, 212, 191, 0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: mode === 'light' ? '0 12px 24px rgba(59, 130, 246, 0.5)' : '0 12px 24px rgba(45, 212, 191, 0.5)',
              }
            }}
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : 'Find My Tickets'}
          </Button>
        </Box>
      </GlassCard>

      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>Searching for bookings...</Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        )}
        {!loading && !error && searched && bookings.length === 0 && (
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            No bookings found for that number.
          </Alert>
        )}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {bookings.map((booking: Booking, index: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default FindBookingPage;