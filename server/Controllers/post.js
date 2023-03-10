import Post from "../Models/post";
import User from "../Models/user";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { content, resFiles, file_type, bodyText, postBy } = req.body;
    // console.log(content, resFiles, file_type, bodyText, postBy);

    if (!content) {
      return res.json({
        error: "Content is required",
      });
    }

    if (!resFiles && !bodyText) {
      return res.json({
        error: "Images is required",
      });
    }

    if (!file_type) {
      return res.json({
        error: "type is required",
      });
    }

    let post;
    let shareBy;

    if (!postBy) {
      shareBy = "public";
    } else {
      shareBy = postBy;
    }

    if (file_type === "image") {
      post = new Post({
        _id: new mongoose.Types.ObjectId(),
        content,
        file_type,
        images: resFiles,
        postedBy: req.user._id,
        postShareBy: shareBy,
      });
    } else if (file_type === "video") {
      post = new Post({
        _id: new mongoose.Types.ObjectId(),
        content,
        file_type,
        videos: resFiles,
        postedBy: req.user._id,
        postShareBy: shareBy,
      });
    } else if (file_type === "document") {
      post = new Post({
        _id: new mongoose.Types.ObjectId(),
        content,
        file_type,
        documents: resFiles,
        postedBy: req.user._id,
        postShareBy: shareBy,
      });
    } else if (file_type === "text") {
      post = new Post({
        _id: new mongoose.Types.ObjectId(),
        content,
        file_type,
        body_content: bodyText,
        postedBy: req.user._id,
        postShareBy: shareBy,
      });
    } else {
      return res.json({
        error: " file_type is unknown",
      });
    }

    await post.save();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          posts: post._id,
        },
      },
      { new: true }
    );

    const postWithUser = await Post.findById(post._id).populate(
      "postedBy",
      "-password"
    );

    res.json({
      data: postWithUser,
      status: "ok",
      message: "Successfully Post Created",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Error",
    });
  }
};

export const newsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    let following;
    if (user.following) {
      following = user.following;
      following.push(req.user._id);
    } else {
      following = user;
    }

    //const posts = await Post.find({})
    const posts = await Post.find({ postedBy: { $in: following } })
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

export const likePost = async (req, res) => {
  const { id } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    res.json({
      status: "ok",
      data: post,
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
};

export const unlikePost = async (req, res) => {
  const { id } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    res.json({
      status: "ok",
      data: post,
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
};

export const sharePost = async (req, res) => {
  //console.log(req.body)
  const { id } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          shares: {
            shareBy: "Friends",
            postedBy: req.user._id,
          },
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image");
    //console.log(post);

    /* write code to send  friend posts *********** */

    res.json({
      status: "ok",
      message: "successfully send post",
      data: post,
    });
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
};

/* total post count */
export async function totalPosts(req, res) {
  //console.log(req.params._id);
  try {
    const post = await Post.findById(req.params._id); /* ({
      postedBy: req.body.id,
    }); */
    // console.log(post);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

export const postsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id })
      //const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 });
    // console.log('posts',posts)
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

export const userPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "_id name image");
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = async (req, res) => {
  // console.log("post update controller => ", req.body);
  try {
    const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

export const createComment = async (req, res) => {
  const { comment, id, postedById } = req.body.data;
  //console.log(comment, id, postedById);
  try {
    if (!comment || !id || !postedById) {
      return res.json({
        error: "error",
      });
    }

    const commentByUser = await User.findById({ _id: postedById });
    if (!commentByUser) {
      return res.json({
        error: "no user found",
      });
    }

    const userPost = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            _id: id + "-" + Date.now(),
            comment: comment,
            postedBy: commentByUser._id,
            username: commentByUser.username,
            image: commentByUser.image,
          },
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "_id name username image");
    //console.log(userPost);

    res.json({
      message: "success",
      status: "ok",
      data: userPost,
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteComment = async (req, res) => {
  //console.log(req.body);
  const { id, commentId } = req.body.data;
  //console.log(id, commentId);
  if (!id || !commentId) {
    return res.json({
      error: "error",
    });
  }

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    );

    res.json({
      message: "remove comment",
      data: post,
    });
  } catch (err) {
    console.log(err);
  }
};

export const editComment = async (req, res) => {
  const { id, newComment, commentId } = req.body.data;
  //console.log(id, newComment, commentId);
  try {
    if (!id || !newComment || !commentId) {
      return res.json({
        error: "error",
      });
    }

    /* update */
    const userPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          "comments.$[elem].comment": newComment,
        },
      },
      {
        arrayFilters: [{ "elem._id": commentId }],
        new: true,
      }
    );

    return res.json({
      message: "comment update",
      status: "ok",
      data: userPost,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

export const posts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "_id name image")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name image")
      .populate("comments.postedBy", "_id name image");
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

/* get images */

export const getPostedImages = async (req, res) => {
  try {
    const post = await Post.find({
      postedBy: req.user._id,
      file_type: "image",
    });
    //console.log(post);
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

/* get videos */

export const getPostedVideos = async (req, res) => {
  try {
    const post = await Post.find({
      postedBy: req.user._id,
      file_type: "video",
    });
    //console.log(post);
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

/* get documents */

export const getPostedDocuments = async (req, res) => {
  try {
    const post = await Post.find({
      postedBy: req.user._id,
      file_type: "document",
    });
    //console.log(post);
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

/* **************** */

/* friend all posts get */
export const getPostsFriends = async (req, res) => {
  //console.log("posts friends =>  ", req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username });

    const posts = await Post.find({ postedBy: user })
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image ")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};
