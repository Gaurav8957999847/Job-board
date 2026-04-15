import authService from "../services/authService.js";

const register = async (req, res, next) => {
  try {
    //getting the data from the request body
    const {
      name,
      email,
      password,
      role,
      companyName,
      description,
      website,
      location,
    } = req.body;
    
    //Validating the required fields
    if(!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    //if the user is the employer and there is no company name provided, return an error
    if(role === "employer" && !companyName) {
      return res.status(400).json({ message: "Company name is required for employer role" });
    }

    const result = await authService.register({
      name,
      email,
      password,
      role,
      companyName,
      description,
      website,
      location,
    });

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

//Login controller
const login = async(req,res,next) => {
  try {
    const { email, password } = req.body;
    //this is the basic validation for the email and password
    if(!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      ...result,
    }); 

  } catch (error) {
    next(error);
  }
}

// this is the controller to get the current user data from the token, we will use this in the frontend to get the user data after login or register
const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,   // id + role from JWT
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, getCurrentUser };


