import mongoose from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  photo_url: string;
  id: string;
}

const useSchema = new mongoose.Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  photo_url: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", useSchema);

export default User;
