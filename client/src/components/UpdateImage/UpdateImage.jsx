import "./updateImage.scss";

import React from "react";
import { PermMedia } from "@material-ui/icons";

const UpdateImage = ({ text, id, type }) => {
  return (
    <div className={`updateImage ${type}`}>
      <button
        data-toggle="modal"
        data-target={`#${id}`}
        className="shareOption"
      >
        <PermMedia htmlColor="tomato" className="shareIcon" />
        <span className="shareOptionText">{text}</span>
      </button>
    </div>
  );
};

export default UpdateImage;
