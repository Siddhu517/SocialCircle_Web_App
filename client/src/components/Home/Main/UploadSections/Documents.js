import React from "react";
import "./addDocument.css";

const Documents = ({ files, handleDeleteFile }) => {
  return (
    <div className="documents d-flex">
      {files &&
        files.map((file, index) => (
          <div key={index} className="">
            <embed
              src={URL.createObjectURL(file)}
              type="application/pdf"
              className="document"
            />

            <div className="">
              <button
                className="closeBtnIMG"
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

export default Documents;
