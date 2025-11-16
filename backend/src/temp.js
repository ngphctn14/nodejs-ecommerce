import mongoose from "mongoose";
import User from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const start = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);

    console.log("MongoDB Connected!");

    await User.updateMany({}, { $set: { loyaltyPoints: 0 } });

    console.log("Field added!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
