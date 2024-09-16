import mongoose, { Document } from "mongoose";

interface IUser {
  name: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 10,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
