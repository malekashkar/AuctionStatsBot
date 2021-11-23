import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const MONGO_URL =
  process.env.MONGO_URL || "mongodb://167.172.158.204/main";

function connect() {
  if (
    mongoose.connection.readyState !== mongoose.connection.states.connected &&
    mongoose.connection.readyState !== mongoose.connection.states.connecting
  ) {
    mongoose.connect(
      MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          console.log(err.toString());
        } else {
          console.log("[DATABASE] Connected to the database!");
        }
      }
    );
    mongoose.connection.on("error", () => {
      connect();
    });
  }
}

connect();