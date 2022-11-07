import express from "express";
import CategoryCtrl from "../controllers/CategoryCtrl";
import { auth, isAdmin, isRoot } from "../middleware/auth";

const router = express.Router();

router.post("/category/create", auth, isAdmin, CategoryCtrl.create);

router.get("/category/trash", auth, isAdmin, CategoryCtrl.trash);

router.patch("/category/restore/:id", auth, isAdmin, CategoryCtrl.restore);
router.patch("/category/restore", auth, isAdmin, CategoryCtrl.restoreMany);

router.get("/category/slug/:slug", CategoryCtrl.findBySlug);

router
  .route("/category/:id")
  .get(CategoryCtrl.findById)
  .put(auth, isAdmin, CategoryCtrl.update)
  .patch(auth, isAdmin, CategoryCtrl.delete)
  .delete(auth, isRoot, CategoryCtrl.destroy);

router
  .route("/category")
  .get(CategoryCtrl.find)
  .patch(auth, isAdmin, CategoryCtrl.deleteMany)
  .delete(auth, isRoot, CategoryCtrl.destroyMany);

export default router;
