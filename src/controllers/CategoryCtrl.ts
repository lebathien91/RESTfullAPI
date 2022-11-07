import { Request, Response } from "express";
import Categories from "../models/categoryModles";
import { featureAPI } from "../utils/features";
import { IReqAuth } from "../utils/interface";

const CategoryCtrl = class {
  // Method: POST
  // Route: /category/create
  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      const newCategory = new Categories({
        name,
        description,
      });

      await newCategory.save();

      res.json({ success: "Create Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PUT
  // Route: /category/:id
  async update(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const category = await Categories.findOneAndUpdate({ _id: id }, req.body);

      if (!category)
        return res.status(400).json({ error: "Invalid Category." });

      res.json({ success: "Update Success", category });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /category
  async find(req: Request, res: Response) {
    try {
      const features = new featureAPI(
        Categories.find({ deleted: null }),
        req.query
      )
        .filtering()
        .searching()
        .populated()
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Categories.find({ deleted: null }),
        req.query
      )
        .filtering()
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const categories =
        results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Categories Success", categories, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /category/:slug
  async findBySlug(req: IReqAuth, res: Response) {
    try {
      const category = await Categories.findOne({
        slug: req.params.slug,
        deleted: null,
      });

      if (!category)
        return res.status(400).json({ error: "Invalid Category." });

      res.json({ success: "Find Category Success", category });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /category/:id
  async findById(req: IReqAuth, res: Response) {
    try {
      const category = await Categories.findById({
        _id: req.params.id,
        deleted: null,
      });
      if (!category)
        return res.status(400).json({ error: "Invalid Category." });

      res.json({ success: "Find Category Success", category });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /category/trash
  async trash(req: Request, res: Response) {
    try {
      const features = new featureAPI(
        Categories.where("deleted").ne(null),
        req.query
      )
        .filtering()
        .populated()
        .searching()
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Categories.where("deleted").ne(null),
        req.query
      )
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const categories =
        results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Categories Success", categories, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /category/:id
  async delete(req: IReqAuth, res: Response) {
    try {
      const id = req.params.id;
      const date = new Date();

      const category = await Categories.findOneAndUpdate(
        { _id: id, user: req.user?._id },
        { deleted: date }
      );

      if (!category) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Delete Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /category
  async deleteMany(req: Request, res: Response) {
    try {
      const ids = req.body;
      const date = new Date();
      const results = await Categories.updateMany(
        { _id: { $in: ids } },
        { deleted: date }
      );

      if (!results) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Delete Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /category/restore/:id
  async restore(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const category = await Categories.findOneAndUpdate(
        { _id: id },
        { deleted: null }
      );

      if (!category) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Restore Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /category/restore
  async restoreMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Categories.updateMany(
        { _id: { $in: ids } },
        { deleted: null }
      );

      if (!results) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Restore Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /category/:id
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Categories.findByIdAndDelete({ _id: id });

      if (!category) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Delete Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /article
  async destroyMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Categories.deleteMany({ _id: { $in: ids } });

      if (!results) return res.status(400).json({ error: "Invalid Category" });

      res.json({ success: "Delete Category Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default new CategoryCtrl();
