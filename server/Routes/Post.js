import express from "express";

const multer = require("multer");

const upload = multer({ dest: "api/" });

const router = express.Router();

//middleware
import { requireSignin } from "../Middleware/index";

//controllers
import {
  createPost,
  postsByUser,
  userPost,
  updatePost,
  newsFeed,
  likePost,
  unlikePost,
  sharePost,
  createComment,
  deleteComment,
  editComment,
  totalPosts,
  posts,
  getPost,
  getPostedImages,
  getPostedVideos,
  getPostedDocuments,
  getPostsFriends,
} from "../Controllers/post";

/* use AWS-sdk cloud storage */
import {
  uploadImages,
  uploadVideos,
  uploadDocuments,
  deletePost,
  profileImageUpdate,
  profileBackImageUpdate,
} from "../Controllers/awsPost";

/* create  */
router.post("/create-post", requireSignin, createPost);

/* delete */
router.delete("/delete-post/:id", requireSignin, deletePost);

/* aws upload  */
router.post(
  "/upload-images",
  requireSignin,
  upload.array("files"),
  uploadImages
);
router.post(
  "/upload-videos",
  requireSignin,
  upload.array("files"),
  uploadVideos
);
router.post(
  "/upload-documents",
  requireSignin,
  upload.array("files"),
  uploadDocuments
);

/* profile image Update */
router.post(
  "/profile-image-update",
  requireSignin,
  upload.array("files"),
  profileImageUpdate
);

/* profile background image Update */
router.post(
  "/profile-back-image-update",
  requireSignin,
  upload.array("files"),
  profileBackImageUpdate
);



router.get("/news-feed/:id", requireSignin, newsFeed);

router.put("/create-comment", requireSignin, createComment);
router.put("/remove-comment", requireSignin, deleteComment);
router.put("/edit-comment", requireSignin, editComment);

router.put("/like-post", requireSignin, likePost);
router.put("/unlike-post", requireSignin, unlikePost);
router.put("/share-post", requireSignin, sharePost);

router.get("/total-posts/:id", totalPosts);

router.get("/user-posts", requireSignin, postsByUser);
router.get("/user-post/:id", requireSignin, userPost);
router.put("/update-post/:id", requireSignin, updatePost);

router.get("/posts", posts);

router.get("/post/:_id", getPost);

/* get all data */
router.get("/posted-all-images", requireSignin, getPostedImages);
router.get("/posted-all-videos", requireSignin, getPostedVideos);
router.get("/posted-all-documents", requireSignin, getPostedDocuments);

//friends posts
router.get("/friend-posts/:username", getPostsFriends);

export default router;
