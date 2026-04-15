import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (prevents DDoS attacks by limiting the number of requests from a single IP 100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// Connect to Database
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Job Board API is running... (ES Modules)" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
