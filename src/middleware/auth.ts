import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { IReqAuth, IDecodedToken } from "../utils/interface";

import Users from "../models/userModles";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  const accessToken = req.header("Authorization");

  if (!accessToken)
    return res.status(401).json({ error: "Access token not found" });

  try {
    const decode = <IDecodedToken>(
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    );

    if (!decode)
      return res.status(400).json({ error: "Access token not found" });

    const user = await Users.findById({ _id: decode.id }).select("-password");

    if (!user) return res.status(400).json({ error: "Invalid Authentication" });

    req.user = user;

    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

const isEditor = (req: IReqAuth, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (role === "editor" || role === "admin" || req.user?.root) {
    return next();
  } else {
    return res.status(403).json({ error: "Permission denied." });
  }
};

const isAdmin = (req: IReqAuth, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (role === "admin" || req.user?.root) {
    return next();
  } else {
    return res.status(403).json({ error: "Permission denied." });
  }
};

const isRoot = (req: IReqAuth, res: Response, next: NextFunction) => {
  const root = req.user?.root;

  if (!root) return res.status(403).json({ error: "Permission denied." });

  next();
};

export { auth, isEditor, isAdmin, isRoot };
