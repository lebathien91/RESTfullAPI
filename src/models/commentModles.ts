import mongoose from "mongoose";
import { IComment } from "../utils/interface";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    articleId: {
      type: mongoose.Types.ObjectId,
      ref: "article",
    },
    articleUserId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      maxLength: [1000, "Name không dài quá 1000 ký tự."],
      required: true,
      trim: true,
    },
    replyComment: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comment",
      },
    ],
    replyUser: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    commentRoot: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
    deleted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ content: "text" });

const Comments = mongoose.model<IComment>("comment", commentSchema);

Comments.createIndexes({ name: "text" });

export default Comments;
