import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import reminderRoutes from "./routes/reminders.js";
import calendarRoutes from "./routes/calendar.js";
import webSearchRoutes from "./routes/webSearch.js";

dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/reminders", reminderRoutes);
app.use("/calendar", calendarRoutes);
app.use("/websearch", webSearchRoutes);

// Main chatbot route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    let botMessage = "";

    // Recognize basic commands first
    if (message.toLowerCase().includes("add reminder")) {
      botMessage = "I can add reminders for you! Just say something like: 'Remind me to call mom at 5 PM'.";
    } else if (message.toLowerCase().includes("what's my schedule")) {
      botMessage = "I can fetch your Google Calendar events. Try asking: 'Show my meetings for today'.";
    } else {
      // Use OpenAI for general conversation
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });

      botMessage = response.choices[0].message.content || "I'm not sure how to respond to that.";
    }

    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
