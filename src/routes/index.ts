import siteRouter from "./site";
import authRouter from "./auth";
import userRouter from "./user";
import articleRouter from "./article";
import categoryRouter from "./category";
import tagRouter from "./tag";
import pageRouter from "./page";
import commentRouter from "./comment";

const routes = [
  siteRouter,
  authRouter,
  userRouter,
  articleRouter,
  categoryRouter,
  tagRouter,
  pageRouter,
  commentRouter,
];

export default routes;
