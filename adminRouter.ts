import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from './models/admin.js';
import Event from './models/Event.js';
import authMiddleware from './middleware/authMiddleware.js';

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
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
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