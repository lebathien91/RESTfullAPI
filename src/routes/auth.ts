import express from "express";
import AuthCtrl from "../controllers/AuthCtrl";
import { auth } from "../middleware/auth";
import { validRegister } from "../middleware/valid";

const router = express.Router();

router.post("/auth/activate", AuthCtrl.activateEmail);
router.post("/auth/forgot", AuthCtrl.forgotPassword);
router.post("/auth/reset-password", auth, AuthCtrl.resetPassword);
router.post("/auth/login", AuthCtrl.login);

router
  .route("/auth")
  .get(AuthCtrl.accessToken)
  .post(validRegister, AuthCtrl.register)
  .put(auth, AuthCtrl.update)
  .patch(auth, AuthCtrl.resetPassword);

export default router;
