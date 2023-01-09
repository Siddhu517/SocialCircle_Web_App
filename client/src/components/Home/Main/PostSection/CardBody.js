import React, { useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./css/body.css";
import { renderHTML } from "../../../../utils/renderHTML";

const CardBody = ({ post }) => {
  const videoRef = useRef(null);

  function handleClick() {
    videoRef.current.pause();
  }
  return (
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
                    Your browser does not support PDFs. Please download the PDF
                    to view it:
                    <a href={docs.url}>Download PDF</a>
                  </p>
                </iframe>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="textDocs">
            <div className="innerBox">{renderHTML(post.body_content)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardBody;
