import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server listening on PORT:" + PORT);
  connectDB();
});
