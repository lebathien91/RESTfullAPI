import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./utils/dbconnect";
import routes from "./routes";
import socketIO from "./utils/socketIO";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const { http, io } = socketIO(app);
export const soketIo = io;

// Database
connectDB();

// Routes
app.use("/api", routes);

// Start server listening
const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});
