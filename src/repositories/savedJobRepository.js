import SavedJob from "../models/savedJobs.js";

class SavedJobRepository {
  // this will save the jobs
  async saveJob(userId, jobId) {
    try {
      const savedJob = new SavedJob({
        user: userId,
        job: jobId,
      });
      return await savedJob.save();
    } catch (error) {
      throw new Error("Error saving job");
    }
  }

  // this will unsave the jobs
  async unsaveJob(userId, jobId) {
    try {
      const result = await SavedJob.findOneAndDelete({
        user: userId,
        job: jobId,
      });
      if (!result) {
        throw new Error("Saved job not found");
      }
      return await result.remove();
    } catch (error) {
      throw new Error("Error un saving job");
    }
  }

  // this will get all the saved jobs of a user
  async getSavedJobs(userId) {
    try {
      return await SavedJob.find({ user: userId })
        .populate({
          path: "job",
          populate: { path: "company", select: "companyName location" },
        }) // this is the nested populate to get the company details along with the job details
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error("Error fetching saved jobs");
    }
  }

  // check if the job is already saved by the user
  async isJobSaved(userId, jobId) {
    try {
      const savedJob = await SavedJob.findOne({ user: userId, job: jobId });
      return !!savedJob; // this will return true if the job is saved and false if not
    } catch (error) {
      throw new Error("Error checking if job is saved");
    }
  }
}

// exorting the instance of the class to be used in the controllers
export default new SavedJobRepository();