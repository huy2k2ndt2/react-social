import { Cancel } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_FILE } from "../../redux/actions";

const DisplayImageMessage = () => {
  const { files } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  return (
    <div
      className="display-image-message"
      style={{
        padding: `${files.length && "10px"}`,
      }}
    >
      {files.map((file) => (
        <div className="imgMessage" key={file.uuid}>
          <img src={URL.createObjectURL(file)} />
          <span
            className="imgCancel"
            onClick={() =>
              dispatch({
                type: REMOVE_FILE,
                payload: file.uuid,
              })
            }
          >
            <Cancel />
          </span>
        </div>
      ))}
    </div>
  );
};

export default DisplayImageMessage;
