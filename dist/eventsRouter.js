var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Event from "./models/Event.js";
const router = express.Router();
let io;
export const setSocketInstance = (socketInstance) => {
    io = socketInstance;
};
// GET all events (Public)
router.get("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event.find().sort({ date: 1 });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: "Server error while fetching events.", error: error.message });
    }
}));
export default router;
