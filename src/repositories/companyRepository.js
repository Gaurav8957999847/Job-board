// this will handle all the data operations related to companies, such as creating a new company, finding a company by name, etc.
import Company from "../models/Company.js";

class CompanyRepository {
  async create(companyData) {
    return await Company.create(companyData);
  }

  async findByUserId(userId) { 
    return await Company.findOne({ user: userId });
  }
}
//exporting the instance of the class so that we can use it in the controller without creating all the new controller all the time 
export default new CompanyRepository();