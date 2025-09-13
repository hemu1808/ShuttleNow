import { useState, useEffect } from 'react';
import api from './api';
import { socket } from './socket';
import { Event } from './types';

interface ShuttleLocation {
  lat: number;
  lng: number;
}

export interface ShuttleLocations {
  [eventId: string]: ShuttleLocation;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [shuttleLocations, setShuttleLocations] = useState<ShuttleLocations>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get<Event[]>('/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    

    fetchEvents();

    const onUpdateSeats = (updatedEvents: Event[]) => setEvents(updatedEvents);
    const onAllShuttleLocations = (locations: ShuttleLocations) => setShuttleLocations(locations);
    const onShuttleLocationUpdate = (data: { eventId: string; lat: number; lng: number }) => {
      setShuttleLocations(prev => ({ ...prev, [data.eventId]: { lat: data.lat, lng: data.lng } }));
    };

    socket.on("update-seats", onUpdateSeats);
    socket.on('all-shuttle-locations', onAllShuttleLocations);
    socket.on('shuttle-location-update', onShuttleLocationUpdate);

    return () => {
      socket.off("update-seats", onUpdateSeats);
      socket.off('all-shuttle-locations', onAllShuttleLocations);
      socket.off('shuttle-location-update', onShuttleLocationUpdate);
    };
  }, []);

  return { events, shuttleLocations };
}