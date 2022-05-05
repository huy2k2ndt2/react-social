import React, { useRef, useState } from "react";
import "./modal.css";
import { Button, Modal } from "react-bootstrap";
import { PermMedia } from "@material-ui/icons";
import { toast } from "react-toastify";
import DisplayImg from "../displayimg/DisplayImg";
import { putDataAPI, postDataAPI } from "../../api/fetchData";
import { v4 as uuidv4 } from "uuid";
import { removeImage, imageUpload } from "../../helpers/image";
import ChooseImage from "../chooseImage/ChooseImage";
import { useSelector } from "react-redux";

const ModalEditPost = ({ setPosts, post, setIsEdit }) => {
  const [images, setImages] = useState(post?.images);
  const [desc, setDesc] = useState(post?.desc || "");
  const [files, setFiles] = useState([]);
  const [isTakePhoto, setIsTakePhoto] = useState(false);

  const id = useRef(uuidv4());

  const { socket } = useSelector((state) => state.network);

  const { userCurrent } = useSelector((state) => state.auth);
  const updatePost = async () => {
    try {
      let newImages = [...images];

      const imagesRemove = post?.images.filter((image) => {
        return !newImages.find((newImage) => image.url === newImage.url);
      });

      if (imagesRemove.length) {
        removeImage(imagesRemove.map((image) => image.public_id));
      }

      const responseImages = await imageUpload(files);
      newImages = [...newImages, ...responseImages];

      const response = await putDataAPI(`/post/${post?._id}`, {
        desc,
        images: newImages,
        userId: userCurrent._id,
      });

      const { message, newPost } = response;

      toast.success(message, { autoClose: 2000 });

      setPosts((prev) =>
        prev.map((item) => (item._id === newPost._id ? newPost : item))
      );

      socket?.emit("postHandler", {
        type: "updatePost",
        post: newPost,
        userFollowings: userCurrent?.followings,
        message: `${userCurrent?.userName} just edit a new post`,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleClose = () => {
    setImages(post?.images);
    setDesc(post?.desc || "");
    setFiles([]);
    setIsEdit(false);
  };

  return (
    <>
      <Modal show={true} onHide={handleClose} className="modalEditContainer">
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={"modalEditPostBody"}>
          <div className="editDescPost">
            <textarea
              className="editDescPostInput"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              autoFocus
              row={1000}
            ></textarea>
          </div>

          <div className="editImgPost">
            <div className="editImgPostTop">
              <div className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Posted photo</span>
              </div>
            </div>

            <div className="disPlayImgCreateComment">
              {images.map((image) => (
                <div className="imgContainer" key={image.url}>
                  <DisplayImg image={image.url} setImages={setImages} />
                </div>
              ))}
            </div>

            <ChooseImage
              setIsTakePhoto={setIsTakePhoto}
              isTakePhoto={isTakePhoto}
              files={files}
              id={id.current}
              multiple={true}
              setFiles={setFiles}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updatePost();
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditPost;
