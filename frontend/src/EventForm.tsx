import React, { useState, useEffect, useRef } from 'react';
import api from './api';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Event } from './types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

interface EventFormProps {
  event: Event | null;
  onSave: () => void;
  onClose: () => void;
}

interface FormData {
  name: string;
  date: string;
  location: string;
  lat: string | number;
  lng: string | number;
  destinationName: string;
  destinationLat: string | number;
  destinationLng: string | number;
  price: string | number;
  seats: string | number;
}

const EventForm = ({ event, onSave, onClose }: EventFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '', date: '',
    location: '', lat: '', lng: '',
    destinationName: '', destinationLat: '', destinationLng: '',
    price: '', seats: ''
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'], // Load the places library for Autocomplete
  });

  // Refs to hold the autocomplete instances
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        lat: event.lat || '',
        lng: event.lng || '',
        destinationName: event.destinationName || '',
        destinationLat: event.destinationLat || '',
        destinationLng: event.destinationLng || '',
        price: event.price || '',
        seats: event.seats || ''
      });
    } else {
      setFormData({ name: '', date: '', location: '', lat: '', lng: '', destinationName: '', destinationLat: '', destinationLng: '', price: '', seats: '' });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceSelect = (autocomplete: google.maps.places.Autocomplete | null, fieldPrefix: string) => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setFormData(prev => ({
        ...prev,
        [`${fieldPrefix}Name`]: place.name,
        [`${fieldPrefix === 'destination' ? 'destinationL' : 'l'}at`]: place.geometry?.location?.lat() || '',
        [`${fieldPrefix === 'destination' ? 'destinationL' : 'l'}ng`]: place.geometry?.location?.lng() || '',
      }));
    } else {
      console.error('Autocomplete is not loaded yet!');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (event) {
        await api.put(`/admin/events/${event._id}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      onSave();
    } catch (error) {
      alert('Error saving event.');
    }
  };

  if (!isLoaded) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading form...</Typography>
    </Box>
  );

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                name="name"
                label="Event Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                name="date"
                label="Date and Time"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Autocomplete
                onLoad={(autocomplete) => originAutocompleteRef.current = autocomplete}
                onPlaceChanged={() => handlePlaceSelect(originAutocompleteRef.current, 'location')}
              >
                <TextField
                  name="location"
                  label="Origin Name (e.g., Pittsburgh, PA)"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Autocomplete>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Autocomplete
                onLoad={(autocomplete) => destinationAutocompleteRef.current = autocomplete}
                onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef.current, 'destination')}
              >
                <TextField
                  name="destinationName"
                  label="Destination Name (e.g., New York, NY)"
                  value={formData.destinationName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Autocomplete>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
              <TextField
                name="price"
                label="Price (USD)"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
              <TextField
                name="seats"
                label="Total Seats"
                type="number"
                value={formData.seats}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default EventForm;