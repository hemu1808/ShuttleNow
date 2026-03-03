import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;
    try {
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Name is required.' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'A user with this email already exists.' });

        user = new User({ name, email, phone, password });
        await user.save();

        const payload = { user: { id: user.id } };
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
        res.status(201).json({ token });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error during registration. Please try again later.' });
    }
});

// Login a user
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Current User Profile
router.get('/me', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

        const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };
        const user = await User.findById(decoded.user.id).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err: any) {
        console.error(err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// Update Current User Profile
router.put('/profile', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

        const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };

        const { name, email, phone } = req.body;

        // Ensure email isn't already taken by someone else
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== decoded.user.id) {
                return res.status(400).json({ message: 'Email is already in use by another account' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.user.id,
            { name, email, phone },
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

// Update Password
router.put('/password', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

        const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(decoded.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

        // Save will auto-trigger the pre-save hook to hash the new password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error updating password' });
    }
});

export default router;