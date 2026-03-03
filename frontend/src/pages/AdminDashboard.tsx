import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import EventForm from './EventForm';
import { socket } from '../utils/socket';
import { Event } from '../types/types';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import GlassCard from '../components/GlassCard';
import { useColorMode } from '../contexts/ThemeProvider';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AdminMetrics {
  totalBookings: number;
  totalRevenue: number;
  totalSeatsAvailable: number;
  totalSeatsBooked: number;
  fillRate: number;
  revenueByEvent: { eventName: string; revenue: number; bookings: number }[];
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const { mode } = useColorMode();
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get<Event[]>('/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await api.get<AdminMetrics>('/admin/metrics');
      setMetrics(res.data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/admin/login');
    else {
      fetchEvents();
      fetchMetrics();
    }

    // Cleanup simulation on component unmount
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/admin/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        alert('Could not delete event.');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchEvents();
  };

  const handleSimulateDrive = (event: Event) => {
    // Clear any existing simulation
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    if (!event.lat || !event.lng || !event.destLat || !event.destLng) {
      alert('Event is missing origin or destination coordinates. Cannot simulate drive.');
      return;
    }

    alert(`Simulating drive for ${event.name}. Check the main page map!`);

    const startLat = event.lat;
    const startLng = event.lng;
    const endLat = event.destLat;
    const endLng = event.destLng;

    const totalSteps = 100; // e.g., 100 updates
    let currentStep = 0;

    simulationIntervalRef.current = setInterval(() => {
      if (currentStep >= totalSteps) {
        if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        return;
      }

      // Linear interpolation for a smooth line
      const progress = currentStep / totalSteps;
      const currentLat = startLat + (endLat - startLat) * progress;
      const currentLng = startLng + (endLng - startLng) * progress;

      socket.emit('update-shuttle-location', {
        eventId: event._id,
        lat: currentLat,
        lng: currentLng,
      });

      currentStep++;
    }, 1000); // update every second
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 96px)' }}>
      <GlassCard sx={{ p: { xs: 3, md: 5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight={900} sx={{
            background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: -1
          }}>
            Admin Dashboard
          </Typography>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Logout
          </Button>
        </Stack>

        {metrics && (
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <GlassCard sx={{ p: 3, textAlign: 'center', bgcolor: mode === 'light' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(45, 212, 191, 0.1)' }}>
                  <Typography variant="h6" color="text.secondary" fontWeight={700}>Total Revenue</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ color: mode === 'light' ? 'primary.main' : '#2dd4bf' }}>
                    ${metrics.totalRevenue.toLocaleString()}
                  </Typography>
                </GlassCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <GlassCard sx={{ p: 3, textAlign: 'center', bgcolor: mode === 'light' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(45, 212, 191, 0.1)' }}>
                  <Typography variant="h6" color="text.secondary" fontWeight={700}>Total Bookings</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ color: mode === 'light' ? 'primary.main' : '#2dd4bf' }}>
                    {metrics.totalBookings.toLocaleString()}
                  </Typography>
                </GlassCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <GlassCard sx={{ p: 3, textAlign: 'center', bgcolor: mode === 'light' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(45, 212, 191, 0.1)' }}>
                  <Typography variant="h6" color="text.secondary" fontWeight={700}>System Fill Rate</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ color: mode === 'light' ? 'primary.main' : '#2dd4bf' }}>
                    {metrics.fillRate}%
                  </Typography>
                </GlassCard>
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, ml: 1 }}>Revenue by Route</Typography>
            <GlassCard sx={{ p: 3, height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.revenueByEvent} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={mode === 'light' ? '#3b82f6' : '#2dd4bf'} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={mode === 'light' ? '#3b82f6' : '#2dd4bf'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} vertical={false} />
                  <XAxis dataKey="eventName" stroke={mode === 'light' ? '#64748b' : '#94a3b8'} />
                  <YAxis stroke={mode === 'light' ? '#64748b' : '#94a3b8'} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: mode === 'light' ? '#0f172a' : '#f8fafc', fontWeight: 800 }}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={mode === 'light' ? '#3b82f6' : '#2dd4bf'} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </Box>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight={800} color="text.secondary">
            Manage Routes & Events
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, sm: 0 } }}>
            <Button
              variant="outlined"
              startIcon={<QrCodeScannerIcon />}
              disabled
              sx={{
                borderRadius: 3,
                fontWeight: 800,
                bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'
              }}
            >
              Scan QR (Coming Soon)
            </Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{
                borderRadius: 3,
                fontWeight: 800,
                backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                boxShadow: mode === 'light' ? '0 4px 14px rgba(59, 130, 246, 0.4)' : '0 4px 14px rgba(45, 212, 191, 0.4)'
              }}
            >
              + Create New Route
            </Button>
          </Stack>
        </Stack>
      </GlassCard>

      <GlassCard sx={{ mt: 4, p: { xs: 2, md: 3 } }}>
        <TableContainer component={Box} sx={{ bgcolor: 'transparent', borderRadius: 4, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Route Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Price (USD)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Seats</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell component="th" scope="row">{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                  <TableCell align="right">${event.price}</TableCell>
                  <TableCell align="right">{event.seats}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton size="small" onClick={() => handleEdit(event)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(event._id)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleSimulateDrive(event)} aria-label="simulate drive">
                        <DirectionsBusIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>

      {isModalOpen && (
        <EventForm event={editingEvent} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}
    </Box>
  );
};
export default AdminDashboard;