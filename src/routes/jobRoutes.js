import express from "express";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getAllJobs,
} from "../controllers/jobController.js";

const router = express.Router();

// Public route - Anyone can search jobs
router.get("/", getAllJobs);

router.post("/", protect, authorize("employer"), createJob);
router.get("/my-jobs", protect, authorize("employer"), getMyJobs);
router.put("/:id", protect, authorize("employer"), updateJob);
router.delete("/:id", protect, authorize("employer"), deleteJob);

export default router;
