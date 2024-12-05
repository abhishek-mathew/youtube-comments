import express from "express";
import { client } from "../db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Fetch videos
router.get("/", async (_req, res) => {
  const query = "SELECT * FROM videos";
  const videos = await client.execute(query);
  res.json(videos.rows);
});

// Add a video (for testing purposes)
router.post("/", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description)
    return res
      .status(400)
      .json({ error: "title and description are required" });

  const query =
    "INSERT INTO videos (video_id, title, description, created_at) VALUES (?, ?, ?, toTimestamp(now()))";
  await client.execute(query, [uuidv4(), title, description]);

  res.status(201).json({ message: "Video added successfully!" });
});

export default router;
