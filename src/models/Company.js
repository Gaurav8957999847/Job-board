import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // this is the refrence for the user who created the company profile
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // Cloudinary URL later
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);
export default Company;