import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

interface AuthRequest extends Request {
    user?: any;
}

const adminAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No admin token provided, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        // Verify this is actually an admin token
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(403).json({ message: 'Authorization denied: Not an admin token' });
        }

        req.user = decoded; // we attach the admin ID payload to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Admin Token is not valid' });
    }
};

export default adminAuthMiddleware;
