import React from "react";
import "./displayImg.css";
import { Cancel } from "@material-ui/icons";

const Displayimg = ({ image, file, setImages, setFiles }) => {
  return (
    <>
      <img
        src={image ? image : file.camera ? file.url : URL.createObjectURL(file)}
      />
      <span
        className="imgCancel"
        onClick={() =>
          image
            ? setImages((prev) => prev.filter((item) => item.url !== image))
            : setFiles((prev) => prev.filter((item) => item.uuid !== file.uuid))
        }
      >
        <Cancel />
      </span>
    </>
  );
};

export default Displayimg;
