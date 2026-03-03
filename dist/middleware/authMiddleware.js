import jwt from 'jsonwebtoken';
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader)
        return res.status(401).json({ message: 'No token, authorization denied' });
    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Token format is invalid' });
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};
export default authMiddleware;
