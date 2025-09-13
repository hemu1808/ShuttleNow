import React, { useState, useEffect } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
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

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
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
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          My Bookings
        </Typography>
        <Button component={Link} to="/" variant="outlined">
          ← Back to Events
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {bookings.length === 0 ? (
          <Grid size = {{xs: 12}}>
            <GlassCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You have no bookings yet.
              </Typography>
            </GlassCard>
          </Grid>
        ) : (
          bookings.map((booking: Booking) => (
            <Grid  size= {{ xs: 12, sm: 6, md: 4 }} key={booking._id}>
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
          ))
        )}
      </Grid>
    </Box>
  );
};
export default MyBookingsPage;