//This will handle the data operations related to users, such as creating a new user, finding a user by email,
import User from "../models/user.js";

//creating the class so that we can use it in the controllers
class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id).select("-password");
  }
}
//exporting an instance of the class so that we can use it in the controllers without creating a new instance every time
export default new UserRepository(); 