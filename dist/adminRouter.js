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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_js_1 = __importDefault(require("./models/admin.js"));
const Event_js_1 = __importDefault(require("./models/Event.js"));
const authMiddleware_js_1 = __importDefault(require("./middleware/authMiddleware.js"));
const router = express_1.default.Router();
// Admin Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const admin = yield admin_js_1.default.findOne({ username });
        if (!admin)
            return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}));
// CRUD OPERATIONS
router.post('/events', authMiddleware_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEvent = new Event_js_1.default(req.body);
        yield newEvent.save();
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
}));
router.put('/events/:id', authMiddleware_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield Event_js_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent)
            return res.status(404).json({ message: 'Event not found' });
        res.json(updatedEvent);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
}));
router.delete('/events/:id', authMiddleware_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedEvent = yield Event_js_1.default.findByIdAndDelete(req.params.id);
        if (!deletedEvent)
            return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
}));
exports.default = router;
