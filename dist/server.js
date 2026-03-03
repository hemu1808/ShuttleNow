import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
// --- Route Imports ---
import eventRoutes, { setSocketInstance } from "./eventsRouter.js";
import adminRouter from './adminRouter.js';
import authRouter from './authRouter.js';
import bookingRouter from './bookingRouter.js';
// --- Setup ---
const app = express();
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
    console.error("❌ CLIENT_URL is not defined in environment variables.");
    process.exit(1);
}
const corsOptions = {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
const io = new Server(server, { cors: corsOptions });
app.use(cors(corsOptions));
app.use(express.json());
// --- Routes ---
setSocketInstance(io);
app.use("/", eventRoutes); // Public event fetching
app.use('/api/auth', authRouter); // User login/register
app.use('/api/bookings', bookingRouter); // Booking actions
app.use('/api/admin', adminRouter); // Admin actions
const shuttleLocations = {};
io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);
    socket.emit('all-shuttle-locations', shuttleLocations);
    socket.on("lock-seat", (data) => socket.broadcast.emit("seat-is-now-locked", data));
    socket.on("unlock-seat", (data) => socket.broadcast.emit("seat-is-now-unlocked", data));
    socket.on('update-shuttle-location', (data) => {
        shuttleLocations[data.eventId] = { lat: data.lat, lng: data.lng };
        io.emit('shuttle-location-update', data);
    });
    socket.on("disconnect", () => console.log(`🔌 User disconnected: ${socket.id}`));
});
// --- Server Startup ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    process.exit(1);
}
mongoose.connect(MONGO_URI)
    .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
})
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
