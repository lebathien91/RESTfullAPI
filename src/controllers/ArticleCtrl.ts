import { Request, Response } from "express";
import { IReqAuth } from "../utils/interface";
import Articles from "../models/articleModles";
import { featureAPI } from "../utils/features";

const ArticleCtrl = class {
  // Method: POST
  // Route: /article/create
  async create(req: IReqAuth, res: Response) {
    try {
      const { tag, title, description, content } = req.body;

      const newArticle = new Articles({
        user: req.user?._id,
        tag,
        title,
        description,
        content,
      });

      await newArticle.save();

      res.json({ success: "Create Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PUT
  // Route: /article/:id
  async update(req: IReqAuth, res: Response) {
    try {
      if (req.user?.role === "editor" || req.user?.role === "admin") {
        const article = await Articles.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );

        if (!article)
          return res.status(400).json({ error: "Invalid Article." });

        res.json({ success: "Update Success", article });
      } else {
        const article = await Articles.findOneAndUpdate(
          { _id: req.params.id, user: req.user?._id },
          req.body
        );

        if (!article)
          return res
            .status(400)
            .json({ error: "Permission denied or Invalid Article." });

        res.json({ success: "Update Success", article });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /article
  async find(req: Request, res: Response) {
    try {
      const features = new featureAPI(
        Articles.find({ deleted: null }),
        req.query
      )
        .filtering()
        .searching()
        .populated()
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Articles.find({ deleted: null }),
        req.query
      )
        .filtering()
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const articles =
        results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Articles Success", articles, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /article/:slug
  async findBySlug(req: Request, res: Response) {
    const populate = req.query.populate as string;
    try {
      const article = await Articles.findOne({
        slug: req.params.slug,
        deleted: null,
      }).populate(populate);
      if (!article) return res.status(400).json({ error: "Invalid Article." });

      res.json({ success: "Find Article Success", article });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /article/:id
  async findById(req: IReqAuth, res: Response) {
    const populate = req.query.populate as string;
    try {
      const article = await Articles.findById({
        _id: req.params.id,
        deleted: null,
      }).populate(populate);
      if (!article) return res.status(400).json({ error: "Invalid Article." });

      res.json({ success: "Find Article Success", article });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: GET
  // Route: /article/trash
  async trash(req: Request, res: Response) {
    try {
      const features = new featureAPI(
        Articles.where("deleted").ne(null),
        req.query
      )
        .filtering()
        .populated()
        .searching()
        .sorting()
        .paginating();

      const counting = new featureAPI(
        Articles.where("deleted").ne(null),
        req.query
      )
        .searching()
        .counting();

      const results = await Promise.allSettled([
        features.query,
        counting.query,
      ]);

      const articles =
        results[0].status === "fulfilled" ? results[0].value : [];
      const count = results[1].status === "fulfilled" ? results[1].value : 0;

      res.json({ success: "Find Articles Success", articles, count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /article/:id
  async delete(req: IReqAuth, res: Response) {
    try {
      const id = req.params.id;
      const date = new Date();

      if (
        req.user?.role === "editor" ||
        req.user?.role === "admin" ||
        req.user.root
      ) {
        const article = await Articles.findOneAndUpdate(
          { _id: id },
          { deleted: date }
        );

        if (!article) return res.status(400).json({ error: "Invalid Article" });

        res.json({ success: "Delete Article Success" });
      } else {
        const article = await Articles.findOneAndUpdate(
          { _id: id, user: req.user?._id },
          { deleted: date }
        );

        if (!article) return res.status(400).json({ error: "Invalid Article" });

        res.json({ success: "Delete Article Success" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /article
  async deleteMany(req: Request, res: Response) {
    try {
      const ids = req.body;
      const date = new Date();
      const results = await Articles.updateMany(
        { _id: { $in: ids } },
        { deleted: date }
      );

      if (!results) return res.status(400).json({ error: "Invalid Article" });

      res.json({ success: "Delete Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /article/restore/:id
  async restore(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const article = await Articles.findOneAndUpdate(
        { _id: id },
        { deleted: null }
      );

      if (!article) return res.status(400).json({ error: "Invalid Article" });

      res.json({ success: "Restore Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: PATCH
  // Route: /article/restore
  async restoreMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Articles.updateMany(
        { _id: { $in: ids } },
        { deleted: null }
      );

      if (!results) return res.status(400).json({ error: "Invalid Article" });

      res.json({ success: "Restore Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /article/:id
  async destroy(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const article = await Articles.findByIdAndDelete({ _id: id });

      if (!article) return res.status(400).json({ error: "Invalid Article" });

      res.json({ success: "Delete Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method: DELETE
  // Route: /article
  async destroyMany(req: Request, res: Response) {
    try {
      const ids = req.body;

      const results = await Articles.deleteMany({ _id: { $in: ids } });

      if (!results) return res.status(400).json({ error: "Invalid Article" });

      res.json({ success: "Delete Article Success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default new ArticleCtrl();
