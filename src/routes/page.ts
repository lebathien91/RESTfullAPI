import express from "express";
import PageCtrl from "../controllers/PageCtrl";
import { auth, isAdmin, isRoot } from "../middleware/auth";

const router = express.Router();

router.post("/page/create", auth, isAdmin, PageCtrl.create);

router.get("/page/trash", PageCtrl.trash);
router.patch("/page/restore/:id", auth, isAdmin, PageCtrl.restore);
router.patch("/page/restore", auth, isAdmin, PageCtrl.restoreMany);

router.get("/page/:slug", PageCtrl.findBySlug);

router
  .route("/page/:id")
  .put(auth, isAdmin, PageCtrl.update)
  .patch(auth, isAdmin, PageCtrl.delete)
  .delete(auth, isRoot, PageCtrl.destroy);
// .get(PageCtrl.findById);

router
  .route("/page")
  .get(PageCtrl.find)
  .patch(auth, isAdmin, PageCtrl.deleteMany)
  .delete(auth, isRoot, PageCtrl.destroyMany);

export default router;
