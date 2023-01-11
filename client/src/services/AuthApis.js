import axios from "axios";
//const url ="http://localhost:8000/api"

/* first page */
export const RegisterAPI = async (registerData) => {
  try {
    return await axios.post(`/register`, { registerData });
  } catch (err) {
    console.log(err);
  }
};

export const LoginAPI = async (loginData) => {
  try {
    return await axios.post(`/login`, { loginData });
  } catch (err) {
    console.log(err);
  }
};

export const VerifyEmailAndSendOTPAPI = async (email) => {
  try {
    return await axios.post(`/reset-password/send-otp`, {
      email,
    });
  } catch (err) {
    console.log(err);
  }
};

export const VerifyOTPAPI = async (verifyData) => {
  try {
    return await axios.post(`/reset-password/verify-otp`, {
      verifyData,
    });
  } catch (err) {
    console.log(err);
  }
};

export const ResetPassword = async (ResetData) => {
  try {
    return await axios.put(`/reset-password`, { ResetData });
  } catch (err) {
    console.log(err);
  }
};

/* Home page */
export const currentUser = async () => {
  try {
    return await axios.get(`/current-user`);
  } catch (err) {
    console.log(err);
  }
};

/* profile Image Update */
export const profileImageUpdate = async (formData) => {
  try {
    return await axios.post(`/profile-image-update`, formData);
  } catch (err) {
    console.log(err);
  }
};

/* profile Image Update */
export const profileBackImageUpdate = async (formData) => {
  try {
    return await axios.post(`/profile-back-image-update`, formData);
  } catch (err) {
    console.log(err);
  }
};

/* profile update validate user */
export const validateUser = async (data) => {
  try {
    return await axios.post(`/validate-user`, { data });
  } catch (err) {
    console.log(err);
  }
};

/* profile page */
export const profileUpdate = async (data) => {
  try {
    return await axios.put(`/profile-update`, { data });
  } catch (err) {
    console.log(err);
  }
};

/* home page */
export const findPeople = async () => {
  try {
    return await axios.get(`/find-people`);
  } catch (err) {
    console.log(err);
  }
};

/* home page */
export const addFollower = async (id) => {
  try {
    return await axios.put(`/user-follow`, { id });
  } catch (err) {
    console.log(err);
  }
};

/* home page */
export const userFollow = async (id) => {
  try {
    return await axios.put(`/user-follow`, { id });
  } catch (err) {
    console.log(err);
  }
};

/* home page */
export const removeFollower = async (id) => {
  try {
    return await axios.put(`/user-unfollow`, { id });
  } catch (err) {
    console.log(err);
  }
};

/* home page */
export const userUnfollow = async (id) => {
  try {
    return await axios.put(`/user-unfollow`, { id });
  } catch (err) {
    console.log(err);
  }
};

/* home page */
/* total following */
export const userFollowing = async () => {
  try {
    return await axios.get(`/user-following`);
  } catch (err) {
    console.log(err);
  }
};

/* home page */
/* total followers */
export const userFollowers = async () => {
  try {
    return await axios.get(`/user-followers`);
  } catch (err) {
    console.log(err);
  }
};

/* friends page API */

/* friend all details */
export const friendDetails = async (username) => {
  try {
    return await axios.get(`/friend-details/${username}`);
  } catch (err) {
    console.log(err);
  }
};

/* total following */
export const friendFollowing = async (username) => {
  try {
    return await axios.get(`/friend-following/${username}`);
  } catch (err) {
    console.log(err);
  }
};

/* total followers */
export const friendFollowers = async (username) => {
  try {
    return await axios.get(`/friend-followers/${username}`);
  } catch (err) {
    console.log(err);
  }
};

/* suggested */
export const findPeopleFriend = async (username) => {
  try {
    return await axios.get(`/find-people/${username}`);
  } catch (err) {
    console.log(err);
  }
};

/* search user recommendation */
/* Navbar */
export const searchUser = async (searchData) => {
  try {
    return await axios.post(`/search-user`, searchData);
  } catch (err) {
    console.log(err);
  }
};

/* contact us form */

export const contactFormSubmit = async (formData) => {
  try {
    return await axios.post(`/contact`, formData);
  } catch (err) {
    console.log(err);
  }
};

/* gallery file delete */
export const gallerydeleteFile = async (fileId, fileType) => {
  try {
    return await axios.delete(`/gallery/delete-file`, { fileId, fileType });
  } catch (err) {
    console.log(err);
  }
};
