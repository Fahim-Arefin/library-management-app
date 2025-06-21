import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

let server;
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGO_URI as string;

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to mongodb using mongoose");
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
