import React, { useState, useContext, useEffect, useRef } from "react";
import Navbar from "../components/Home/Navbar/Navbar";
import "./gallery.css";
import { gallerydeleteFile } from "../services/AuthApis";
import {
  getPostedImages,
  getPostedDocuments,
  getPostedVideos,
} from "../services/PostAPI";
import { UserContext } from "../context/Context";
import { toast } from "react-toastify";
import { currentUser } from "../services/AuthApis";

const Gallery = () => {
  /* state  */
  const [state, setState] = useContext(UserContext);
  const [viewSection, setViewSection] = useState("");
  const [post, setPosts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      await stateUpdate();
    };
    fetch();
  });

  const stateUpdate = async () => {
    try {
      const { data } = await currentUser();
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data.user;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update Context
      setState({ ...state, user: data.user });
    } catch (err) {
      console.log(err);
    }
  };

  const clickProfileImages = () => {
    setPosts([])
    setViewSection("ProfileImg");
    setPosts(state.user.images);
  };

  const clickProfileBackImage = () => {
    setPosts([])
    setViewSection("ProfileBackImg");
    setPosts(state.user.back_images);
  };

  const clickPostImages = async () => {
    setPosts([])
    const images = [];
    setViewSection("Images");
    const { data } = await getPostedImages();

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].images.length; j++) {
        images.push(data[i].images[j]);
      }
    }

    setPosts(images);
  };

  const clickPostVideos = async () => {
    setPosts([])
    const videos = [];
    setViewSection("Videos");
    const { data } = await getPostedVideos();
    //console.log(data);

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].videos.length; j++) {
        videos.push(data[i].videos[j]);
      }
    }

    setPosts(videos);
  };

  const clickPostDocuments = async () => {
    setPosts([])
    const documents = [];
    setViewSection("Docs");
    const { data } = await getPostedDocuments();

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].documents.length; j++) {
        documents.push(data[i].documents[j]);
      }
    }

    setPosts(documents);
  };

  const videoRef = useRef(null);

  function handleClick() {
    videoRef.current.pause();
  }

  /* delete gallery data */
 /*  const handleDelete = async (fileId, fileType) => {
    //console.log("delete => ", fileId, fileType);
    const res = await gallerydeleteFile(fileId, fileType);
    if (res.data.status !== "ok") {
      toast.error(res.data.error);
      return;
    }
    //console.log(res.data);
   // await stateUpdate();
    toast.success(res.data.message);
  }; */

  return (
    <div className="container-fluid gallerySection">
      <div className="row">
        {" "}
        <Navbar display="hidden" />
      </div>
      <div className="row">
        <div className="col-3 MenuSection">
          <div className="galleryMenu">
            <span className="name">Gallery</span>
            <div className="menu">
              <span className="m1" onClick={clickProfileImages}>
                ProfileImages
              </span>
              <span className="m1" onClick={clickProfileBackImage}>
                ProfileBackground_Images
              </span>
              <span className="m2" onClick={clickPostImages}>
                Images
              </span>
              <span className="m3" onClick={clickPostVideos}>
                Videos
              </span>
              <span className="m4" onClick={clickPostDocuments}>
                Documents
              </span>
            </div>
          </div>
        </div>
        <div className="col-9 DisplaySection">
          <div className="viewSection">
            {viewSection === "ProfileImg" ? (
              <>
                {post &&
                  post.map((img, index) => (
                    <div className="card ProfileImages" key={img.public_id}>
                     {/*  <button
                        onClick={() =>
                          handleDelete(img.public_id, "profileImg")
                        }
                        className="dataDelete btn btn-sm btn-danger"
                      >
                        <ion-icon name="trash-outline"></ion-icon>
                      </button> */}
                      <img
                        className="img-fluid  d-block w-100 h-100"
                        src={img.url}
                        alt={img.public_id}
                        key={index}
                      />
                    </div>
                  ))}
              </>
            ) : viewSection === "ProfileBackImg" ? (
              <>
                {post &&
                  post.map((img, index) => (
                    <div className="card BackImages" key={img.public_id}>
                     {/*  <button
                        onClick={() =>
                          handleDelete(img.public_id, "profileBackImg")
                        }
                        className="dataDelete btn btn-sm btn-danger"
                      >
                        <ion-icon name="trash-outline"></ion-icon>
                      </button> */}
                      <img
                        className="img-fluid d-block w-100 h-100"
                        src={img.url}
                        alt={img.public_id}
                        key={index}
                      />
                    </div>
                  ))}
              </>
            ) : viewSection === "Images" ? (
              <>
                {post &&
                  post.map((img, index) => (
                    <div className="card Images" key={img.public_id}>
                      <img
                        className="img-fluid d-block w-100 h-100"
                        src={img.url}
                        alt={img.public_id}
                        key={index}
                      />
                    </div>
                  ))}
              </>
            ) : viewSection === "Videos" ? (
              <>
                {post &&
                  post.map((video, index) => (
                    <div className="card Video" key={video.public_id}>
                      <video
                        ref={videoRef}
                        className="video img-fluid d-block w-100 h-100"
                        src={video.url}
                        title={video.public_id}
                        controls
                        onClick={handleClick}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
              </>
            ) : viewSection === "Docs" ? (
              <>
                {post &&
                  post.map((docs, index) => (
                    <div className="card Docs" key={docs.public_id}>
                      <iframe
                        src={docs.url}
                        title={docs.public_id}
                        className="d-block w-100 h-100 pdf img-fluid "
                        key={index}
                      >
                        <p>
                          Your browser does not support PDFs. Please download
                          the PDF to view it:
                          <a href={docs.url}>Download PDF</a>
                        </p>
                      </iframe>
                    </div>
                  ))}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
