import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from './api';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import GlassCard from './GlassCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Booking {
  qrCode: string;
  bookingId: string;
  seats: string[];
}

const BookingSuccessPage = () => {
    const [status, setStatus] = useState<'confirming' | 'confirmed' | 'error'>('confirming');
    const [booking, setBooking] = useState<Booking | null>(null);
    const location = useLocation();

    useEffect(() => {
        const confirmBooking = async () => {
            const sessionId = new URLSearchParams(location.search).get('session_id');
            if (!sessionId) {
                setStatus('error');
                return;
            }
            try {
                const res = await api.post<{ booking: Booking }>('/bookings/confirm-booking', { sessionId });
                setBooking(res.data.booking);
                setStatus('confirmed');
            } catch (error) {
                setStatus('error');
            }
        };
        confirmBooking();
    }, [location.search]);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
        <GlassCard sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}>
          {status === 'confirming' && (
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="h6">Confirming your booking...</Typography>
            </Stack>
          )}
          {status === 'error' && (
            <Stack spacing={2} alignItems="center">
              <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
              <Typography variant="h5" fontWeight={700}>Booking Failed</Typography>
              <Alert severity="error" sx={{ width: '100%' }}>
                There was a problem confirming your booking. Please try again or contact support.
              </Alert>
              <Button component={Link} to="/" variant="contained">Back to Events</Button>
            </Stack>
          )}
          {status === 'confirmed' && booking && (
            <Stack spacing={2} alignItems="center">
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h5" fontWeight={700}>Booking Confirmed!</Typography>
              <Typography color="text.secondary">
                Your ticket is ready. Present this QR code at the shuttle entry.
              </Typography>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'action.hover' }}>
                <img src={booking.qrCode} alt="Your QR Code Ticket" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
              </Box>
              <Stack spacing={0.5} sx={{ textAlign: 'left', width: '100%' }}>
                <Typography><strong>Booking ID:</strong> {booking.bookingId}</Typography>
                <Typography><strong>Seats:</strong> {booking.seats.join(', ')}</Typography>
              </Stack>
              <Button
                component={Link}
                to="/my-bookings"
                variant="contained"
                fullWidth
              >
                View All My Bookings
              </Button>
            </Stack>
          )}
        </GlassCard>
      </Box>
    );
};
export default BookingSuccessPage;