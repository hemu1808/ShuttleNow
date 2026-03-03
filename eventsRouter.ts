import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import Event from "./models/Event.js";

const router = express.Router();

// GET all events (Public)
router.get("/events", async (_req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: "Server error while fetching events.", error: error.message });
  }
});

export default router;