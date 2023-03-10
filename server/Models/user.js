import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      max: 64,
    },
    image: {
      url: String,
      public_id: String,
    },
    back_image: {
      url: String,
      public_id: String,
    },
    back_images: [],
    images: [],
    contact: {
      type: Number,
    },
    gender: {
      type: String,
    },
    dateofbirth: {
      type: String,
    },
    address: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      pincode: {
        type: String,
      },
    },
    work: {
      type: String,
    },
    education: {
      type: String,
    },
    relationship: {
      type: String,
    },
    posts: [],
    role: {
      type: String,
      default: "Subscriber",
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    contactUs: [
      {
        createdAt: { type: Date, default: Date.now },
        name: { type: String },
        email: { type: String },
        contact: { type: String },
        message: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
