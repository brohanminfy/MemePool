import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
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
    password:{
        type:String,
        required:true
    }
  }
);

const usermodel = mongoose.model("User", UserSchema);
export default usermodel;
