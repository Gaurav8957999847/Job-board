// this is the business logic layer it will call the daata access layer to get the data and then it will return the data to the controller
import applicationRepository from "../repositories/applicationRepository.js";
import jobRepository from "../repositories/jobRepository.js";

class ApplicationService {
  async applytoJob(userId, jobId, resumeUrl = null, coverLetter = "") {
    try {
      const job = await jobRepository.findById(jobId);
      //now checking if the job does not exist
      if (!job) {
        throw new Error("Job not found");
      }

      //checking if the user has already applied to the job
      const existingApplication = applicationRepository.findByJobAndApplicant(
        jobId,
        userId,
      );
      if (existingApplication) {
        throw new Error("You have already applied to this job");
      }

      // 3. Create application
      const application = await applicationRepository.create({
        job: jobId,
        applicant: userId,
        resume: resumeUrl,
        coverLetter,
      });

      return application;
    } catch (error) {
      throw new Error("Error applying to job: " + error.message);
    }
  }

  //get all the applications of the user
  async getMyApplications(userId) {
    try {
      const applications =
        await applicationRepository.getMyApplications(userId);
      return applications;
    } catch (error) {
      throw new Error("Error fetching applications: " + error.message);
    }
  }

  //get all the applications for a job posted by the employer
  async getApplicationsForJob(jobId, userId) {
    try {
      //only the employer who posted the job can see the applications for that job
      const job = await jobRepository.findById(jobId);
      if (!job || job.postedBy.toString() !== userId) {
        throw new Error("Job not found");
      }
      return await applicationRepository.getApplicationsForJob(jobId);
    } catch (error) {
      throw new Error("Error fetching applications: " + error.message);
    }
  }
}
//exporting the application service as a singleton instance
export default new ApplicationService();