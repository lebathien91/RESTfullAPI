import express from "express";
import ArticleCtrl from "../controllers/ArticleCtrl";
import { auth, isEditor, isAdmin, isRoot } from "../middleware/auth";

const router = express.Router();

router.post("/article/create", auth, ArticleCtrl.create);

router.get("/article/trash", auth, isEditor, ArticleCtrl.trash);

router.patch("/article/restore/:id", auth, isEditor, ArticleCtrl.restore);
router.patch("/article/restore", auth, isEditor, ArticleCtrl.restoreMany);

router.get("/article/slug/:slug", ArticleCtrl.findBySlug);

router
  .route("/article/:id")
  .get(ArticleCtrl.findById)
  .put(auth, ArticleCtrl.update)
  .patch(auth, ArticleCtrl.delete)
  .delete(auth, isAdmin, ArticleCtrl.destroy);

router
  .route("/article")
  .get(ArticleCtrl.find)
  .patch(auth, isEditor, ArticleCtrl.deleteMany)
  .delete(auth, isAdmin, ArticleCtrl.destroyMany);

export default router;
