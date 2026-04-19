import express from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getAllJobs,
} from "../controllers/jobController.js";
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
} from "../controllers/applicationController.js";
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../controllers/savedJobController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// Auto-create uploads folder
const uploadDir = path.join(process.cwd(), "uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Uploads folder created automatically");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// Public route
router.get("/", getAllJobs);

// Protected routes
router.use(protect);

// User routes
router.post(
  "/:jobId/apply",
  authorize("user"),
  upload.single("resume"),
  applyToJob,
);
router.get("/my-applications", authorize("user"), getMyApplications);

// Saved Jobs Routes (for User)
router.post("/:jobId/save", authorize("user"), saveJob);
router.delete("/:jobId/save", authorize("user"), unsaveJob);
router.get("/saved", authorize("user"), getSavedJobs);

// Employer routes
router.get("/:jobId/applications", authorize("employer"), getJobApplications);

// Employer job management
router.use(authorize("employer"));
router.post("/", createJob);
router.get("/my-jobs", getMyJobs);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
