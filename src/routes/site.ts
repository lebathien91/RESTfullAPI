import express from "express";
import TagCtrl from "../controllers/TagCtrl";

const router = express.Router();

router.get("/", TagCtrl.find);

export default router;
