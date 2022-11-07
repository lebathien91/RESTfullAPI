import { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  root: boolean;
  aboutMe: string;
  deleted?: string;
  _doc: object;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  deleted?: string;
  _doc: object;
}

export interface ITag extends Document {
  category: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  deleted?: string;
  _doc: object;
}

export interface IArticle extends Document {
  user: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  deleted?: string;
  _doc: object;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  deleted?: string;
  _doc: object;
}

export interface IComment extends Document {
  user: string;
  articleId: string;
  articleUserId: string;
  content: string;
  replyComment: string[];
  replyUser: string;
  commentRoot: string;
  deleted?: string;
  _doc: object;
}

export interface IReqAuth extends Request {
  user?: IUser;
}

export interface IDecodedToken {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  iat: number;
  exp: number;
}
