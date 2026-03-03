import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from './models/admin.js';
import Event from './models/Event.js';
import Booking from './models/Booking.js';
import authMiddleware from './middleware/authMiddleware.js';
import adminAuthMiddleware from './middleware/adminAuthMiddleware.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// --- Metrics Endpoint ---
router.get('/metrics', adminAuthMiddleware, async (_req, res) => {
  try {
    const events = await Event.find();
    const bookings = await Booking.find().populate('event');

    let totalRevenue = 0;
    let totalSeatsBooked = 0;
    let totalSeatsAvailable = 0;

    // Calculate Seats from Events
    events.forEach(event => {
      totalSeatsAvailable += event.seats;
      totalSeatsBooked += event.bookedSeats.length;
    });

    // Calculate Revenue from Bookings
    const revenueByEventMap: Record<string, { eventName: string, revenue: number, bookings: number }> = {};

    bookings.forEach((booking: any) => {
      if (!booking.event) return;
      const eventPrice = booking.event.price || 0;
      const bookingRevenue = booking.seats.length * eventPrice;
      totalRevenue += bookingRevenue;

      const eventId = booking.event._id.toString();
      if (!revenueByEventMap[eventId]) {
        revenueByEventMap[eventId] = { eventName: booking.event.name, revenue: 0, bookings: 0 };
      }
      revenueByEventMap[eventId].revenue += bookingRevenue;
      revenueByEventMap[eventId].bookings += 1;
    });

    const revenueByEvent = Object.values(revenueByEventMap);
    const fillRate = totalSeatsAvailable === 0 ? 0 : Math.round((totalSeatsBooked / totalSeatsAvailable) * 100);

    res.json({
      totalBookings: bookings.length,
      totalRevenue,
      totalSeatsAvailable,
      totalSeatsBooked,
      fillRate,
      revenueByEvent
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// CRUD OPERATIONS
router.post('/events', authMiddleware, async (req: Request, res: Response) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});
router.put('/events/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});
router.delete('/events/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

export default router;