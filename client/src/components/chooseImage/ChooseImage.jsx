import React, { useEffect, useRef, useState } from "react";
import { PermMedia } from "@material-ui/icons";
import Displayimg from "../displayimg/DisplayImg";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const ChooseImage = ({
  setIsTakePhoto,
  isTakePhoto,
  files,
  height,
  width,
  id,
  multiple,
  setFiles,
}) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [videoStream, setVideoStream] = useState();
  // camera truoc
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const [notify, setNotify] = useState("");
  const [isStop, setIsStop] = useState(false);

  const constraints = useRef({
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440,
      },
    },
  });

  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const init = async () => {
    stopVideoStream();
    constraints.current.video.facingMode = useFrontCamera
      ? "user"
      : "environment";
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        constraints.current
      );

      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setVideoStream(stream);
    } catch (error) {
      setNotify("An error occurred while starting the camera");
    }
  };

  useEffect(() => {
    if (!isTakePhoto) {
      videoRef?.current?.pause();
      stopVideoStream();
      setVideoStream();
      return;
    }
    if (
      !"mediaDevices" in navigator ||
      !"getUserMedia" in navigator.mediaDevices
    ) {
      setNotify("Not support API camera");
      return;
    }

    init();

    return () => {
      videoRef?.current?.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [isTakePhoto, useFrontCamera]);

  const handleTakePhoto = () => {
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0);

    const image = canvasRef.current.toDataURL("image/png");

    if (multiple) {
      setFiles((prev) => [
        ...prev,
        {
          camera: true,
          url: image,
          uuid: uuidv4(),
        },
      ]);
    } else {
      setFiles([
        {
          camera: true,
          url: image,
          uuid: uuidv4(),
        },
      ]);
    }
  };

  const handleChangeVideo = () => {
    setUseFrontCamera((prev) => !prev);
  };

  return (
    <div>
      <div className="optionUploadImage">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsTakePhoto(false)}
        >
          Upload photos
        </button>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => setIsTakePhoto(true)}
        >
          Take a photo
        </button>
      </div>
      <div className="uploadImageContent">
        {!isTakePhoto ? (
          <div className="uploadImageContentTop">
            <label htmlFor={`file${id}`} className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">{"Choose photo"}</span>
            </label>
            <input
              multiple={multiple}
              style={{ display: " none" }}
              type={"file"}
              id={`file${id}`}
              accept=".png,.jpeg,.jpg"
              onChange={(e) => {
                const data = Array.from(e.target.files).map((file) => {
                  file.uuid = uuidv4();
                  return file;
                });

                if (multiple) {
                  setFiles((prev) => [...prev, ...data]);
                } else {
                  setFiles([...data]);
                }
              }}
            />
          </div>
        ) : (
          <>
            <div className="takeVideoTop">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (isStop) videoRef.current.play();
                  else videoRef.current.pause();

                  setIsStop((prev) => !prev);
                }}
              >
                {`${isStop ? "Play" : "Stop"} video`}
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleTakePhoto}
              >
                Shot
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={handleChangeVideo}
              >
                Change camera
              </button>
            </div>
            <div className="takeVideoBody">
              {notify ? notify : <video ref={videoRef}></video>}
              <canvas
                style={{
                  display: "none",
                }}
                ref={canvasRef}
              ></canvas>
            </div>
          </>
        )}

        <div className="uploadImageContentBody">
          <div className="shareImgContainer">
            {files.map((file) => {
              return (
                <div
                  className="imgContainer"
                  style={{
                    width: width,
                    height: height,
                  }}
                  key={file.uuid}
                >
                  <Displayimg file={file} setFiles={setFiles} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseImage;
