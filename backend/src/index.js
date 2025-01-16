import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; // parse
import cors from "cors";
import bodyParser from "body-parser";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Payload too large. Please reduce the size of your request.",
    });
  }
  next(err);
});
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // allow cors from client url
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("server listening on PORT:" + PORT);
  connectDB();
});
