import Job from "../models/Job.js";

class JobRepository {
  async create(jobData) {
    return await Job.create(jobData);
  }

  async findById(id) {
    return await Job.findById(id)
      .populate("company", "companyName location")
      .populate("postedBy", "name email");
  }

  async findByPostedBy(postedBy) {
    return await Job.find({ postedBy })
      .populate("company", "companyName")
      .sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("company", "companyName");
  }

  async delete(id) {
    return await Job.findByIdAndDelete(id);
  }

  //for faster search using the quuery params that we will be using for filtering and sorting the jobs. We will be using the text index for the title and description fields to enable full-text search capabilities. We will also be indexing the location, salary, skills, postedBy, company and status fields to optimize the queries that filter or sort by these fields.
  async searchJobs(query, page = 1, limit = 10, sortBy = 'createdAt') {
    const {
      search,
      location,
      minSalary,
      maxSalary,
      skills,
      experienceLevel,
      jobType,
    } = query;

    //using the filter
    let filter = {status : 'open'};

    //Text search
    if(search){
      filter.$text = { $search: search };
    }

    //Location filter(search for location with regex for partial match and case insensitive)
    if(location){
      filter.location = { $regex:location,$options:'i'};
    }

    //salary filter
    if (minSalary || maxSalary) {
      filter["salary.min"] = {};
      if (minSalary) filter["salary.min"].$gte = Number(minSalary);
      if (maxSalary) filter["salary.min"].$lte = Number(maxSalary);
    }

    //skills filter (search for jobs that require any of the skills in the array)
    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillArray };
    }

    //Experience level filter
    if(experienceLevel){
      filter.experienceLevel = experienceLevel;
    }

    //job type filter
    if(jobType){
      filter.jobType = jobType;
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .populate("company", "companyName location")
      .sort(sortBy === "salary" ? { "salary.min": -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(limit);

    
    const total = await Job.countDocuments(filter);

   return {
     jobs,
     pagination: {
       total,
       page,
       limit,
       totalPages: Math.ceil(total / limit),
     },
   };
  }
}

//  Export INSTANCE so that we can use the same instance of the repository across the application and avoid creating multiple instances which can lead to issues with database connections and performance.
export default new JobRepository();
