import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    body_content: {
      type: String,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    postShareBy: {
      type: String,
    },
    file_type: {
      type: String,
    },
    images: [],
    videos: [],
    documents: [],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: [
      {
        shareBy: { type: String },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    comments: [
      {
        _id: String,
        comment: String,
        username: String,
        image: {
          url: String,
        },
        created: { type: Date, default: Date.now },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
