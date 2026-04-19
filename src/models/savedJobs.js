import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true },
);

//preventing the duplicate save by the user
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

const SavedJob = mongoose.model("SavedJob", savedJobSchema);

export default SavedJob;


//indexing has two puropses: 
//1. to prevent the duplicate save by the user
//2. to improve the performance of the query when we want to find all the saved jobs of a user or all the users who saved a job.(by creating the lookup table)