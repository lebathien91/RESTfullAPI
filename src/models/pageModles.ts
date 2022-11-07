import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
import { IPage } from "../utils/interface";

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const pageSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: [100, "Name không dài quá 100 ký tự."],
      trim: true,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [600, "Description không dài quá 600 ký tự"],
    },
    content: {
      type: String,
      trim: true,
    },
    deleted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Pages = mongoose.model<IPage>("page", pageSchema);

export default Pages;
