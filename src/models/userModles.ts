import mongoose from "mongoose";
import { IUser } from "../utils/interface";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
      maxLength: [25, "Your name is up to 25 chars long."],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      trim: true,
      unique: true,
      maxLength: [60, "Your name is up to 60 chars long."],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Please add your password"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "editor", "admin"],
    },
    root: {
      type: Boolean,
      default: false,
    },
    aboutMe: {
      type: String,
      trim: true,
      maxLength: [250, "Your name is up to 250 chars long."],
    },
    deleted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: "text" });

const Users = mongoose.model<IUser>("user", userSchema);

Users.createIndexes({ name: "text" });

export default Users;
