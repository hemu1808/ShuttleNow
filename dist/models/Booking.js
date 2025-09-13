"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const BookingSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // No longer required
    guestPhone: { type: String }, // NEW: For guest bookings
    seats: { type: [Number], required: true },
    bookingId: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now },
});
// Ensure that a booking has either a user or a guest phone number
BookingSchema.pre('validate', function (next) {
    if (!this.user && !this.guestPhone) {
        next(new Error('A booking must be associated with a user or a guest phone number.'));
    }
    else {
        next();
    }
});
const Booking = mongoose_1.default.model('Booking', BookingSchema);
exports.default = Booking;
