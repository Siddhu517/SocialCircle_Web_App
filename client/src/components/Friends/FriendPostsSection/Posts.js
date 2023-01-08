import React from "react";
import "./posts.css";
import Carousel from "react-bootstrap/Carousel";
import { renderHTML } from "../../../utils/renderHTML";

const Posts = ({ posts }) => {
  return (
    <div className="post-container-friend">
      {posts &&
        Array.isArray(posts) &&
        posts.map((post) => (
          <>
            <div className="card" key={post._id}>
              <div className="card-header">
                <div className="friendsDetails">
                  <div className="secF1">
                    <img
                      className="friendImg"
                      src={
                        post && post.postedBy.image
                          ? post.postedBy.image.url
                          : ""
                      }
                      alt=""
                    />
                    <span className="username ms-3">
                      {post && post.postedBy ? post.postedBy.username : "User"}
                    </span>
                  </div>
                  <div className="secF2">
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                  </div>
                </div>
              </div>
              <div className="card-body postBodySection m-0 p-0">
                <div className="carousel-container">
                  {post.file_type === "image" ? (
                    <Carousel fade className="carousel-inner" interval={null}>
                      {post.images.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="img img-fluid d-block w-100 h-100"
                            src={img.url}
                            alt={img.public_id}
                            key={index}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : post.file_type === "video" ? (
                    <Carousel fade className="carousel-inner" interval={null}>
                      {post.videos.map((video, index) => (
                        <Carousel.Item>
                          <iframe
                            className="video img-fluid d-block w-100 h-100"
                            src={video.url}
                            title={video.public_id}
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            autoPlay={false}
                            muted
                            key={index}
                          >
                            Your browser does not support the video tag.
                          </iframe>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : post.file_type === "document" ? (
                    <Carousel fade className="carousel-inner" interval={null}>
                      {post.documents.map((docs, index) => (
                        <Carousel.Item>
                          <iframe
                            src={docs.url}
                            title={docs.public_id}
                            className="d-block w-100 h-100 pdf img-fluid "
                            key={index}
                          >
                            <p>
                              Your browser does not support PDFs. Please
                              download the PDF to view it:
                              <a href={docs.url}>Download PDF</a>
                            </p>
                          </iframe>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="textDocs">
                      <div className="innerBox">
                        {renderHTML(post.body_content)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer p-0">
                <div className="cardFooter m-0 p-0">
                  <span className="tab">
                    {" "}
                    <ion-icon
                      name="thumbs-up-sharp"
                      style={{ color: "blue" }}
                    ></ion-icon>
                    {post.likes.length} Like
                  </span>
                  <span className="tab">
                    {" "}
                    <ion-icon
                      name="chatbubble-ellipses-sharp"
                      style={{ color: "blue" }}
                    ></ion-icon>
                    {post.comments.length} Comment
                  </span>
                  <span className="tab">
                    {" "}
                    <ion-icon
                      name="arrow-redo-sharp"
                      style={{ color: "blue" }}
                    ></ion-icon>
                    {post.comments.length} Share
                  </span>
                </div>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default Posts;
