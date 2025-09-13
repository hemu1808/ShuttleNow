"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// --- Route Imports ---
const eventsRouter_js_1 = __importStar(require("./eventsRouter.js"));
const adminRouter_js_1 = __importDefault(require("./adminRouter.js"));
const authRouter_js_1 = __importDefault(require("./authRouter.js"));
const bookingRouter_js_1 = __importDefault(require("./bookingRouter.js"));
// --- Setup ---
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
    console.error("❌ CLIENT_URL is not defined in environment variables.");
    process.exit(1);
}
const corsOptions = {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
const io = new socket_io_1.Server(server, { cors: corsOptions });
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// --- Routes ---
(0, eventsRouter_js_1.setSocketInstance)(io);
app.use("/", eventsRouter_js_1.default); // Public event fetching
app.use('/api/auth', authRouter_js_1.default); // User login/register
app.use('/api/bookings', bookingRouter_js_1.default); // Booking actions
app.use('/api/admin', adminRouter_js_1.default); // Admin actions
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
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
})
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
