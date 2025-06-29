import mongoose, { Schema } from "mongoose";

const MemeModel = new Schema(
  {
    
    meme: [
      {
        type: String, 
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
    author:{
      type :Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
  }
);

const dbmodel = mongoose.model("Meme", MemeModel);
export default dbmodel;
