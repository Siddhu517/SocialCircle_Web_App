import React, { useState, useContext } from "react";
import Navbar from "../components/Home/Navbar/Navbar";
import "./gallery.css";
import {
  getPostedImages,
  getPostedDocuments,
  getPostedVideos,
} from "../services/PostAPI";
import { UserContext } from "../context/Context";

const Gallery = () => {
  /* state  */
  const [state] = useContext(UserContext);
  const [viewSection, setViewSection] = useState("");
  const [post, setPosts] = useState([]);

  const clickProfileImages = () => {
    setViewSection("ProfileImg");
    setPosts(state.user.images);
  };

  const clickProfileBackImage = () => {
    setViewSection("ProfileBackImg");
    setPosts(state.user.back_images);
  };

  const clickPostImages = async () => {
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
    const videos = [];
    setViewSection("Videos");
    const { data } = await getPostedVideos();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].videos.length; j++) {
        videos.push(data[i].videos[j]);
      }
    }

    setPosts(videos);
  };

  const clickPostDocuments = async () => {
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

  return (
    <div className="gallerySection">
      <Navbar display="hidden" />
      <div className="gallerySectionBox">
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
        <div className="viewSection">
          {viewSection === "ProfileImg" ? (
            <div className="galleryViewSec">
              {post &&
                post.map((img, index) => (
                  <div className="card ProfileImages">
                    <img
                      className="img-fluid  d-block w-100 h-100"
                      src={img.url}
                      alt={img.public_id}
                      key={index}
                    />
                  </div>
                ))}
            </div>
          ) : viewSection === "ProfileBackImg" ? (
            <div className="galleryViewSec">
              {post &&
                post.map((img, index) => (
                  <div className="card BackImages">
                    <img
                      className="img-fluid d-block w-100 h-100"
                      src={img.url}
                      alt={img.public_id}
                      key={index}
                    />
                  </div>
                ))}
            </div>
          ) : viewSection === "Images" ? (
            <div className="galleryViewSec">
              {post &&
                post.map((img, index) => (
                  <div className="card Images">
                    <img
                      className="img-fluid d-block w-100 h-100"
                      src={img.url}
                      alt={img.public_id}
                      key={index}
                    />
                  </div>
                ))}
            </div>
          ) : viewSection === "Videos" ? (
            <div className="galleryViewSec">
              {post &&
                post.map((video, index) => (
                  <div className="card Video">
                    <iframe
                      className=" img-fluid m-0 p-0 d-block w-100 h-100"
                      src={video.url}
                      title={video.public_id}
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      muted
                      key={index}
                      autoPlay={false}
                    >
                      Your browser does not support the video tag.
                    </iframe>
                  </div>
                ))}
            </div>
          ) : viewSection === "Docs" ? (
            <div className="galleryViewSec">
              {post &&
                post.map((docs, index) => (
                  <div className="card Docs">
                    <iframe
                      src={docs.url}
                      title={docs.public_id}
                      className="d-block w-100 h-100 pdf img-fluid "
                      key={index}
                    >
                      <p>
                        Your browser does not support PDFs. Please download the
                        PDF to view it:
                        <a href={docs.url}>Download PDF</a>
                      </p>
                    </iframe>
                  </div>
                ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
