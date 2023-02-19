import mongoose from "mongoose";
const { Schema } = mongoose;
import * as dotenv from "dotenv";
dotenv.config();

mongoose.connect(`${process.env.MONGODB_DOMAIN}`);

const TodoSchema = new Schema({
  title: { type: String, unique: true, required: true }, // String is shorthand for {type: String}
  author: String,
  body: String,
  createAte: { type: Date, default: Date.now, required: true },
  done: { type: Boolean, default: false },
  doneAte: { type: Date },
});

export const TodoModel = mongoose.model("Todo", TodoSchema);
