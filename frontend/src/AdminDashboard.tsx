import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import EventForm from './EventForm';
import { socket } from './socket'; // CORRECTED IMPORT PATH
import { Event } from './types';
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
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get<Event[]>('/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/admin/login');
    else fetchEvents();

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

      alert(`Simulating drive for ${event.name}. Check the main page map!`);
      let currentLat = event.lat;
      let currentLng = event.lng;
      
      simulationIntervalRef.current = setInterval(() => {
          currentLat += (Math.random() - 0.5) * 0.01; // Smaller, more realistic movements
          currentLng += (Math.random() - 0.5) * 0.01;
          socket.emit('update-shuttle-location', {
              eventId: event._id,
              lat: currentLat,
              lng: currentLng,
          });
      }, 2000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Admin Dashboard
        </Typography>
        <Button onClick={handleLogout} variant="outlined">Logout</Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h2">Manage Events</Typography>
        <Button variant="contained" onClick={handleCreate}>+ Create New Event</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Price (USD)</TableCell>
              <TableCell align="right">Seats</TableCell>
              <TableCell align="center">Actions</TableCell>
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

      {isModalOpen && (
        <EventForm event={editingEvent} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}
    </Box>
  );
};
export default AdminDashboard;