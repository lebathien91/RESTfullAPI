import express from "express";
import TagCtrl from "../controllers/TagCtrl";
import { auth, isEditor, isAdmin, isRoot } from "../middleware/auth";

const router = express.Router();

router.post("/tag/create", auth, isEditor, TagCtrl.create);

router.get("/tag/trash", auth, isAdmin, TagCtrl.trash);
router.patch("/tag/restore/:id", auth, isAdmin, TagCtrl.restore);
router.patch("/tag/restore", auth, isAdmin, TagCtrl.restoreMany);

router.get("/tag/slug/:slug", TagCtrl.findBySlug);

router
  .route("/tag/:id")
  .get(TagCtrl.findById)
  .put(auth, isEditor, TagCtrl.update)
  .patch(auth, isAdmin, TagCtrl.delete)
  .delete(auth, isRoot, TagCtrl.destroy);

router
  .route("/tag")
  .get(TagCtrl.find)
  .patch(auth, isAdmin, TagCtrl.deleteMany)
  .delete(auth, isAdmin, TagCtrl.destroyMany);

export default router;
