import express from "express";
import axios from "axios";

const router = express.Router();

// Web search using DuckDuckGo API
router.get("/", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${query}&format=json`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Web search failed" });
  }
});

export default router;
