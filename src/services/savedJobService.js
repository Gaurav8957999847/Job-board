import savedJobRepository from "../repositories/savedJobRepository.js";
import jobRepository from "../repositories/jobRepository.js";

class SavedJobService {
  async saveJob(userId, jobId) {
    // Check if job exists
    const job = await jobRepository.findById(jobId); // ← Fixed: using correct method
    if (!job) {
      throw new Error("Job not found");
    }

    const alreadySaved = await savedJobRepository.isJobSaved(userId, jobId);
    if (alreadySaved) throw new Error("Job already saved");

    return await savedJobRepository.saveJob(userId, jobId);
  }

  async unsaveJob(userId, jobId) {
    return await savedJobRepository.unsaveJob(userId, jobId);
  }

  async getSavedJobs(userId) {
    return await savedJobRepository.getSavedJobs(userId);
  }
}

export default new SavedJobService();
