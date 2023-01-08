import axios from "axios";

/* post API */
/* Home Page  */
export const createPost = async (postData) => {
  try {
    return await axios.post(`/create-post`, postData);
  } catch (err) {
    console.log(err);
  }
};

/*component -  home -  main - upload secton -  add image */
export const postImages = async (formData) => {
  try {
    return await axios.post(`/upload-images`, formData);
  } catch (err) {
    console.log(err);
  }
};

/*component -  home -  main - upload secton -  add videos */
export const postVideos = async (formData) => {
  try {
    return await axios.post(`/upload-videos`, formData);
  } catch (err) {
    console.log(err);
  }
};

/*component -  home -  main - upload secton -  add documents */
export const postDocuments = async (formData) => {
  try {
    return await axios.post(`/upload-documents`, formData);
  } catch (err) {
    console.log(err);
  }
};

/* Home page */
export const deletePostAPI = async (id, data) => {
  try {
    return await axios.delete(`/delete-post/${id}`, { data });
  } catch (err) {
    console.log(err);
  }
};

/* Home page */
/* all posts fetch */
export const newsFeedAPI = async (id) => {
  try {
    return await axios.get(`/news-feed/${id}`);
  } catch (err) {
    console.log(err);
  }
};

/* comment API */
/* Home page */

export const createCommentAPI = async (data) => {
  try {
    return await axios.put(`/create-comment`, { data });
  } catch (err) {
    console.log(err);
  }
};

/* Home page */
export const deleteCommentAPI = async (data) => {
  try {
    return await axios.put(`/remove-comment`, { data });
  } catch (err) {
    console.log(err);
  }
};
/* Home page */
export const commentEditAPI = async (data) => {
  try {
    return await axios.put(`/edit-comment`, { data });
  } catch (err) {
    console.log(err);
  }
};

/* Home page */

/* like / Unlike   API */
export const likePostAPI = async (id) => {
  try {
    return await axios.put(`/like-post`, { id });
  } catch (err) {
    console.log(err);
  }
};
/* Home page */
export const unlikePostAPI = async (id) => {
  try {
    return await axios.put(`/unlike-post`, { id });
  } catch (err) {
    console.log(err);
  }
};

/* Home page */
/* Share API */
export const sharePostAPI = async (id) => {
  try {
    return await axios.put(`/share-post`, { id });
  } catch (err) {
    console.log(err);
  }
};


/* get Images */

export const getPostedImages = async () => {
  try {
    return await axios.get(`/posted-all-images`);
  } catch (err) {
    console.log(err);
  }
};
/* get Images */

export const getPostedVideos = async () => {
  try {
    return await axios.get(`/posted-all-videos`);
  } catch (err) {
    console.log(err);
  }
};
/* get Images */

export const getPostedDocuments = async () => {
  try {
    return await axios.get(`/posted-all-documents`);
  } catch (err) {
    console.log(err);
  }
};

/* friend api  */

/* friends all posts */
export const friendPosts = async (username) => {
  try {
    return await axios.get(`/friend-posts/${username}`);
  } catch (err) {
    console.log(err);
  }
};