import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import GlassCard from '../components/GlassCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useColorMode } from '../contexts/ThemeProvider';

interface Booking {
  qrCode: string;
  bookingId: string;
  seats: string[];
}

const BookingSuccessPage = () => {
  const [status, setStatus] = useState<'confirming' | 'confirmed' | 'error'>('confirming');
  const [booking, setBooking] = useState<Booking | null>(null);
  const location = useLocation();
  const { mode } = useColorMode();

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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 96px)', p: 3 }}>
      <GlassCard sx={{ p: { xs: 4, md: 6 }, maxWidth: 550, width: '100%', textAlign: 'center' }}>
        {status === 'confirming' && (
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h5" fontWeight={700}>Processing your booking...</Typography>
          </Stack>
        )}
        {status === 'error' && (
          <Stack spacing={3} alignItems="center">
            <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
            <Typography variant="h4" fontWeight={900}>Booking Failed</Typography>
            <Alert severity="error" sx={{ width: '100%', borderRadius: 3 }}>
              There was a problem confirming your booking. Please try again or contact support.
            </Alert>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 3, fontWeight: 700, mt: 2 }}
            >
              Back to Events
            </Button>
          </Stack>
        )}
        {status === 'confirmed' && booking && (
          <Stack spacing={3} alignItems="center">
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 90 }} />
            <Typography variant="h3" fontWeight={900} sx={{
              background: mode === 'light' ? 'linear-gradient(45deg, #10b981, #059669)' : 'linear-gradient(45deg, #34d399, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: -1
            }}>
              Confirmed!
            </Typography>
            <Typography color="text.secondary" fontSize="1.1rem" mb={2}>
              Your ticket is ready. Present this QR code at the shuttle entry.
            </Typography>

            {booking.bookingId.startsWith('DEMO_SESSION_') && (
              <Alert severity="info" sx={{ mb: 2, borderRadius: 2, width: '100%', maxWidth: 350 }}>
                This is a DEMO ticket generated without payment.
              </Alert>
            )}

            <Box sx={{
              p: 3,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: mode === 'light' ? '0 10px 30px rgba(0,0,0,0.05)' : 'none'
            }}>
              <img src={booking.qrCode} alt="Your QR Code Ticket" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
            </Box>

            <Stack spacing={1} sx={{ textAlign: 'left', width: '100%', bgcolor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', p: 3, borderRadius: 3 }}>
              <Typography variant="body1" color="text.secondary">
                <strong style={{ color: mode === 'light' ? '#1e293b' : '#f8fafc' }}>Booking ID:</strong> {booking.bookingId}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong style={{ color: mode === 'light' ? '#1e293b' : '#f8fafc' }}>Seats:</strong> {booking.seats.join(', ')}
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/my-bookings"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 800,
                fontSize: '1.1rem',
                backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                boxShadow: mode === 'light' ? '0 8px 20px rgba(59, 130, 246, 0.4)' : '0 8px 20px rgba(45, 212, 191, 0.4)',
                mt: 2
              }}
            >
              View My Tickets
            </Button>
          </Stack>
        )}
      </GlassCard>
    </Box>
  );
};
export default BookingSuccessPage;