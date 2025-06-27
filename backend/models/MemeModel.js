import mongoose, { Schema } from "mongoose";

const MemeModel = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    meme: [
      {
        type: String, 
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const dbmodel = mongoose.model("Meme", MemeModel);
export default dbmodel;
