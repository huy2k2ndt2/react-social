import React, { useState } from "react";
import ChooseImage from "../chooseImage/ChooseImage";
import { useDispatch } from "react-redux";

const ModalChooseImage = ({
  height,
  width,
  id,
  text,
  multiple,
  typeImage,
  onSave,
}) => {
  const [files, setFiles] = useState([]);
  const [isTakePhoto, setIsTakePhoto] = useState(false);

  const handleSave = () => {
    onSave(files, typeImage);
    setFiles([]);
    setIsTakePhoto(false);
  };

  return (
    <>
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className={`modal-dialog chooseImgage`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {`${text}`}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setIsTakePhoto(false);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ChooseImage
                setIsTakePhoto={setIsTakePhoto}
                isTakePhoto={isTakePhoto}
                files={files}
                height={height}
                width={width}
                setFiles={setFiles}
                multiple={multiple}
                id={id}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleSave}
                data-dismiss="modal"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  setIsTakePhoto(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalChooseImage;
