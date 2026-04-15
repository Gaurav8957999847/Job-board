//This handles business logic of the authentication.

import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import companyRepository from "../repositories/companyRepository.js";

class AuthService {
  async register(userData) {
    const {
      name,
      email,
      password,
      role,
      companyName,
      description,
      website,
      location,
    } = userData;

    //check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exist with this email");
    }

    //create the user
    const user = await userRepository.createUser({
      name,
      email,
      password,
      role: role || "user", // if the role is not provided it will store person as the user
    });

    //if the employer creates the company as well
    let company = null;
    if (role === "employer") {
      if (!companyName) {
        throw new Error("Company name is required for employer role");
      }
      company = await companyRepository.create({
        user: user._id,
        companyName,
        description: description || "",
        website: website || "",
        location: location || "",
      });
    }

    //create the token if the user is registered
    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: company
        ? {
            id: company._id,
            companyName: company.companyName,
          }
        : null,
      token,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    //generating the token if the user is logged in successfully
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
  //instance to generate the token for the user when they register or login
  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
  }
}

//exporting an instance of the class os that we can use it in the controllers without creating a new instance every time 
export default new AuthService();