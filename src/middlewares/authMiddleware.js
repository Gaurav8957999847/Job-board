import jwt from "jsonwebtoken";

//this is the protection middleware to protect the routes
const protect = (req,res,next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }  
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}
//we want for cetain routes to be only accessible by certain roles, so we create this middleware to check the role of the user
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized...`,
      });
    }
    next();
  };
};

export { protect, authorize };