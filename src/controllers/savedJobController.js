import savedJobRepository from "../repositories/savedJobRepository.js";
import savedJobService from "../services/savedJobService.js";
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    await savedJobService.saveJob(req.user.id, jobId);
    res.status(201).json({
      success: true,
      message: "Job saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    await savedJobService.unsaveJob(req.user.id, jobId);
    res.status(200).json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (error) {
    next(error);
  }
};

const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await savedJobService.getSavedJobs(req.user.id);
    res.status(200).json({
      success: true,
      count : savedJobs.length,
      data: savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

export {saveJob, unsaveJob, getSavedJobs};