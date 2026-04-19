import applicationService from "../services/applicationService.js";

// this is the controller for the applcant for applying the job
const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const resumeUrl = req.file ? req.file.path : null; // for future Cloudinary

    const application = await applicationService.applytoJob(
      req.user.id,
      jobId,
      resumeUrl,
      coverLetter,
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// this is the controller for the applicant to get all their applications and the details of the job they applied for
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(
      req.user.id,
    );
    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

//this is for the employer to get all the applications for a job they posted and the details of the applicant who applied for the job
const getJobApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsForJob(
      req.params.jobId,
      req.user.id,
    );
    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export { applyToJob, getMyApplications, getJobApplications };
