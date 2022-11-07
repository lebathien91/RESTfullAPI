import { Request, Response } from "express";
import { IReqAuth } from "../utils/interface";
import Pages from "../models/pageModles";
import { featureAPI } from "../utils/features";

const PageCtrl = class {
  // Method: POST
  // Route: /page/create
  async create(req: IReqAuth, res: Response) {
    try {
      const { title, descripton, content } = req.body;

      const newPage = new Pages({
        title,
        descripton,
        content,
      });

      await newPage.save();

      res.json({ success: "Create Page Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PUT
  // Route: /page/:id
  async update(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const page = await Pages.findOneAndUpdate({ _id: id }, req.body);

      if (!page) return res.status(400).json({ error: "Invalid page." });

      res.json({ success: "Update Success", page });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /page
  async find(req: Request, res: Response) {
    try {
      const features = new featureAPI(Pages.find({ deleted: null }), req.query)
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Pages.find({ deleted: null }),
        req.query
      ).counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const pages = results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Pages Success", pages, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /page/:slug
  async findBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const page = await Pages.findOne({ slug, deleted: null });
      if (!page) return res.status(400).json({ error: "Invalid Page." });

      res.json({ success: "Find Page Success", page });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /page/:id
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const page = await Pages.findById({ _id: id });
      if (!page) return res.status(400).json({ error: "Invalid Page." });

      res.json({ success: "Find Page Success", page });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /page/trash
  async trash(req: Request, res: Response) {
    try {
      const features = new featureAPI(
        Pages.where("deleted").ne(null),
        req.query
      )
        .searching()
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Pages.where("deleted").ne(null),
        req.query
      )
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const pages = results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Pages Success", pages, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /page/:id
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const date = new Date();
      const page = await Pages.findOneAndUpdate({ _id: id }, { deleted: date });

      if (!page) return res.status(400).json({ error: "Invalid Page" });

      res.json({ success: "Delete Page Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /page
  async deleteMany(req: Request, res: Response) {
    try {
      const ids = req.body;
      const date = new Date();
      const results = await Pages.updateMany(
        { _id: { $in: ids } },
        { deleted: date }
      );

      if (!results) return res.status(400).json({ error: "Invalid Page" });

      res.json({ success: "Delete Page Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /page/restore/:id
  async restore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = await Pages.findOneAndUpdate({ _id: id }, { deleted: null });

      if (!page) return res.status(400).json({ error: "Invalid Page" });

      res.json({ success: "Restore Page Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /page
  async restoreMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Pages.updateMany(
        { _id: { $in: ids } },
        { deleted: null }
      );

      if (!results) return res.status(400).json({ error: "Invalid Page" });

      res.json({ success: "Restore Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /page/:id
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const page = await Pages.findByIdAndDelete({ _id: id });

      if (!page) return res.status(400).json({ error: "Invalid Page" });

      res.json({ success: "Delete Page Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /page
  async destroyMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const page = await Pages.deleteMany({ _id: { $in: ids } });

      if (!page) return res.status(400).json({ error: "Invalid Page" });

      res.json({ success: "Destroy Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default new PageCtrl();
