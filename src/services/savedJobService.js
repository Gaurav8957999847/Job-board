import savedJobRepository from "../repositories/savedJobRepository";
import jobRepository from "../repositories/jobRepository";

class SavedJobService {
  async saveJob(userId, jobId) {
    try {
      const job = await jobRepository.getJobById(jobId);
      if (!job) {
        throw new Error("Job not found");
      }
      // this is for checking if the job is already in the databasee or not to preven the duplicate save by the user
      const alreadySaved = await savedJobRepository.isJobSaved(userId, jobId);
      if (alreadySaved) throw new Error("Job already saved");

      return await savedJobRepository.saveJob(userId, jobId);
    } catch (error) {
      throw new Error("Error saving job");
    }
  }

  async unsaveJob(userId, jobId) {
    try {
      const result = await savedJobRepository.unsaveJob(userId, jobId);
      if (!result) throw new Error("Job was not saved");
      return result;
    } catch (error) {
      throw (error);
    }
  }

  async getSavedJobs(userId){
    try {
      return await savedJobRepository.getSavedJobs(userId);
    } catch (error) {
      throw(error);
    }
  }
};

//export instance of the class to be used in the controllers
export default new SavedJobService();
