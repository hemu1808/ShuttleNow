"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    // Origin
    location: { type: String, required: true },
    lat: { type: Number, required: true, default: 40.4406 }, // Pittsburgh Lat
    lng: { type: Number, required: true, default: -79.9959 }, // Pittsburgh Lng
    // Destination
    destinationName: { type: String, required: true, default: 'New York' },
    destinationLat: { type: Number, required: true, default: 40.7128 },
    destinationLng: { type: Number, required: true, default: -74.0060 },
    // Other details
    price: { type: Number, required: true },
    seats: { type: Number, required: true },
    bookedSeats: { type: [Number], default: [] },
});
const Event = mongoose_1.default.model('Event', eventSchema);
exports.default = Event;
