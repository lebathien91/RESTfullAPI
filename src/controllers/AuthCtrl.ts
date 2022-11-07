import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { IDecodedToken, IReqAuth } from "../utils/interface";
import Users from "../models/userModles";

import {
  createAccessToken,
  createActivationToken,
  createRefreshToken,
} from "../utils/generateToken";
import sendEmail from "../utils/sendMail";

const AuthCtrl = class {
  // Method: GET
  // Route: /auth
  async accessToken(req: Request, res: Response) {
    try {
      const rf_token = req.header("Authorization");

      if (!rf_token)
        return res.status(400).json({ error: "Please login now!" });

      const decoded = <IDecodedToken>(
        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET)
      );

      if (!decoded)
        return res
          .status(400)
          .json({ error: "Your token is incorrect or has expired." });

      const user = await Users.findById(decoded.id);

      if (!user)
        return res.status(400).json({ error: "This account does not exist." });

      const accessToken = createAccessToken({ id: user._id });

      res.json({ accessToken, user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: POST
  // Route: /auth
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const check = await Users.findOne({ email });

      if (check)
        return res.status(400).json({ error: "This email already exists." });

      const hashPassword = await bcrypt.hash(password, 12);

      const newUser = { username, email, password: hashPassword };

      const activationToken = createActivationToken(newUser);

      const url = `${process.env.CLIENT_URL}/auth/activate/${activationToken}`;

      const result = await sendEmail(email, url);

      if (result)
        res.json({
          success: "Register Success! Please activate your email to start.",
        });

      res.status(400).json({ error: "Do not send email" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: POST
  // Route: /auth/activate
  async activateEmail(req: Request, res: Response) {
    try {
      const { activationToken } = req.body;
      const user = <IDecodedToken>(
        jwt.verify(activationToken, process.env.ACTIVATION_TOKEN_SECRET)
      );

      const { username, email, password } = user;
      const check = await Users.findOne({ email });

      if (check)
        return res.status(400).json({ error: "This email already exists." });

      const newUser = new Users({ username, email, password });

      await newUser.save();

      res.json({ success: "Account has been activated!" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: POST
  // Route: auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email }).select("+password");

      if (!user) return res.status(400).json({ error: "Invalid Email" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

      const accessToken = createAccessToken({ id: user._id });
      const refeshToken = createRefreshToken({ id: user._id });

      res.json({
        success: "Login Success",
        accessToken,
        refeshToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          root: user.root,
          aboutMe: user.aboutMe,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: POST
  // Route: /auth/activate
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await Users.findOne({ email });

      if (!user)
        return res.status(400).json({ error: "This email doest not exist." });

      const accessToken = createAccessToken({ id: user._id });

      const url = `${process.env.CLIENT_URL}/auth/forgot/${accessToken}`;

      sendEmail(email, url);
      res.json({ success: "Re-send the password, please check your email." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /auth
  async resetPassword(req: IReqAuth, res: Response) {
    try {
      const { password } = req.body;
      const hashPassword = await bcrypt.hash(password, 12);

      const result = await Users.findOneAndUpdate(
        { _id: req.user?._id },
        { password: hashPassword }
      );
      if (!result) return res.status(400).json({ error: "Invalid User" });

      res.json({ success: "Reset Password Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PUT
  // Route: /auth
  async update(req: IReqAuth, res: Response) {
    try {
      const { username, avatar, aboutMe } = req.body;
      const user = await Users.findOneAndUpdate(
        { _id: req.user?._id },
        { username, avatar, aboutMe }
      );

      if (!user) return res.status(400).json({ error: "Invalid User" });

      res.json({
        success: "Update Success",
        user,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default new AuthCtrl();
