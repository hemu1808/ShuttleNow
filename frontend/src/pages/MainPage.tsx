import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    MarkerF,
    DirectionsRenderer,
    PolylineF,
} from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '../contexts/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, ShuttleLocations } from '../hooks/hooks';
import SeatSelector from '../components/SeatSelector';
import { Event } from '../types/types';

import {
    Box,
    Typography,
    Button,
    Stack,
    List,
    ListItemButton,
    Chip,
    Grid,
} from '@mui/material';
import GlassCard from '../components/GlassCard';
import {
    CalendarMonthOutlined,
    PlaceOutlined,
    AccessTime,
    AttachMoney,
    EventSeat,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];


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
    const { mode } = useColorMode();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!activeEvent && events.length) setActiveEvent(events[0]);
    }, [events, activeEvent]);

    const startBooking = (event: Event, guest: boolean) => {
        if (!auth.isAuthenticated && !guest) return navigate('/login');
        setBookingFlow({ event, isGuest: guest });
    };

    const filteredEvents = events.filter((ev) =>
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box position="relative" height="calc(100vh - 96px)" width="100%" overflow="hidden">
            {/* Background Map layer */}
            <Box position="absolute" top={-96} left={0} right={0} bottom={0} zIndex={0}>
                <Map
                    events={events}
                    activeEvent={activeEvent}
                    setActiveEvent={setActiveEvent}
                    shuttleLocations={shuttleLocations}
                    mode={mode}
                />
            </Box>

            {/* Floating Content layer */}
            <Box position="relative" zIndex={10} px={{ xs: 2, md: 4 }} py={2} height="100%" sx={{ pointerEvents: 'none' }}>
                <Grid container spacing={4} sx={{ height: '100%' }}>
                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: '100%', pointerEvents: 'auto' }}>
                        <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: { xs: 2.5, md: 3 } }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" fontWeight={900} mb={1} sx={{
                                    background: mode === 'light' ? 'linear-gradient(45deg, #2563eb, #3b82f6)' : 'linear-gradient(45deg, #2dd4bf, #0ea5e9)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Explore
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    Find the perfect shuttle route for your journey.
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3, position: 'relative' }}>
                                <SearchIcon sx={{ position: 'absolute', top: 12, left: 14, color: 'text.secondary', fontSize: 20 }} />
                                <Box
                                    component="input"
                                    placeholder="Search destinations..."
                                    value={searchQuery}
                                    onChange={(e: any) => setSearchQuery(e.target.value)}
                                    sx={{
                                        width: '100%',
                                        p: 1.5,
                                        pl: 5,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                        bgcolor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                        color: 'text.primary',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s ease',
                                        '&:focus': {
                                            borderColor: mode === 'light' ? '#3b82f6' : '#2dd4bf',
                                            boxShadow: mode === 'light' ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : '0 0 0 3px rgba(45, 212, 191, 0.2)',
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1,
                                '&::-webkit-scrollbar': { width: '6px' },
                                '&::-webkit-scrollbar-track': { background: 'transparent' },
                                '&::-webkit-scrollbar-thumb': { background: 'rgba(150,150,150,0.3)', borderRadius: '10px' }
                            }}>
                                <List disablePadding>
                                    {filteredEvents.map((ev, index) => {
                                        const isActive = activeEvent?._id === ev._id;
                                        const seatsLeft = ev.seats - (ev.bookedSeats?.length || 0);
                                        return (
                                            <motion.div
                                                layoutId={`card-${ev._id}`}
                                                key={ev._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.8, 0.25, 1] }}
                                            >
                                                <ListItemButton
                                                    selected={isActive}
                                                    onClick={() => setActiveEvent(ev)}
                                                    sx={{
                                                        borderRadius: 1,
                                                        mb: 1.5,
                                                        p: 1.5,
                                                        border: '1px solid',
                                                        borderColor: isActive
                                                            ? (mode === 'light' ? '#3b82f6' : '#2dd4bf')
                                                            : 'transparent',
                                                        bgcolor: isActive
                                                            ? (mode === 'light' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(45, 212, 191, 0.1)')
                                                            : (mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)'),
                                                        boxShadow: isActive ? (mode === 'light' ? '0 8px 24px rgba(59,130,246,0.15)' : '0 8px 24px rgba(45,212,191,0.15)') : 'none',
                                                        '&:hover': {
                                                            bgcolor: mode === 'light' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.05)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: mode === 'light' ? '0 12px 28px rgba(0,0,0,0.05)' : '0 12px 28px rgba(0,0,0,0.3)',
                                                        },
                                                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="active-indicator"
                                                            style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: 0,
                                                                bottom: 0,
                                                                width: '4px',
                                                                background: mode === 'light' ? '#3b82f6' : '#2dd4bf',
                                                                borderTopRightRadius: '4px',
                                                                borderBottomRightRadius: '4px'
                                                            }}
                                                        />
                                                    )}
                                                    <Box width="100%">
                                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                                                            <Typography fontWeight={800} sx={{ fontSize: '1.05rem', lineHeight: 1.2 }}>{ev.name}</Typography>
                                                            <Typography fontWeight={900} color={mode === 'light' ? 'primary.main' : '#2dd4bf'} sx={{ fontSize: '1.1rem' }}>${ev.price}</Typography>
                                                        </Stack>

                                                        <Stack direction="row" spacing={1} color="text.secondary" alignItems="center" mb={1.5}>
                                                            <Typography variant="caption" fontWeight={700} noWrap>{ev.location}</Typography>
                                                            <Box component="span" sx={{ fontSize: '0.8rem', opacity: 0.5 }}>&rarr;</Box>
                                                            <Typography variant="caption" fontWeight={700} noWrap>{ev.destinationName || 'Dropoff'}</Typography>
                                                        </Stack>

                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Stack direction="row" spacing={0.5} color="text.secondary" alignItems="center" sx={{ maxWidth: '60%' }}>
                                                                <CalendarMonthOutlined sx={{ fontSize: 16 }} />
                                                                <Typography variant="caption" fontWeight={500}>
                                                                    {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                                </Typography>
                                                            </Stack>

                                                            <Chip
                                                                label={`${seatsLeft} seats`}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    fontSize: '0.7rem',
                                                                    borderRadius: 2,
                                                                    bgcolor: seatsLeft > 0
                                                                        ? (mode === 'light' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.2)')
                                                                        : 'rgba(239, 68, 68, 0.1)',
                                                                    color: seatsLeft > 0
                                                                        ? (mode === 'light' ? '#059669' : '#34d399')
                                                                        : '#ef4444'
                                                                }}
                                                            />
                                                        </Stack>
                                                    </Box>
                                                </ListItemButton>
                                            </motion.div>
                                        );
                                    })}
                                    {filteredEvents.length === 0 && (
                                        <Typography color="text.secondary" variant="body2" textAlign="center" mt={4}>
                                            No routes found matching your search.
                                        </Typography>
                                    )}
                                </List>
                            </Box>
                        </GlassCard>
                    </Grid>

                    {/* Details floating panel */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} offset={{ md: 2, lg: 5 }} sx={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 2 }}>
                        <Stack spacing={3}>
                            <AnimatePresence>
                                {activeEvent && (
                                    <motion.div
                                        layoutId={`context-${activeEvent._id}`}
                                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    >
                                        <GlassCard sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                                            {/* Decorative gradient orb */}
                                            <Box sx={{
                                                position: 'absolute',
                                                top: -50,
                                                right: -50,
                                                width: 150,
                                                height: 150,
                                                borderRadius: '50%',
                                                background: mode === 'light' ? 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)' : 'radial-gradient(circle, rgba(45,212,191,0.2) 0%, rgba(0,0,0,0) 70%)',
                                                zIndex: 0,
                                                pointerEvents: 'none'
                                            }} />

                                            <Box position="relative" zIndex={1}>
                                                <Typography variant="h4" fontWeight={900} mb={1} sx={{ letterSpacing: -0.5 }}>
                                                    {activeEvent.name}
                                                </Typography>

                                                <Grid container spacing={2} mb={4} mt={1}>
                                                    {[
                                                        { icon: <AccessTime fontSize="small" color="primary" />, label: 'Departure', value: new Date(activeEvent.date).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) },
                                                        { icon: <PlaceOutlined fontSize="small" color="primary" />, label: 'Travel Route', value: `${activeEvent.location} → ${activeEvent.destinationName || 'Dropoff'}` },
                                                        { icon: <AttachMoney fontSize="small" color="primary" />, label: 'Price per Seat', value: `$${activeEvent.price}` },
                                                        { icon: <EventSeat fontSize="small" color="primary" />, label: 'Availability', value: `${activeEvent.seats - (activeEvent.bookedSeats?.length || 0)} / ${activeEvent.seats} Seats` },
                                                    ].map((info) => (
                                                        <Grid size={{ xs: 6 }} key={info.label}>
                                                            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                                                <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: mode === 'light' ? 'rgba(59,130,246,0.1)' : 'rgba(45,212,191,0.1)' }}>
                                                                    {React.cloneElement(info.icon as React.ReactElement, { color: mode === 'light' ? 'primary' : 'inherit', sx: { color: mode === 'light' ? '#3b82f6' : '#2dd4bf' } })}
                                                                </Box>
                                                                <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={700} letterSpacing={0.5}>
                                                                    {info.label}
                                                                </Typography>
                                                            </Stack>
                                                            <Typography variant="body1" fontWeight={700}>{info.value}</Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>

                                                <Typography variant="body2" color="text.secondary" mb={4} lineHeight={1.6}>
                                                    Join us for a comfortable and scenic shuttle ride beautifully mapped out for your convenience. Reserve your seat and view live shuttle tracking!
                                                </Typography>

                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        onClick={() => startBooking(activeEvent, false)}
                                                        sx={{
                                                            flex: 1,
                                                            borderRadius: 3,
                                                            py: 1.5,
                                                            fontWeight: 800,
                                                            backgroundImage: mode === 'light' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                                                            boxShadow: mode === 'light' ? '0 8px 20px rgba(59, 130, 246, 0.4)' : '0 8px 20px rgba(45, 212, 191, 0.4)',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: mode === 'light' ? '0 12px 24px rgba(59, 130, 246, 0.5)' : '0 12px 24px rgba(45, 212, 191, 0.5)',
                                                            }
                                                        }}
                                                    >
                                                        Book & Save
                                                    </Button>
                                                    {!auth.isAuthenticated && (
                                                        <Button
                                                            variant="outlined"
                                                            size="large"
                                                            onClick={() => startBooking(activeEvent, true)}
                                                            sx={{
                                                                flex: 1,
                                                                borderRadius: 3,
                                                                py: 1.5,
                                                                fontWeight: 800,
                                                                borderWidth: '2px',
                                                                '&:hover': { borderWidth: '2px', bgcolor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }
                                                            }}
                                                        >
                                                            Guest Checkout
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </GlassCard>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Stack>
                    </Grid>
                </Grid>

                <AnimatePresence>
                    {bookingFlow.event && (
                        <Box sx={{ pointerEvents: 'auto' }}>
                            <SeatSelector
                                event={bookingFlow.event}
                                isGuest={bookingFlow.isGuest}
                                onClose={() => setBookingFlow({ event: null, isGuest: false })}
                            />
                        </Box>
                    )}
                </AnimatePresence>
            </Box>
        </Box>
    );
}

function Map({
    events,
    activeEvent,
    setActiveEvent,
    shuttleLocations,
    mode,
}: {
    events: Event[];
    activeEvent: Event | null;
    setActiveEvent: (event: Event) => void;
    shuttleLocations: ShuttleLocations;
    mode: 'light' | 'dark';
}) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    });
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        const svc = new window.google.maps.DirectionsService();

        // Specific requested default constraint: NYC to Boston
        const origin = activeEvent?.lat && activeEvent?.lng
            ? { lat: activeEvent.lat, lng: activeEvent.lng }
            : { lat: 40.7128, lng: -74.0060 }; // NYC

        const destination = activeEvent?.destLat && activeEvent?.destLng
            ? { lat: activeEvent.destLat as number, lng: activeEvent.destLng as number }
            : { lat: 42.3601, lng: -71.0589 }; // Boston

        svc.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (res, status) => {
                if (status === 'OK') {
                    setDirections(res);
                }
            }
        );
    }, [activeEvent, isLoaded]);

    if (loadError) return null;
    if (!isLoaded) return null;

    return (
        <Box position="relative" height="100%">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={
                    activeEvent && activeEvent.lat ? { lat: activeEvent.lat, lng: activeEvent.lng }
                        : { lat: 40.7128, lng: -74.006 }
                }
                zoom={activeEvent ? 10 : 7}
                options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    styles: mode === 'light' ? undefined : darkMapStyle
                }}
            >
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: mode === 'light' ? '#3b82f6' : '#2dd4bf',
                                strokeWeight: 4,
                                strokeOpacity: 0.9
                            }
                        }}
                    />
                )}

                {/* Draw direct paths for all routes to guarantee visibility */}
                {events.map((ev) => {
                    const isActive = activeEvent?._id === ev._id;
                    const hasDestination = ev.destLat && ev.destLng;
                    if (!hasDestination) return null;

                    // Don't draw straight line if we successfully loaded turn-by-turn directions for active one
                    if (isActive && directions) return null;

                    return (
                        <PolylineF
                            key={`path-${ev._id}`}
                            path={[
                                { lat: ev.lat, lng: ev.lng },
                                { lat: ev.destLat as number, lng: ev.destLng as number }
                            ]}
                            options={{
                                strokeColor: isActive ? (mode === 'light' ? '#3b82f6' : '#2dd4bf') : (mode === 'light' ? '#94a3b8' : '#475569'),
                                strokeWeight: isActive ? 4 : 2,
                                strokeOpacity: isActive ? 0.9 : 0.4,
                                geodesic: true,
                            }}
                        />
                    );
                })}

                {/* Render markers for all available routes to ensure they are visible */}
                {events.map((ev) => (
                    <MarkerF
                        key={ev._id}
                        position={{ lat: ev.lat, lng: ev.lng }}
                        onClick={() => setActiveEvent(ev)}
                        icon={
                            activeEvent?._id === ev._id
                                ? { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' } // active
                                : { url: mode === 'light' ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' } // others
                        }
                    />
                ))}

                {activeEvent?.destLat && activeEvent?.destLng && <MarkerF position={{ lat: activeEvent.destLat as number, lng: activeEvent.destLng as number }} />}

                {activeEvent && shuttleLocations[activeEvent._id] && (
                    <MarkerF position={shuttleLocations[activeEvent._id]} icon={{ url: 'bus.png' }} />
                )}
            </GoogleMap>
        </Box>
    );
}
