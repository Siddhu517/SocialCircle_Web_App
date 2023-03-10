import Post from "../Models/post";
import User from "../Models/user";
import AWS from "aws-sdk";
import fs from "fs";

// Set the AWS access key ID, secret access key, region, and endpoint
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_S3_REGION; // Set the region code of the S3 bucket
const s3AccelerateEndpoint = process.env.AWS_S3_ACCELERATE_END_POINT;

// Update the AWS SDK configuration
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
  s3AccelerateEndpoint,
});

// Create an S3 client
const s3 = new AWS.S3();

// The name of the bucket that you want to upload the files to
//const bucketName = process.env.BUCKET_NAME;

/* profile image update */
export const profileImageUpdate = async (req, res) => {
  // console.log(req.files);
  const files = Array.isArray(req.files) ? req.files : [req.files];
  //console.log("files => ", files);

  if (!req.files || !req.files.length) {
    return res.json({
      message: "error",
      error: "No files were provided in the request",
    });
  }

  try {
    // Read the file and get its contents
    const file = req.files[0]; // fix: use the first file in the array
    const fileBuffer = fs.readFileSync(file.path);

    // Get the current date and time
    const date = new Date();

    // Set the bucket and file names for the S3 upload
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `ProfileImage/${date.toISOString()}-${file.name}`, // fix: use file.name instead of files.name
      Body: fileBuffer,
      ContentType: file.mimetype, // fix: use file.mimetype instead of files.mimetype
      ACL: "public-read",
    };
    // Upload the file to S3
    const result = await s3.upload(params).promise();

    // Update the user's image and add the new image to the images array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          image: {
            url: result.Location,
            public_id: result.VersionId,
          },
        },
        $addToSet: {
          images: {
            url: result.Location,
            public_id: result.VersionId,
          },
        },
      },
      { new: true }
    );

    // Send a JSON response with the array of uploaded images and a success message
    res.json({
      status: "ok",
      message: "Successfully uploaded Images",
      user: user,
    });
  } catch (err) {
    res.json({
      error: "network error",
    });
    console.log(err);
  }
};
/* profile background image update */
export const profileBackImageUpdate = async (req, res) => {
  // console.log(req.files);
  const files = Array.isArray(req.files) ? req.files : [req.files];
  //console.log("files => ", files);

  if (!req.files || !req.files.length) {
    return res.json({
      message: "error",
      error: "No files were provided in the request",
    });
  }

  try {
    // Read the file and get its contents
    const file = req.files[0]; // fix: use the first file in the array
    const fileBuffer = fs.readFileSync(file.path);

    // Get the current date and time
    const date = new Date();

    // Set the bucket and file names for the S3 upload
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `ProfileBackgroundImage/${date.toISOString()}-${file.name}`, // fix: use file.name instead of files.name
      Body: fileBuffer,
      ContentType: file.mimetype, // fix: use file.mimetype instead of files.mimetype
      ACL: "public-read",
    };
    // Upload the file to S3
    const result = await s3.upload(params).promise();

    // Add the URL of the uploaded file to the array
    // console.log("result => ", result);

    // Update the user's image and add the new image to the images array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          back_image: {
            url: result.Location,
            public_id: result.VersionId,
          },
        },
        $addToSet: {
          back_images: {
            url: result.Location,
            public_id: result.VersionId,
          },
        },
      },
      { new: true }
    );

    // Send a JSON response with the array of uploaded images and a success message
    res.json({
      status: "ok",
      message: "Successfully uploaded Background Image",
      user: user,
    });
  } catch (err) {
    res.json({
      error: "network error",
    });
    console.log(err);
  }
};

export const uploadImages = async (req, res) => {
  // Check that the req.files field is present and has at least one file
  if (!req.files || !req.files.length) {
    return res.json({
      message: "error",
      error: "No files were provided in the request",
    });
  }

  // Create an array to store the uploaded image URLs
  const uploadedImages = [];

  try {
    // Check if the `req.files` object is an array or a single file
    const files = Array.isArray(req.files) ? req.files : [req.files];

    for (const file of files) {
      // Read the file and get its contents
      const fileBuffer = fs.readFileSync(file.path);

      // Get the current date and time
      const date = new Date();

      // Set the bucket and file names for the S3 upload
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Images/${date.toISOString()}-${file.name}`,
        Body: fileBuffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      // Upload the file to S3
      const result = await s3.upload(params).promise();

      // Add the URL of the uploaded file to the array
      //console.log("result => ", result);
      uploadedImages.push({
        url: result.Location,
        public_id: result.VersionId,
      });
    }
    //console.log(uploadedImages);
    // Send a JSON response with the array of uploaded images and a success message
    res.json({
      uploadedImages,
      status: "ok",
      message: "Successfully uploaded Images",
    });
  } catch (err) {
    console.error(err);

    // If an error occurred while uploading the images, delete any uploaded images
    for (const image of uploadedImages) {
      // Set the bucket and file names for the S3 delete operation
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: image.public_id, // Set the file name
      };

      // Delete the file from S3
      await s3.deleteObject(params).promise();
    }

    // Send a JSON response with an error message
    res.json({
      message: "network connection error check and post",
      error: err,
    });
  }
};

export const uploadVideos = async (req, res) => {
  //console.log("req files => ", req.files);
  // Check that the req.files field is present and has at least one file
  if (!req.files || !req.files.length) {
    return res.json({
      message: "error",
      error: "No files were provided in the request",
    });
  }
  // Create an array to store the uploaded video URLs and public IDs
  const uploadedVideos = [];

  try {
    // Parse the files from the request
    const files = Array.isArray(req.files) ? req.files : [req.files];

    // Create an array of promises for the file uploads
    const uploadPromises = files.map(async (file) => {
      // Read the file and get its contents
      const fileBuffer = fs.readFileSync(file.path);

      // Get the current date and time
      const date = new Date();

      // Set the bucket and file names for the S3 upload
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Videos/${date.toISOString()}-${file.name}`,
        Body: fileBuffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      // Upload the file to S3 using the multithreaded or multipart upload feature
      const result = await s3
        .upload(params, {
          useAccelerateEndpoint: true,
          partSize: 10 * 1024 * 1024, // 10MB
        })
        .promise();

      // Add the URL of the uploaded file to the array
      uploadedVideos.push({
        url: result.Location,
        public_id: result.VersionId,
      });
    });

    // Wait for all of the file uploads to complete
    await Promise.all(uploadPromises);

    //console.log("results => ", uploadedVideos);
    // Send a JSON response with the array of uploaded images and a success message
    res.json({
      uploadedVideos,
      status: "ok",
      message: "Successfully uploaded videos",
    });
  } catch (err) {
    console.error(err);

    // If an error occurred while uploading the images, delete any uploaded images
    for (const video of uploadedVideos) {
      // Set the bucket and file names for the S3 delete operation
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: video.public_id, // Set the file name
      };

      // Delete the file from S3
      await s3.deleteObject(params).promise();
    }

    // Send a JSON response with an error message
    res.json({
      message: "network connection error check and post",
      error: err,
    });
  }
};

export const uploadDocuments = async (req, res) => {
  //console.log("req files => ", req.files);
  // Check that the req.files field is present and has at least one file
  if (!req.files || !req.files.length) {
    return res.json({
      message: "error",
      error: "No files were provided in the request",
    });
  }
  // Create an array to store the uploaded image URLs
  const uploadedDocuments = [];

  try {
    // Check if the `req.files` object is an array or a single file
    const files = Array.isArray(req.files) ? req.files : [req.files];

    for (const file of files) {
      // Read the file and get its contents
      const fileBuffer = fs.readFileSync(file.path);

      // Get the current date and time
      const date = new Date();

      // Set the bucket and file names for the S3 upload
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Documents/${date.toISOString()}-${file.name}`,
        Body: fileBuffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      // Upload the file to S3
      const result = await s3.upload(params).promise();

      // Add the URL of the uploaded file to the array
      uploadedDocuments.push({
        url: result.Location,
        public_id: result.VersionId,
      });
    }

    //console.log("results => ", uploadedDocuments);

    // Send a JSON response with the array of uploaded images and a success message
    res.json({
      uploadedDocuments,
      status: "ok",
      message: "Successfully uploaded Documents",
    });
  } catch (err) {
    console.error(err);

    // If an error occurred while uploading the images, delete any uploaded images
    for (const document of uploadedDocuments) {
      // Set the bucket and file names for the S3 delete operation
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: document.public_id, // Set the file name
      };

      // Delete the file from S3
      await s3.deleteObject(params).promise();
    }

    // Send a JSON response with an error message
    res.json({
      message: "network connection error check and post",
      error: err,
    });
  }
};

export const deletePost = async (req, res) => {
  const { fileType } = req.body;
  //console.log(fileType)
  //console.log(req.params.id)
  try {
    if (!fileType || !req.params.id) {
      return res.json({
        message: "filetype and id required",
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: req.params.id },
    });

    const post = await Post.findByIdAndDelete(req.params.id);

    // console.log(post);

    // remove the files
    if (fileType === "image") {
      try {
        for (const image of post.images) {
          // Check if this is the image that needs to be deleted
          if (image.shouldDelete) {
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: image.url,
            };
            await s3.deleteObject(params).promise();
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else if (fileType === "document") {
      try {
        for (const document of post.documents) {
          // Set the bucket and file names for the S3 delete operation
          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: document.url, // Set the file name
          };

          // Delete the file from S3
          await s3.deleteObject(params).promise();
        }
      } catch (err) {
        console.log(err);
      }
    } else if (fileType === "videos") {
      try {
        for (const video of post.videos) {
          // Set the bucket and file names for the S3 delete operation
          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: video.url, // Set the file name
          };

          // Delete the file from S3
          await s3.deleteObject(params).promise();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("unknown file type");
    }
    res.json({ ok: true, message: "successfully post deleted" });
  } catch (err) {
    res.json({ error: err });
    console.log(err);
  }
};


/* gallery files delete */
export const gallerydeleteFile = async (req, res) => {
  //console.log(req.body);
  try {
    const { fileId, fileType } = req.body;
    //console.log(fileId, fileType);

    if (!fileType || !fileId) {
      return res.json({
        error: "filetype and id required",
      });
    }

    const user = await User.findById({ _id: req.user._id });
    //console.log("user => ", user);

    if (fileType === "profileImg") {
      for (let i = 0; i < user.images.length; i++) {
        // Set the bucket and file names for the S3 delete operation
        //console.log(user.image.public_id)
        if (
          user.images[i].public_id === fileId &&
          user.image.public_id === fileId
        ) {
          const filter = { _id: user._id };
          const update = { $pull: { images: { public_id: fileId } } };
          await User.findOneAndUpdate(filter, update);

          await User.findByIdAndUpdate(user._id, {
            $unset: { image: user.image.public_id },
          });

          try {
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: user.images[i].public_id, // Set the file name
            };

            // Delete the file from S3
            await s3.deleteObject(params).promise();
          } catch (err) {
            console.log(err);
          }
        } else if (user.images[i].public_id === fileId) {
          const filter = { _id: user._id };
          const update = { $pull: { images: { public_id: fileId } } };
          await User.findOneAndUpdate(filter, update);

          try {
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: user.images[i].public_id, // Set the file name
            };

            // Delete the file from S3
            await s3.deleteObject(params).promise();
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else if (fileType === "profileBackImg") {
      try {
        for (let i = 0; i < user.back_images.length; i++) {
          // Set the bucket and file names for the S3 delete operation
          if (user.back_images[i].public_id === fileId) {
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: user.back_images[i].public_id, // Set the file name
            };

            // Delete the file from S3
            await s3.deleteObject(params).promise();
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      return res.json({
        error: "error",
      });
    }
    res.json({ status: "ok", message: "successfully file deleted" });
  } catch (err) {
    return res.json({
      error: err,
    });
  }
};