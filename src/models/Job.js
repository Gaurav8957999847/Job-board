import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: "INR" },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior"],
      required: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true },
);

// this is indexing for the job model to optimize the search queries based on the fields that we will be using for filtering and sorting the jobs. We will be using the text index for the title and description fields to enable full-text search capabilities. We will also be indexing the location, salary, skills, postedBy, company and status fields to optimize the queries that filter or sort by these fields.
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ "salary.min": 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ status: 1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
