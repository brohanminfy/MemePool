import mongoose, { Schema } from "mongoose";

const MemeModel = new Schema(
  {
     
    meme: [
      {
        type: String, 
        required:true
      },
    ],
    caption:
      {
        type:String,
        required:true
      }
    ,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
    author:{
      type :Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }]
  }
);

const mememodel = mongoose.model("Meme", MemeModel);
export default mememodel;
