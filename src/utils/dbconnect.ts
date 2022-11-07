import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connect(
    `${process.env.MONGODB_URL}`,
    {
      autoIndex: true,
    },
    (error) => {
      if (error) throw error;
      console.log("Mongodb connection.");
    }
  );
};

export default connectDB;
