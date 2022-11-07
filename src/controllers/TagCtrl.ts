import { Request, Response } from "express";
import Tags from "../models/tagModles";
import { IReqAuth } from "../utils/interface";
import { featureAPI } from "../utils/features";

const TagCtrl = class {
  // Method: POST
  // Route: /tag/create
  async create(req: IReqAuth, res: Response) {
    try {
      const { category, name, description, thumbnail } = req.body;

      const newTag = new Tags({
        category,
        name,
        description,
        thumbnail,
      });

      await newTag.save();

      res.json({ success: "Create Tag Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PUT
  // Route: /tag/:id
  async update(req: IReqAuth, res: Response) {
    const id = req.params.id;
    try {
      const tag = await Tags.findOneAndUpdate({ _id: id }, req.body);

      if (!tag) return res.status(400).json({ error: "Invalid Tag." });

      res.json({ success: "Update Success", tag });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /tag
  async find(req: IReqAuth, res: Response) {
    try {
      const features = new featureAPI(Tags.find({ deleted: null }), req.query)
        .filtering()
        .searching()
        .populated()
        .sorting()
        .paginating();

      const counting = new featureAPI(Tags.find({ deleted: null }), req.query)
        .filtering()
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const tags = results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Success", tags, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /tag/trash
  async trash(req: IReqAuth, res: Response) {
    try {
      const features = new featureAPI(Tags.where("deleted").ne(null), req.query)
        .filtering()
        .populated()
        .searching()
        .sorting()
        .paginating();

      const counting = new featureAPI(Tags.where("deleted").ne(null), req.query)
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const tags = results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Success", tags, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /tag/:slug
  async findBySlug(req: IReqAuth, res: Response) {
    try {
      const populate = req.query.populate as string;

      const tag = await Tags.findOne({
        slug: req.params.slug,
        deleted: null,
      }).populate(populate);

      if (!tag) return res.status(400).json({ error: "Invalid Tag." });

      res.json({ success: "Find Tag Success", tag });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /tag/:id
  async findById(req: IReqAuth, res: Response) {
    try {
      const populate = req.query.populate as string;

      const tag = await Tags.findById({
        _id: req.params.id,
        deleted: null,
      }).populate(populate);
      if (!tag) return res.status(400).json({ error: "Invalid Tag." });

      res.json({ success: "Find Tag Success", tag });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /tag/:id
  async delete(req: IReqAuth, res: Response) {
    try {
      const { id } = req.params;
      const date = new Date();
      const tag = await Tags.findOneAndUpdate({ _id: id }, { deleted: date });

      if (!tag) return res.status(400).json({ error: "Invalid Tag" });

      res.json({ success: "Delete Tag Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /tag
  async deleteMany(req: IReqAuth, res: Response) {
    try {
      const ids = req.body;
      const date = new Date();
      const tag = await Tags.updateMany(
        { _id: { $in: ids } },
        { deleted: date }
      );

      if (!tag) return res.status(400).json({ error: "Invalid Tag" });

      res.json({ success: "Delete Tag Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /tag/restore/:id
  async restore(req: IReqAuth, res: Response) {
    try {
      const { id } = req.params;
      const tag = await Tags.findOneAndUpdate({ _id: id }, { deleted: null });

      if (!tag) return res.status(400).json({ error: "Invalid Tag" });

      res.json({ success: "Restore Tag Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /tag
  async restoreMany(req: IReqAuth, res: Response) {
    try {
      const ids = req.body;
      const tag = await Tags.updateMany(
        { _id: { $in: ids } },
        { deleted: null }
      );

      if (!tag) return res.status(400).json({ error: "Invalid Tag" });

      res.json({ success: "Restore Tag Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /tag/:id
  async destroy(req: IReqAuth, res: Response) {
    try {
      const { id } = req.params;

      const tag = await Tags.findByIdAndDelete({ _id: id });

      if (!tag) return res.status(400).json({ error: "Invalid Tag" });

      res.json({ success: "Delete Tag Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /tag
  async destroyMany(req: IReqAuth, res: Response) {
    try {
      const ids = req.body;
      console.log(ids);
      const results = await Tags.deleteMany({ _id: { $in: ids } });

      if (!results) return res.status(400).json({ error: "Invalid Article" });

      res.json({ success: "Destroy Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default new TagCtrl();
