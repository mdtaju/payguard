import mongoose from "mongoose";

interface IPayment extends Document {
  title: string;
  amount: number;
  status: string;
  user_id: string;
  created_at: Date;
}

const usePayment = new mongoose.Schema<IPayment>({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
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

const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", usePayment);

export default Payment;
