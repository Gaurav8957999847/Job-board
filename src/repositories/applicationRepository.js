import Application from "../models/Application.js";

class ApplicationRepository {
  //creating the application and saving it to the database
  async create(applicationData) {
    try {
      const application = await Application.create(applicationData);
      return application;
    } catch (error) {
      throw new Error("Error creating application: " + error.message);
    }
  }
  //finding the application by job and applicant to prevent duplicate applications
  async findByJobAndApplicant(jobId, applicantId) {
    try {
      const application = await Application.find({
        jobId: jobId,
        applicantId: applicantId,
      });
      return application;
    } catch (error) {
      throw new Error("Error finding application: " + error.message);
    }
  }

  async getMyApplications(applicantId) {
    try {
      const applications = await Application.find({ applicant: applicantId })
        //Fetch job details for each application (title, company, location, salary)
        .populate("job", "title company location salary")
        .populate("job.company", "companyName")
        .sort({ appliedAt: -1 });
      return applications;
    } catch (error) {
      throw new Error("Error finding applications: " + error.message);
    }
  }

  async getApplicationsForJob(jobId) {
    try {
      const applications = await Application.find({ jobId })
        .populate("applicant", "name email")
        .sort({ appliedAt: -1 });
      return applications;
    } catch (error) {
      throw new Error("Error finding applications: " + error.message);
    }
  }
}

export default new ApplicationRepository();
