import React from "react";

const renderHTML = (html) => {
  return React.createElement("div", {
    dangerouslySetInnerHTML: { __html: html },
  });
};

export { renderHTML };
