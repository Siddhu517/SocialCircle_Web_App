import React from 'react';
import './addVideos.css';

const Videos = ({ files, handleDeleteFile }) => {
  return (
    <div className='videos d-flex'>
      {files &&
        files.map((file, index) => (
          <div key={index} className=''>
            <video >
              <source src={URL.createObjectURL(file)}  />
            </video>
            <div className=''>
              <button
                className='closeBtnvideo btn btn-danger text-dark d-flex justify-content-center align-items-center'
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

export default Videos;
