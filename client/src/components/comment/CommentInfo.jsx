import React, { useEffect, useState } from "react";
import "./commentInfo.css";
import { toast } from "react-toastify";
import DisplayImg from "../displayimg/DisplayImg";
import { PermMedia } from "@material-ui/icons";
import { putDataAPI } from "../../api/fetchData";
import { v4 as uuidv4 } from "uuid";
import { removeImage, imageUpload } from "../../helpers/image";
import { useSelector } from "react-redux";

const CommentInfo = ({
  post,
  user,
  comment,
  isEdit,
  setIsEdit,
  setMessages,
}) => {
  const [images, setImages] = useState([]);
  const [text, setText] = useState(comment?.text || "");
  const [files, setFiles] = useState([]);

  const { socket } = useSelector((state) => state.network);

  const { userCurrent } = useSelector((state) => state.auth);

  useEffect(() => {
    setImages(comment?.images);
  }, [comment?.images]);

  const handleReset = (comment) => {
    setImages(comment?.images);
    setText(comment?.text || "");
    setFiles([]);
    setIsEdit(false);
  };

  const updateComment = async () => {
    try {
      let newImages = images ? [...images] : [];

      const imagesRemove = comment?.images.filter((image) => {
        return !newImages.find((newImage) => image.url === newImage.url);
      });

      if (imagesRemove.length) {
        removeImage(imagesRemove.map((image) => image.public_id));
      }

      const responseImages = await imageUpload(files);
      newImages = [...newImages, ...responseImages];

      const response = await putDataAPI(
        `/comment/update-comment/${comment?._id}`,
        {
          text,
          images: newImages,
          userId: userCurrent?._id,
          isEdit: true,
        }
      );

      const { message, newComment } = response;
      console.log("newComment", newComment);

      toast.success(message, { autoClose: 2000 });

      socket?.emit("commentPostHandler", {
        type: "update",
        comment: newComment,
        postId: post?._id,
        userPost: post.userId,
        message: userCurrent?.userName + "updated comment on your post",
      });

      setMessages((prev) =>
        prev.map((item) => (item._id === newComment._id ? newComment : item))
      );

      handleReset(newComment);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className={`commentInfo ${isEdit && "edit"}`}>
      {isEdit ? (
        <>
          <div className={`editCommentContainer`}>
            <input
              className="editCommentInput"
              type="text"
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={() => handleReset()}
              type="button"
              className="btn btn-secondary 
              btnEdit btnCancelEdit "
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-success
              btnEdit btnConfirmEdit"
              onClick={updateComment}
            >
              Edit
            </button>
          </div>
          <div className="editImgPost">
            <div className="editImgPostTop">
              <div className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />

                <span className="shareOptionText">Posted photo</span>
              </div>
            </div>

            <div className="disPlayImgCreateComment">
              {images &&
                images.map((image) => (
                  <div className="imgContainer" key={image.url}>
                    <DisplayImg image={image.url} setImages={setImages} />
                  </div>
                ))}
            </div>

            <div className="editImgPostTop">
              <label
                htmlFor={"editEomment" + comment._id}
                className="shareOption"
              >
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Add Photo or Video</span>
              </label>
              <input
                style={{ display: " none" }}
                type={"file"}
                id={"editEomment" + comment._id}
                accept=".png,.jpeg,.jpg"
                multiple
                onChange={(e) => {
                  const data = Array.from(e.target.files);
                  setFiles((prev) => [
                    ...prev,
                    ...data.map((file) => {
                      file.uuid = uuidv4();
                      return file;
                    }),
                  ]);
                }}
              />
            </div>

            <div className="disPlayImgCreateComment">
              {files.map((file) => (
                <div className="imgContainer" key={file.uuid}>
                  <DisplayImg file={file} setFiles={setFiles} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="commentInfoTop">
            <span className="commentUserName">{user?.userName}</span>
            <span className="commentText">{comment?.text}</span>
          </div>
          <div className="commentInfoImgContainer">
            {comment.images.map((image, idx) => (
              <img
                className="commentInfoImg"
                key={image.url}
                style={{
                  width: `${
                    comment.images.length % 2 !== 0
                      ? idx === comment.images.length - 1
                        ? "100%"
                        : "calc(100%/2)"
                      : "calc(100%/2)"
                  }`,
                }}
                src={image && image.url}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentInfo;
