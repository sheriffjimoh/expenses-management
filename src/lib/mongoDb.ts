import mongoose from "mongoose";
import { Document, Schema, model, models } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      bufferCommands: false
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

export interface ICategory extends Document {
  _id: string;
  slug: string;
  name: string;
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const ExpensesSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
export const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpensesSchema);
