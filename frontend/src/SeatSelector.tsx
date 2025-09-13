import React, { useState, useEffect } from 'react';
import api from './api';
import { socket } from './socket';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import { Event } from './types';

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
            minWidth: 40, height: 40, borderRadius: 1,
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
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Select Your Seats
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ border: '2px solid', borderColor: 'divider', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Driver</Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Box>
              {renderSeats(1, 20)}
            </Box>
            <Box>
              {renderSeats(21, 40)}
            </Box>
          </Stack>
        </Box>

        {isGuest && (
          <TextField
            fullWidth
            label="Enter Your Phone Number"
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            sx={{ mb: 3 }}
          />
        )}

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Checkout Summary</Typography>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography>Selected Seats:</Typography>
            <Typography fontWeight="bold">{selectedSeats.join(', ') || 'None'}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Total:</Typography>
            <Typography fontWeight="bold">${selectedSeats.length * event.price}</Typography>
          </Stack>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleCheckout}
          disabled={isProcessing || selectedSeats.length === 0}
          sx={{ py: 1.5 }}
        >
          {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Payment'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default SeatSelector;