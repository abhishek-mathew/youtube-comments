import express from "express";
import bodyParser from "body-parser";
import commentsRoutes from "./routes/comments";
import videosRoutes from "./routes/videos";

const app = express();

app.use(bodyParser.json());

app.use("/comments", commentsRoutes);
app.use("/videos", videosRoutes);

export default app;
