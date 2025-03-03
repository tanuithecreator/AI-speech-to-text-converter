import express from "express";
import Reminder from "../models/reminder.js";

const router = express.Router();

// Add a reminder
router.post("/add", async (req, res) => {
  const { title, date } = req.body;

  try {
    const newReminder = new Reminder({ title, date });
    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (error) {
    res.status(500).json({ error: "Failed to add reminder" });
  }
});

// Get all reminders
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

export default router;
