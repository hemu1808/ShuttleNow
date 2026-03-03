import { useState, useEffect } from 'react';
import { Event } from '../types/types';

// Define the type for the shuttle location map
export interface ShuttleLocations {
  [eventId: string]: { lat: number; lng: number };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [shuttleLocations, setShuttleLocations] = useState<ShuttleLocations>({});

  useEffect(() => {
    // Simulated API fetch - Replace this with your real backend call later
    const fetchEvents = async () => {
      // Mock Data matching your interface needs
      const mockEvents: Event[] = [
        {
          _id: '1',
          name: 'NYC to Boston Express',
          date: new Date('2025-01-15T08:00:00').toISOString(),
          location: 'Penn Station, NY',
          price: 45,
          seats: 40,
          bookedSeats: ['u1', 'u2', 'u3'], // Mock user IDs
          lat: 40.750568,
          lng: -73.993519,
          destLat: 42.3601, // Boston
          destLng: -71.0589,
          description: 'Direct shuttle from NYC to Boston. WiFi included.',
        },
        {
          _id: '2',
          name: 'Downtown to Airport',
          date: new Date('2025-01-16T10:30:00').toISOString(),
          location: 'Union Square, SF',
          price: 25,
          seats: 20,
          bookedSeats: [],
          lat: 37.7879,
          lng: -122.4075,
          destLat: 37.6213, // SFO Airport
          destLng: -122.3790,
          description: 'Fast connection to SFO terminals.',
        },
        {
          _id: '3',
          name: 'Campus Loop A',
          date: new Date('2025-01-17T09:00:00').toISOString(),
          location: 'Main Gate',
          price: 5,
          seats: 50,
          bookedSeats: ['u5', 'u6'],
          lat: 34.0689,
          lng: -118.4452, // UCLA area example
          destLat: 34.0522,
          destLng: -118.2437, // Downtown LA
          description: 'Regular campus connector shuttle.',
        }
      ];

      setEvents(mockEvents);

      // Initialize mock shuttle locations
      const initialLocations: ShuttleLocations = {};
      mockEvents.forEach(ev => {
        // Start the bus slightly offset from the origin for visual demo
        initialLocations[ev._id] = { 
          lat: ev.lat + 0.001, 
          lng: ev.lng + 0.001 
        };
      });
      setShuttleLocations(initialLocations);
    };

    fetchEvents();

    // Optional: Simulate live movement updates
    const interval = setInterval(() => {
      setShuttleLocations(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          // Move slightly
          next[key] = {
            lat: next[key].lat + (Math.random() - 0.5) * 0.0001,
            lng: next[key].lng + (Math.random() - 0.5) * 0.0001,
          };
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { events, shuttleLocations };
}