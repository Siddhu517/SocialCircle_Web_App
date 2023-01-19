import User from "../Models/user";
import Post from "../Models/post";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

export const register = async (req, res) => {
  //console.log("register => ",req.body.registerData);
  const { username, email, password, contact, gender, dateofbirth } =
    req.body.registerData;

  //check username exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.json({
      error: "username already exists",
    });
  }

  // chech email exists
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return res.json({
      error: "email Id already exists",
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    // username: nanoid(6) //username should be 6 letter
    _id: new mongoose.Types.ObjectId(),
    username,
    email,
    password: hashedPassword,
    contact,
    gender,
    dateofbirth,
  });
  try {
    await user.save();
    // console.log("REGISTERED USE => ", user);
    return res.status(201).json({
      status: "ok",
      message: "Successfully Register Account",
    });
  } catch (err) {
    console.log("REGISTER FAILED => ", err);
    return res.status(400).json({
      error: "Error. Try again.",
    });
  }
};

export const login = async (req, res) => {
  // console.log("login", req.body.loginData);
  try {
    const { username, password } = req.body.loginData;
    //console.log(username, password);
    if (!username || !password) {
      return res.json({
        error: "error",
      });
    }

    //check email
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
    // console.log(user); // added debug logging
    if (!user) {
      return res.json({
        error: "no user found",
      });
    }

    //check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong Password",
      });
    }

    //create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    /* user.password = undefined; */

    res.json({
      token,
      user,
      status: "ok",
      message: "Successfully Login Account",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Error. Try again",
    });
  }
};

// variable create to store otp
let makeOTP = 0;

export const VerifyEmailAndSendOTP = async (req, res) => {
  try {
    //console.log("email-otp-send => ", req.body);
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    generateOTP();
    await handleSendEmail(email, makeOTP);

    res.status(201).json({
      message: "Send OTP Check",
      status: "ok",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create variable to store otp to match previous otp
let matchOTP = "";

export const VerifyOTP = async (req, res) => {
  try {
    //console.log("verify otp => ", req.body);
    const { enterOTP, email } = req.body.verifyData;

    const user = await User.findOne({ email: email });
    //console.log(user);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (Number(enterOTP) !== Number(makeOTP)) {
      matchOTP = "Failed";
      return res.json({
        error: "Check email enter Wrong OTP",
      });
    }

    matchOTP = "Success";

    res.status(201).json({
      message: "Success",
    });

    //console.log(makeOTP,matchOTP)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const ResetPassword = async (req, res) => {
  //console.log("ResetPassword",req.body.ResetData);
  const { email, password } = req.body.ResetData;
  // console.log(email, password);

  if (matchOTP === "") {
    return res.json({ error: "Please Enter OTP and Submit" });
  }

  if (matchOTP === "Failed") {
    return res.json({ error: "OTP not match Retry!" });
  }

  // chech email exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      error: "User Not Found",
    });
  }

  // password verify old and New Match
  const oldPassMatch = await comparePassword(password, user.password);
  if (oldPassMatch) {
    return res.json({
      error: "You have enter Old Password, Please Enter New Password",
    });
  }

  try {
    const hashed = await hashPassword(password);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      message: "Congrats, Now you can login with your new password",
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong. Try again.",
    });
  }
};

// generate OTP
const generateOTP = () => {
  makeOTP = Math.floor(1000 + Math.random() * 9000);
};

/*  */

// send OTP to specific email address
const handleSendEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "siddhusadadekar517@gmail.com",
      pass: "nuamefswphkmvszp",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "siddhusadadekar517@gmail.com",
    to: email,
    subject: "OTP for Verification",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <strong>${otp}</strong></p>`,
  });

  // console.log(`Message sent: %s `, info.messageId);
};

/* contact form submit */

export const contactForm = async (req, res) => {
  try {
    // Get the form data from the request body
    const { name, email, contact, message } = req.body;

    // Check if any of the required fields are missing
    if (!name || !email || !contact || !message) {
      return res.json({
        error: "All fields are required",
      });
    }

    // Create a nodemailer transporter object using the Gmail service
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "siddhusadadekar517@gmail.com",
        pass: "nuamefswphkmvszp",
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: email,
      to: "siddhusadadekar517@gmail.com",
      subject: "Contact Message",
      text: name,
      html: `<div><h3>Name: ${name}</h3></br><h4>UserId: ${req.user._id}</h4></br><h4>EmailSendUser: ${email}</h4></br><h4>Contact_No: ${contact}</h4></br><p><h4>Message:</h4> ${message}</p></div>`,
    });

    // Log the message ID
    //console.log(`Message sent: %s `, info.messageId);

    if (!info) {
      return res.json({
        message: "network error or check email id",
      });
    }

    // Save the contact form data to a user's document in a MongoDB collection
    console.log(req.user._id);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          contactUs: {
            name: name,
            email: email,
            contact: contact,
            message: message,
          },
        },
      },
      { new: true }
    );

    // Send a response indicating that the message was sent
    res.json({
      message: "message sent successfully",
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    res.json({
      error:
        "An error occured while sending the message, please try again later",
    });
  }
};

/* get current user */

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.json({ user: user });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

/* validate user */

export const validateUser = async (req, res) => {
  //console.log(req.body);
  try {
    const { passwordValidate } = req.body.data;
    if (!passwordValidate) {
      return res.status(400).json({
        error: "error",
      });
    }

    const user = await User.findById(req.user._id);

    // password verify old and New Match
    const isMatch = await comparePassword(passwordValidate, user.password);
    if (!isMatch) {
      return res.json({
        error: "Password not match",
      });
    }

    res.json({
      message: "Password Match",
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: "network error",
    });
  }
};

/*put update profile */

export const profileUpdate = async (req, res) => {
  //console.log("profileUpdate => ", req.body.data);
  try {
    const {
      username,
      email,
      contact,
      gender,
      work,
      name,
      city,
      state,
      country,
      pincode,
      education,
      dateofbirth,
      relationship,
    } = req.body.data;

    const data = {};

    if (username) {
      data.username = username;
    }
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }

    //  if (password) {
    //data.password = await hashPassword(password);
    //}

    if (contact) {
      data.contact = contact;
    }
    if (gender) {
      data.gender = gender;
    }
    if (dateofbirth) {
      data.dateofbirth = dateofbirth;
    }
    if (city || state || country || pincode) {
      data.address = {
        city: city,
        state: state,
        country: country,
        pincode: pincode,
      };
    }

    if (work) {
      data.work = work;
    }

    if (education) {
      data.education = education;
    }
    if (relationship) {
      data.relationship = relationship;
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
    //console.log("updated user ", user);
   /*  user.password = undefined; */
    res.json({
      message: "Successfully Profile Updated",
      status: "ok",
      data: user,
    });
  } catch (err) {
    if (err.code == 11000) {
      return res.json({ error: "Duplicate username" });
    }
    console.log(err);
  }
};

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    //user.following
    let following = user.following;
    following.push(user._id);
    const people = await User.find({ _id: { $nin: following } }).select(
      "-password"
    );
    res.json(people);
  } catch (err) {
    console.log(err);
  }
};

export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, {
      $addToSet: { followers: req.user._id },
    });

    next();
  } catch (err) {
    console.log(err);
    res.json({ error: "Error adding follower" });
  }
};

export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, {
      $pull: { followers: req.user._id },
    });

    next();
  } catch (err) {
    console.log(err);
    res.json({ error: "Error removing follower" });
  }
};

export const userFollow = async (req, res) => {
  // console.log(req.body.id);
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body.id },
      },
      { new: true }
    ).select("-password");

    /* user.password = undefined; */

    const friend = await User.findById(req.body.id);
    res.json({
      message: `${friend.username} Follow`,
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = await User.find({ _id: user.following });
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};

export const userFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followers = await User.find({ _id: user.followers });
    res.json(followers);
  } catch (err) {
    console.log(err);
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.id } },
      { new: true }
    );

    const friend = await User.findById(req.body.id);
    res.json({
      message: `${friend.username} UnFollow`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

/* friend section APIS controllers */

export const friendDetails = async (req, res) => {
  //console.log("userData=> ", req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }
  /*   user.password = undefined; */
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const friendFollowing = async (req, res) => {
  //console.log("following ", req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.json({
        error: "user not found",
      });
    } else {
      const followingUsers = await User.find({ _id: { $in: user.following } });

      if (followingUsers.length === 0) {
        // No users found
        // console.log("followers not found");
      } else {
        return res.json(followingUsers);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const friendFollowers = async (req, res) => {
  //console.log("follow ", req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.json({
        error: "user not found",
      });
    } else {
      const followersUsers = await User.find({ _id: { $in: user.followers } });

      if (followersUsers.length === 0) {
        // No users found
        // console.log("followers not found");
      } else {
        return res.json(followersUsers);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const findPeopleFriend = async (req, res) => {
  // console.log("people ", req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.json({
        error: "user not found",
      });
    }

    let following = user.following;
    following.push(user._id);
    following.push(req.user._id);

    const people = await User.find({ _id: { $nin: following } }).select(
      "-password"
    );
    res.json(people);
  } catch (err) {
    console.log(err);
  }
};

// Navbar section filters user
/* navbar search recommendation */

export const searchUser = async (req, res) => {
  const { search } = req.body;
  // console.log(search);
  try {
    // $regex is special method from mongodb
    // The i modifier is used to perform case-insensitive matching
    const user = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    }).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

/* delete user */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.user._id });
    // const post = await Post.findOneAndDelete({ postedBy: req.user._id });

    res.json({
      status: "ok",
      message: `Successfully ${user.username} Account deleted`,
    });
  } catch (err) {
    console.log(err);
  }
};
