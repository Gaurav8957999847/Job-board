import jobService from "../services/jobService.js";

const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getMyJobs(req.user.id);
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(
      req.user.id,
      req.params.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const result = await jobService.searchJobs(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export { createJob, getMyJobs, updateJob, deleteJob, getAllJobs };
