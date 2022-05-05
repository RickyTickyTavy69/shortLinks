import pkg from "mongoose";
const { Schema, model, Types } = pkg;

const linkSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now, // дефолтное значение в Схеме, если это функция, то она не вызывается, а добавляется как reference;
  },
  clicks: {
    type: Number,
    default: 0,
  },
  owner: {
    type: Types.ObjectId,
    ref: "User", // эти связки до сих пор не совсем понял зачем они.
  },
});

export default model("Link", linkSchema);
