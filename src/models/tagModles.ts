import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
import { ITag } from "../utils/interface";

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const tagSchema = new Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    name: {
      type: String,
      maxLength: [100, "Name không dài quá 100 ký tự."],
      trim: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [600, "Description không dài quá 600 ký tự"],
    },
    thumbnail: {
      type: String,
      default: "/banner.jpg",
    },
    deleted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

tagSchema.index({ name: "text" });

const Tags = mongoose.model<ITag>("tag", tagSchema);

Tags.createIndexes({ name: "text" });

export default Tags;
