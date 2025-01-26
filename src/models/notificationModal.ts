import mongoose from "mongoose";

interface INotification extends Document {
  user_id: string;
  message: string;
  status: string;
  created_at: Date;
  role: string;
}

const useNotification = new mongoose.Schema<INotification>({
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "unread",
  },
  role: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", useNotification);

export default Notification;
