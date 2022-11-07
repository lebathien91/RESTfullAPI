import express from "express";
import UserCtrl from "../controllers/UserCtrl";
import { validRegister } from "../middleware/valid";
import { auth, isAdmin, isRoot } from "../middleware/auth";

const router = express.Router();

router.post("/user/create", validRegister, auth, isAdmin, UserCtrl.create);

router.get("/user/trash", auth, isAdmin, UserCtrl.trash);

router.patch("/user/restore/:id", auth, isAdmin, UserCtrl.restore);
router.patch("/user/restore", auth, isAdmin, UserCtrl.restoreMany);

router
  .route("/user/:id")
  .get(auth, UserCtrl.findById)
  .put(auth, isRoot, UserCtrl.update)
  .patch(auth, isRoot, UserCtrl.delete)
  .delete(auth, isRoot, UserCtrl.destroy);

router
  .route("/user")
  .get(auth, isAdmin, UserCtrl.find)
  .patch(auth, isRoot, UserCtrl.deleteMany)
  .delete(auth, isRoot, UserCtrl.destroyMany);

export default router;
