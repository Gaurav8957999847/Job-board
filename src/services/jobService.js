import jobRepository from "../repositories/jobRepository.js";
import companyRepository from "../repositories/companyRepository.js";

class JobService {
  async searchJobs(query) {
    const { page = 1, limit = 10, sortBy } = query;
    return await jobRepository.searchJobs(
      query,
      Number(page),
      Number(limit),
      sortBy,
    );
  }
  
  async createJob(userId, jobData) {
    // Only employer ca`n create job
    const company = await companyRepository.findByUserId(userId);
    if (!company) {
      throw new Error("Employer must have a company profile to post jobs");
    }

    const job = await jobRepository.create({
      ...jobData,
      postedBy: userId,
      company: company._id,
    });

    return job;
  }

  async getMyJobs(userId) {
    return await jobRepository.findByPostedBy(userId);
  }

  async updateJob(userId, jobId, updateData) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error("Job not found");
    if (job.postedBy.toString() !== userId) {
      throw new Error("You can only update your own jobs");
    }

    return await jobRepository.update(jobId, updateData);
  }

  async deleteJob(userId, jobId) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error("Job not found");
    if (job.postedBy.toString() !== userId) {
      throw new Error("You can only delete your own jobs");
    }

    return await jobRepository.delete(jobId);
  }
}

export default new JobService();
