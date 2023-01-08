import React from "react";
import "./addImages.css";

const Images = ({ files, handleDeleteFile }) => {
  return (
    <div className="images d-flex ">
      {files &&
        files.map((file, index) => (
          <div key={index} className="">
            <img src={URL.createObjectURL(file)} alt={file.name} className="img" />
            <div className="">
              <button
                className="closeBtnIMG btn btn-danger text-dark d-flex justify-content-center align-items-center"
                onClick={() => handleDeleteFile(file)}
              >
                x
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Images;
