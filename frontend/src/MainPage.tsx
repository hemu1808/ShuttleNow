import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useColorMode } from './ThemeProvider';
import { useAuth } from './AuthContext';
import { useEvents, ShuttleLocations } from './useEvents';
import SeatSelector from './SeatSelector';
import { Event } from './types';

import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  List,
  ListItemButton,
  Divider,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import GlassCard from './GlassCard';
import {
  CalendarMonthOutlined,
  PlaceOutlined,
  PeopleAltOutlined,
  LogoutOutlined,
  LoginOutlined,
  SearchOutlined,
  WbSunnyRounded,
  DarkModeRounded,
} from '@mui/icons-material';

interface BookingFlow {
  event: Event | null;
  isGuest: boolean;
}

export default function MainPage() {
  const { events, shuttleLocations } = useEvents();
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [bookingFlow, setBookingFlow] = useState<BookingFlow>({ event: null, isGuest: false });
  const auth = useAuth();
  const navigate = useNavigate();
  const { mode, toggle } = useColorMode();

  useEffect(() => {
    if (!activeEvent && events.length) setActiveEvent(events[0]);
  }, [events, activeEvent]);

  const startBooking = (event: Event, guest: boolean) => {
    if (!auth.isAuthenticated && !guest) return navigate('/login');
    setBookingFlow({ event, isGuest: guest });
  };

  return (
    <Box px={{ xs: 2, md: 3 }} py={3}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <GlassCard>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={800}>
                ShuttleNow
              </Typography>
              <IconButton onClick={toggle} size="small">
                {mode === 'dark' ? <WbSunnyRounded /> : <DarkModeRounded />}
              </IconButton>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} mb={2}>
              {auth.isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/my-bookings"
                    startIcon={<PeopleAltOutlined />}
                    variant="contained"
                    fullWidth
                  >
                    My Bookings
                  </Button>
                  <Button
                    onClick={auth.logout}
                    startIcon={<LogoutOutlined />}
                    fullWidth
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    startIcon={<LoginOutlined />}
                    variant="contained"
                    fullWidth
                  >
                    Login / Sign Up
                  </Button>
                  <Button
                    component={Link}
                    to="/find-booking"
                    startIcon={<SearchOutlined />}
                    fullWidth
                  >
                    Find Booking
                  </Button>
                </>
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Upcoming Shuttles
            </Typography>
            <List disablePadding>
              {events.map((ev) => (
                <motion.div layoutId={`card-${ev._id}`} key={ev._id}>
                  <ListItemButton
                    selected={activeEvent?._id === ev._id}
                    onClick={() => setActiveEvent(ev)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-selected': { backgroundColor: 'rgba(25,144,190,0.12)' },
                    }}
                  >
                    <Box width="100%">
                      <Typography fontWeight={700}>{ev.name}</Typography>
                      <Stack direction="row" spacing={1} color="text.secondary">
                        <CalendarMonthOutlined fontSize="small" />
                        <Typography variant="caption">
                          {new Date(ev.date).toLocaleDateString()}
                        </Typography>
                        <PlaceOutlined fontSize="small" />
                        <Typography variant="caption">{ev.location}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Chip label={`$${ev.price}`} color="primary" size="small" />
                        <Chip
                          label={`${ev.seats - ev.bookedSeats.length} left`}
                          size="small"
                          color={ev.seats - ev.bookedSeats.length > 0 ? 'success' : 'default'}
                        />
                      </Stack>
                    </Box>
                  </ListItemButton>
                </motion.div>
              ))}
            </List>
          </GlassCard>
        </Grid>

        {/* Map & Detail */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <GlassCard sx={{ p: 0, overflow: 'hidden' }}>
              <Box p={2}>
                <Typography variant="h5" fontWeight={800}>
                  Live Shuttle Map
                </Typography>
              </Box>
              <Box height={420}>
                <Map activeEvent={activeEvent} shuttleLocations={shuttleLocations} />
              </Box>
            </GlassCard>

            <AnimatePresence>
              {activeEvent && (
                <motion.div
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                >
                  <GlassCard>
                    <Typography variant="h6" fontWeight={800} mb={1}>
                      {activeEvent.name}
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                      {[
                        { label: 'Departs', value: new Date(activeEvent.date).toLocaleString() },
                        { label: 'From', value: activeEvent.location },
                        {
                          label: 'Price',
                          value: `$${activeEvent.price} per seat`,
                        },
                        {
                          label: 'Available',
                          value: `${activeEvent.seats - activeEvent.bookedSeats.length} / ${activeEvent.seats}`,
                        },
                      ].map((info) => (
                        <Grid item xs={6} sm={3} key={info.label}>
                          <Typography variant="caption" color="text.secondary">
                            {info.label}
                          </Typography>
                          <Typography variant="body2">{info.value}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Join us for a comfortable and scenic shuttle ride. Book your seat now to guarantee your spot!
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button variant="contained" onClick={() => startBooking(activeEvent, false)}>
                        Book & Save to Profile
                      </Button>
                      <Button variant="outlined" onClick={() => startBooking(activeEvent, true)}>
                        Continue as Guest
                      </Button>
                    </Stack>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Grid>
      </Grid>

      <AnimatePresence>
        {bookingFlow.event && (
          <SeatSelector
            event={bookingFlow.event}
            isGuest={bookingFlow.isGuest}
            onClose={() => setBookingFlow({ event: null, isGuest: false })}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}

function Map({
  activeEvent,
  shuttleLocations,
}: {
  activeEvent: Event | null;
  shuttleLocations: ShuttleLocations;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!activeEvent?.lat || !activeEvent?.destLat) return;
    const svc = new window.google.maps.DirectionsService();
    svc.route(
      {
        origin: { lat: activeEvent.lat, lng: activeEvent.lng },
        destination: { lat: activeEvent.destLat, lng: activeEvent.destLng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === 'OK') setDirections(res);
      }
    );
  }, [activeEvent]);

  if (!isLoaded)
    return (
      <Box height="100%" display="grid" placeItems="center">
        <CircularProgress />
      </Box>
    );

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={
        activeEvent
          ? { lat: activeEvent.lat, lng: activeEvent.lng }
          : { lat: 40.7128, lng: -74.006 }
      }
      zoom={7}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#3b82f6', strokeWeight: 5 } }}
        />
      )}
      {activeEvent && <MarkerF position={{ lat: activeEvent.lat, lng: activeEvent.lng }} />}
      {activeEvent && <MarkerF position={{ lat: activeEvent.destLat, lng: activeEvent.destLng }} />}
      {shuttleLocations[activeEvent?._id || ''] && (
        <MarkerF position={shuttleLocations[activeEvent._id]} icon={{ url: 'bus.png' }} />
      )}
    </GoogleMap>
  );
}
