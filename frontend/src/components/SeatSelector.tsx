import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { socket } from '../utils/socket';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import { Event } from '../types/types';
import GlassCard from '../components/GlassCard';
import { useColorMode } from '../contexts/ThemeProvider';

interface SeatSelectorProps {
  event: Event;
  isGuest: boolean;
  onClose: () => void;
}

const SeatSelector = ({ event, isGuest, onClose }: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [remotelyLockedSeats, setRemotelyLockedSeats] = useState<number[]>([]);
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { mode } = useColorMode();

  useEffect(() => {
    const handleSeatLocked = (data: { eventId: string; seatNumber: number }) => {
      if (data.eventId === event._id) setRemotelyLockedSeats(prev => [...prev, data.seatNumber]);
    };
    const handleSeatUnlocked = (data: { eventId: string; seatNumber: number }) => {
      if (data.eventId === event._id) setRemotelyLockedSeats(prev => prev.filter(seat => seat !== data.seatNumber));
    };
    socket.on('seat-is-now-locked', handleSeatLocked);
    socket.on('seat-is-now-unlocked', handleSeatUnlocked);
    return () => {
      socket.off('seat-is-now-locked', handleSeatLocked);
      socket.off('seat-is-now-unlocked', handleSeatUnlocked);
    };
  }, [event._id]);

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
      socket.emit('unlock-seat', { eventId: event._id, seatNumber });
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
      socket.emit('lock-seat', { eventId: event._id, seatNumber });
    }
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) return alert("Please select at least one seat.");
    if (isGuest && !guestPhone) return alert("Please enter your phone number to continue.");

    setIsProcessing(true);

    const url = isGuest
      ? "/bookings/guest/create-stripe-session"
      : "/bookings/create-stripe-session";

    const payload = {
      eventId: event._id,
      selectedSeats: selectedSeats,
      ...(isGuest && { phone: guestPhone })
    };

    try {
      const res = await api.post(url, payload);
      window.location.href = res.data.url;
    } catch (error: any) {
      alert(error.response?.data?.message || "Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleDemoCheckout = async () => {
    if (selectedSeats.length === 0) return alert("Please select at least one seat.");
    if (isGuest && !guestPhone) return alert("Please enter your phone number to continue.");

    setIsProcessing(true);

    const url = isGuest
      ? "/bookings/guest/demo-checkout"
      : "/bookings/demo-checkout";

    try {
      const res = await api.post(url, {
        eventId: event._id,
        selectedSeats: selectedSeats,
        ...(isGuest && { phone: guestPhone })
      });
      window.location.href = res.data.url;
    } catch (error: any) {
      alert(error.response?.data?.message || "Demo Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const renderSeats = (start: number, end: number) => {
    let seats = [];
    for (let i = start; i <= end; i++) {
      const isBooked = event.bookedSeats.includes(i.toString());
      const isLockedByOther = remotelyLockedSeats.includes(i);
      const isSelected = selectedSeats.includes(i);

      seats.push(
        <Button
          key={i}
          variant="outlined"
          disabled={isBooked || isLockedByOther}
          onClick={() => handleSeatClick(i)}
          sx={{
            minWidth: 32, width: 32, height: 32, borderRadius: 1.5,
            p: 0, fontSize: '0.8rem', fontWeight: 700,
            backgroundColor: isSelected ? 'primary.main' : (isBooked || isLockedByOther ? 'action.disabledBackground' : 'primary.light'),
            color: isSelected ? 'white' : (isBooked || isLockedByOther ? 'text.disabled' : 'primary.dark'),
            borderColor: isSelected ? 'primary.main' : (isBooked || isLockedByOther ? 'action.disabled' : 'primary.light'),
            '&:hover': {
              backgroundColor: isSelected ? 'primary.dark' : (isBooked || isLockedByOther ? 'action.disabledBackground' : 'primary.main'),
              color: isSelected ? 'white' : (isBooked || isLockedByOther ? 'text.disabled' : 'white'),
              borderColor: isSelected ? 'primary.dark' : (isBooked || isLockedByOther ? 'action.disabled' : 'primary.main'),
            },
            textDecoration: (isBooked || isLockedByOther) ? 'line-through' : 'none',
          }}
        >
          {i}
        </Button>
      );
    }
    return (
      <Stack spacing={1} alignItems="center">
        {seats.map((seat, index) => (
          <Box key={index}>
            {seat}
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperComponent={(props) => (
        <GlassCard {...props} sx={{ m: 2, background: 'transparent' }} />
      )}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)'
          }
        }
      }}
    >
      <DialogTitle sx={{
        fontWeight: 900,
        fontSize: '1.5rem',
        background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Select Your Seats
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
            bgcolor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
            '&:hover': { bgcolor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 3 }, overflowX: 'hidden' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: 2.5,
              height: '100%',
              bgcolor: mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="stretch">
                <Box>
                  <Typography variant="caption" fontWeight="bold" sx={{ mb: 1.5, display: 'block', textAlign: 'center', color: 'text.secondary' }}>LEFT</Typography>
                  {renderSeats(1, 20)}
                </Box>
                <Box sx={{ width: 15, borderLeft: '1px dashed', borderRight: '1px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '0.65rem', letterSpacing: 2 }}>AISLE</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight="bold" sx={{ mb: 1.5, display: 'block', textAlign: 'center', color: 'text.secondary' }}>RIGHT</Typography>
                  {renderSeats(21, 40)}
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {isGuest && (
              <TextField
                fullWidth
                label="Enter Your Phone Number"
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                    height: 48,
                  }
                }}
              />
            )}

            <Box sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              bgcolor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'
            }}>
              <Typography variant="subtitle1" fontWeight={800} gutterBottom>Checkout Summary</Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography color="text.secondary" variant="body2">Selected Seats:</Typography>
                <Typography fontWeight="bold" variant="body2">{selectedSeats.join(', ') || 'None'}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography color="text.secondary" variant="body2">Total Price:</Typography>
                <Typography variant="h5" fontWeight="900" sx={{ color: mode === 'light' ? '#2563eb' : '#2dd4bf' }}>
                  ${selectedSeats.length * event.price}
                </Typography>
              </Stack>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleCheckout}
              disabled={isProcessing || selectedSeats.length === 0}
              sx={{
                py: 1.25,
                mb: 1.5,
                borderRadius: 2,
                fontWeight: 800,
                fontSize: '1rem',
                backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                boxShadow: mode === 'light' ? '0 8px 20px rgba(59, 130, 246, 0.4)' : '0 8px 20px rgba(45, 212, 191, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: mode === 'light' ? '0 12px 24px rgba(59, 130, 246, 0.5)' : '0 12px 24px rgba(45, 212, 191, 0.5)',
                }
              }}
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Payment (Stripe)'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleDemoCheckout}
              disabled={isProcessing || selectedSeats.length === 0}
              sx={{
                py: 1.25,
                borderRadius: 2,
                fontWeight: 800,
                borderWidth: '2px',
                '&:hover': { borderWidth: '2px', bgcolor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }
              }}
            >
              Skip Payment (Demo Ticket)
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default SeatSelector;