import React, { useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import GlassCard from './GlassCard';

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
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4,
        px: 2,
      }}
    >
      <GlassCard sx={{ p: 4, maxWidth: 600, width: '100%', mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Find My Booking
          </Typography>
          <Button component={Link} to="/" variant="outlined">
            ← Back to Events
          </Button>
        </Stack>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter the phone number you used to book as a guest to find your tickets.
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Your Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Find My Tickets'}
          </Button>
        </Box>
      </GlassCard>

      <Box sx={{ width: '100%', maxWidth: 900 }}>
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
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {bookings.map((booking: Booking) => (
            <Grid size= {{ xs: 12, sm: 6, md: 4 }} key={booking._id}>
              <GlassCard sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {booking.event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {new Date(booking.event.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Seats:</strong> {booking.seats.join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Booking ID:</strong> {booking.bookingId}
                </Typography>
                <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                  <img src={booking.qrCode} alt="Booking QR Code" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Scan at Entry
                  </Typography>
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default FindBookingPage;