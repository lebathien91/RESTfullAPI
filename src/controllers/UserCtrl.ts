import bcrypt from "bcrypt";
import { Request, Response } from "express";

import Users from "../models/userModles";
import { featureAPI } from "../utils/features";
import { IReqAuth } from "../utils/interface";

const UsersCtrl = class {
  // Method: POST
  // Route: /tag/create
  async create(req: Request, res: Response) {
    try {
      const { username, email, password, avatar, role, root } = req.body;

      const hashPassword = await bcrypt.hash(password, 12);

      const newUser = new Users({
        username,
        email,
        password: hashPassword,
        avatar: avatar,
        role,
        root,
      });

      await newUser.save();

      res.json({ success: "Create User Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PUT
  // Route: /tag/:id
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, password, cf_password, role, avatar, aboutMe } =
        req.body;

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: "Mật khẩu ít nhấp 6 ký tự" });
        }

        if (password !== cf_password) {
          return res
            .status(400)
            .json({ error: "Mật khẩu nhập lại không khớp" });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const updateUser = await Users.findOneAndUpdate(
          { _id: id },
          { username, password: hashPassword, role, avatar, aboutMe }
        );

        if (!updateUser) return res.status(400).json({ error: "Invalid User" });

        res.json({
          success: "Update Success",
          user: {
            username: updateUser.username,
            email: updateUser.email,
            role: updateUser.role,
            avatar: updateUser.avatar,
            aboutMe: updateUser.aboutMe,
            root: updateUser.root,
          },
        });
      } else {
        const updateUser = await Users.findOneAndUpdate(
          { _id: id },
          { username, role, avatar, aboutMe }
        );

        if (!updateUser) return res.status(400).json({ error: "Invalid User" });

        res.json({
          success: "Update Success",
          user: {
            username: updateUser.username,
            email: updateUser.email,
            role: updateUser.role,
            avatar: updateUser.avatar,
            aboutMe: updateUser.aboutMe,
            root: updateUser.root,
          },
        });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /user
  async find(req: Request, res: Response) {
    try {
      const features = new featureAPI(Users.find({ deleted: null }), req.query)
        .filtering()
        .searching()
        .populated()
        .sorting()
        .paginating();

      const counting = new featureAPI(Users.find({ deleted: null }), req.query)
        .filtering()
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const users = results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Users Success", users, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /user/:id
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await Users.findById({ _id: id, deleted: null }).select(
        "-password"
      );
      if (!user) return res.status(400).json({ error: "Invalid User." });

      res.json({ success: "Find User Success", user });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /user/trash
  async trash(req: Request, res: Response) {
    try {
      const features = new featureAPI(
        Users.where("deleted").ne(null),
        req.query
      )
        .filtering()
        .populated()
        .searching()
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Users.where("deleted").ne(null),
        req.query
      )
        .filtering()
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const users = results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Users Success", users, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /user/:id
  async delete(req: IReqAuth, res: Response) {
    try {
      const id = req.params.id;
      const date = new Date();

      if (req.user?.role === "admin") {
        const user = await Users.findOneAndUpdate(
          { _id: id, root: false },
          { deleted: date }
        );

        if (!user) return res.status(400).json({ error: "Invalid User" });

        res.json({ success: "Delete User Success" });
      } else {
        const user = await Users.findOneAndUpdate(
          { _id: id, user: req.user?._id },
          { deleted: date }
        );

        if (!user) return res.status(400).json({ error: "Invalid User" });

        res.json({ success: "Delete User Success" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /user
  async deleteMany(req: Request, res: Response) {
    try {
      const ids = req.body;
      const date = new Date();
      const results = await Users.updateMany(
        { _id: { $in: ids }, root: false },
        { deleted: date }
      );

      if (!results) return res.status(400).json({ error: "Invalid User" });

      res.json({ success: "Delete User Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /user/restore/:id
  async restore(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await Users.findOneAndUpdate({ _id: id }, { deleted: null });

      if (!user) return res.status(400).json({ error: "Invalid User" });

      res.json({ success: "Restore User Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /user/restore
  async restoreMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Users.updateMany(
        { _id: { $in: ids } },
        { deleted: null }
      );

      if (!results) return res.status(400).json({ error: "Invalid User" });

      res.json({ success: "Restore User Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /user/:id
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await Users.findOneAndDelete({ _id: id, root: false });

      if (!user) return res.status(400).json({ error: "Invalid User." });

      res.json({ success: "Delete Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /user
  async destroyMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Users.deleteMany({
        _id: { $in: ids },
        root: false,
      });

      if (!results) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Delete Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default new UsersCtrl();
