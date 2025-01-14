import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; // parse
import cors from "cors";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // allow cors from client url
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("server listening on PORT:" + PORT);
  connectDB();
});
