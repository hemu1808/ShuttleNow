"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const qrcode_1 = __importDefault(require("qrcode"));
const Event_js_1 = __importDefault(require("./models/Event.js"));
const Booking_js_1 = __importDefault(require("./models/Booking.js"));
const userAuthMiddleware_js_1 = __importDefault(require("./middleware/userAuthMiddleware.js"));
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
}
const stripe = new stripe_1.default(STRIPE_SECRET_KEY);
const router = express_1.default.Router();
// --- Logged-in User Routes ---
router.get('/my-bookings', userAuthMiddleware_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const bookings = yield Booking_js_1.default.find({ user: req.user.id }).populate('event').sort({ bookedAt: -1 });
        res.json(bookings);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
router.post('/create-stripe-session', userAuthMiddleware_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { eventId, selectedSeats } = req.body;
    try {
        const event = yield Event_js_1.default.findById(eventId);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        // Final validation check before payment
        const isUnavailable = selectedSeats.some((seat) => event.bookedSeats.includes(seat));
        if (isUnavailable)
            return res.status(409).json({ message: 'One or more selected seats are no longer available.' });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price_data: { currency: 'usd', product_data: { name: `${event.name} Ticket` }, unit_amount: event.price * 100 }, quantity: selectedSeats.length }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/`,
            metadata: { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, eventId, seats: selectedSeats.join(','), isGuest: 'false' }
        });
        res.json({ url: session.url });
    }
    catch (err) {
        res.status(500).json({ message: 'Could not create Stripe session' });
    }
}));
// --- Guest Routes ---
router.post('/guest/create-stripe-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, selectedSeats, phone } = req.body;
    if (!phone)
        return res.status(400).json({ message: 'Phone number is required for guest checkout.' });
    try {
        const event = yield Event_js_1.default.findById(eventId);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        // Final validation check before payment
        const isUnavailable = selectedSeats.some((seat) => event.bookedSeats.includes(seat));
        if (isUnavailable)
            return res.status(409).json({ message: 'One or more selected seats are no longer available.' });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price_data: { currency: 'usd', product_data: { name: `${event.name} Ticket` }, unit_amount: event.price * 100 }, quantity: selectedSeats.length }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/`,
            metadata: { guestPhone: phone, eventId, seats: selectedSeats.join(','), isGuest: 'true' }
        });
        res.json({ url: session.url });
    }
    catch (err) {
        res.status(500).json({ message: 'Could not create guest Stripe session' });
    }
}));
router.post('/find-by-phone', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield Booking_js_1.default.find({ guestPhone: req.body.phone }).populate('event').sort({ bookedAt: -1 });
        if (!bookings.length)
            return res.status(404).json({ message: 'No bookings found for this phone number.' });
        res.json(bookings);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
// --- Universal Confirmation Route ---
router.post('/confirm-booking', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    try {
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== 'paid')
            return res.status(400).json({ message: 'Payment not successful' });
        const existingBooking = yield Booking_js_1.default.findOne({ bookingId: session.id });
        if (existingBooking)
            return res.status(200).json({ booking: existingBooking });
        const metadata = session.metadata;
        if (!metadata) {
            return res.status(400).json({ message: 'Session metadata not found.' });
        }
        const { eventId, seats, userId, guestPhone, isGuest } = metadata;
        const seatArray = seats.split(',').map(Number);
        yield Event_js_1.default.findByIdAndUpdate(eventId, { $push: { bookedSeats: { $each: seatArray } } });
        const bookingData = Object.assign({ event: eventId, seats: seatArray, bookingId: session.id }, (isGuest === 'true' ? { guestPhone } : { user: userId }));
        const newBooking = new Booking_js_1.default(bookingData);
        newBooking.qrCode = yield qrcode_1.default.toDataURL(newBooking._id.toString());
        yield newBooking.save();
        res.status(201).json({ booking: newBooking });
    }
    catch (err) {
        res.status(500).json({ message: 'Booking confirmation failed.' });
    }
}));
exports.default = router;
