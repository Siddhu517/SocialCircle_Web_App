import express from "express";

const router = express.Router();

//middleware
import { requireSignin } from "../Middleware/index";

//controllers
import {
  register,
  login,
  currentUser,
  VerifyOTP,
  VerifyEmailAndSendOTP,
  ResetPassword,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  userFollowers,
  removeFollower,
  userUnfollow,
  searchUser,
  getUser,
  validateUser,
  friendDetails,
  friendFollowers,
  friendFollowing,
  findPeopleFriend,
} from "../Controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password/send-otp", VerifyEmailAndSendOTP);
router.post("/reset-password/verify-otp", VerifyOTP);
router.put("/reset-password", ResetPassword);

router.get("/current-user", requireSignin, currentUser);

router.post("/validate-user", requireSignin, validateUser);
router.put("/profile-update", requireSignin, profileUpdate);

router.get("/find-people", requireSignin, findPeople);

router.put("/user-follow", requireSignin, addFollower, userFollow);
router.put("/user-unfollow", requireSignin, removeFollower, userUnfollow);
router.get("/user-followers", requireSignin, userFollowers);
router.get("/user-following", requireSignin, userFollowing);

router.post("/search-user", searchUser);

router.get("/user/:username", getUser);

/* friends API */
router.get("/friend-details/:username", requireSignin, friendDetails);
router.get("/friend-followers/:username", requireSignin, friendFollowers);
router.get("/friend-following/:username", requireSignin, friendFollowing);
router.get("/find-people/:username", requireSignin, findPeopleFriend);

export default router;
