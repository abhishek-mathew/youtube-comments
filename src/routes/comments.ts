import express from "express";
import { client } from "../db";
import { calculateScore } from "../utils";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Fetch comments
router.get("/", async (req, res) => {
  const { video_id, sort_by = "top" } = req.query;

  if (!video_id) return res.status(400).json({ error: "video_id is required" });

  const query = "SELECT * FROM comments WHERE video_id = ? ALLOW FILTERING";
  const comments = await client.execute(query, [video_id]);

  let commentsArray: any = {};
  for (const comment of comments.rows) {
    if (comment.parent_comment_id === null) {
      if (commentsArray[comment.comment_id.toString()]) {
        commentsArray[comment.comment_id.toString()] = {
          ...commentsArray[comment.comment_id.toString()],
          ...comment,
        };
      } else {
        commentsArray[comment.comment_id.toString()] = {
          ...comment,
          replies: [],
        };
      }
    } else {
      commentsArray[comment.parent_comment_id.toString()]?.replies.push(
        comment
      );
    }
  }

  let sortedComments = Object.values(commentsArray);

  if (sort_by === "new") {
    sortedComments.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else if (sort_by === "top") {
    sortedComments.sort(
      (a: any, b: any) =>
        calculateScore(b.likes_count, b.replies_count, b.created_at) -
        calculateScore(a.likes_count, a.replies_count, a.created_at)
    );
  }

  res.json(sortedComments);
});

// Add a comment
router.post("/", async (req, res) => {
  const { video_id, user_name, content, parent_comment_id } = req.body;

  if (!video_id || !user_name || !content)
    return res
      .status(400)
      .json({ error: "video_id, user_name, and content are required" });

  const query =
    "INSERT INTO comments (comment_id, parent_comment_id, video_id, user_name, content, likes_count, replies_count, created_at) VALUES (?, ?, ?, ?, ?, 0, 0, toTimestamp(now()))";
  await client.execute(query, [
    uuidv4(),
    parent_comment_id || null,
    video_id,
    user_name,
    content,
  ]);

  if (parent_comment_id) {
    const parent_comment_query = "SELECT * FROM comments WHERE comment_id = ?";
    const parent_comment = await client.execute(parent_comment_query, [
      parent_comment_id,
    ]);

    const update_replies_count = parent_comment.rows[0].replies_count
      ? parent_comment.rows[0].replies_count + 1
      : 1;

    const update_count_query = `UPDATE comments SET replies_count = ${update_replies_count} WHERE comment_id = ${parent_comment_id}`;

    await client.execute(update_count_query);
  }

  res.status(201).json({ message: "Comment added successfully!" });
});

// Like a comment
router.patch("/:comment_id/like", async (req, res) => {
  const { comment_id } = req.params;

  const comment_query = "SELECT * FROM comments WHERE comment_id = ?";
  const comment = await client.execute(comment_query, [comment_id]);

  const update_likes_count = comment.rows[0].likes_count
    ? comment.rows[0].likes_count + 1
    : 1;

  const query = `UPDATE comments SET likes_count = ${update_likes_count} WHERE comment_id = ?`;
  await client.execute(query, [comment_id]);

  res.json({ message: "Comment liked successfully!" });
});

export default router;
