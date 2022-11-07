import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

import { IArticle } from "../utils/interface";

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    tag: {
      type: mongoose.Types.ObjectId,
      ref: "tag",
    },
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

// Add plugins
mongoose.plugin(slug);

articleSchema.index({ title: "text" });

const Articles = mongoose.model<IArticle>("article", articleSchema);

Articles.createIndexes({ name: "text" });

export default Articles;
