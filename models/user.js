import pkg from "mongoose";
const { Schema, model, Types } = pkg;

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // означает, что не может быть двух одинаковых email.
  },
  password: {
    type: String,
    required: true,
  },
  links: [
    {
      type: Types.ObjectId, // это надо тоже подробнее изучить, так как не понял до конца, как работает такая привязка
      ref: "Link",
    },
  ],
});

export default model("User", schema);
