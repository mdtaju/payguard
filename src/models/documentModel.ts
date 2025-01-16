import mongoose from "mongoose";

interface IDocument extends Document {
  title: string;
  file_url: string;
  status: string;
  user_id: string;
  uploaded_at: Date;
}

const useDocument = new mongoose.Schema<IDocument>({
  title: {
    type: String,
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  user_id: {
    type: String,
    required: true,
  },
  uploaded_at: {
    type: Date,
    required: true,
  },
});

const Document =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", useDocument);

export default Document;
