import SavedJob from "../models/savedJobs.js";

class SavedJobRepository {
  async saveJob(userId, jobId) {
    const savedJob = new SavedJob({
      user: userId,
      job: jobId,
    });
    return await savedJob.save();
  }

  async unsaveJob(userId, jobId) {
    const result = await SavedJob.findOneAndDelete({
      user: userId,
      job: jobId,
    });
    if (!result) {
      throw new Error("Saved job not found");
    }
    return result; // ← Fixed: No need for .remove()
  }

  async getSavedJobs(userId) {
    return await SavedJob.find({ user: userId })
      .populate({
        path: "job",
        populate: { path: "company", select: "companyName location" },
      })
      .sort({ createdAt: -1 });
  }

  async isJobSaved(userId, jobId) {
    const savedJob = await SavedJob.findOne({ user: userId, job: jobId });
    return !!savedJob;
  }
}

export default new SavedJobRepository();
