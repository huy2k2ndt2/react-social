import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import { useState, useRef } from "react";
import { NO_AVATAR } from "../../contants/imgContant";
import { toast } from "react-toastify";
import DisplayImg from "../displayimg/DisplayImg";
import { Link } from "react-router-dom";
import { postDataAPI } from "../../api/fetchData";
import { useSelector } from "react-redux";
import ModalChooseImage from "../modal/ModalChooseImage";
import { v4 as uuidv4 } from "uuid";
import { imageUpload } from "../../helpers/image";
import Avatar from "../avatar/Avatar";

export default function Share({ setPosts }) {
  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);

  const [files, setFiles] = useState([]);
  const descRef = useRef();
  const id = useRef(uuidv4());

  const handleSaveImages = (files) => {
    setFiles((prev) => [...prev, ...files]);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!files.length && !descRef.current.value) {
      return toast.info("Please enter information to create a post", {
        autoClose: 1000,
      });
    }

    const newPost = {
      desc: descRef.current.value,
      userId: userCurrent?._id,
      images: [],
    };

    const images = await imageUpload(files);

    newPost.images = images;
    try {
      const response = await postDataAPI("/post", newPost);
      const { message, post } = response;

      descRef.current.value = "";
      toast.success(message, { autoClose: 2000 });

      const responses = await Promise.all(
        userCurrent.followings.map((userFollowingId) =>
          postDataAPI("/notification", {
            link: "/post/" + post?._id,
            receiverId: userFollowingId,
            text: userCurrent?.userName + " created a new post",
            senderId: userCurrent?._id,
          })
        )
      );

      const dataEmit = [];
      responses.forEach((response) =>
        dataEmit.push(response?.data?.notification)
      );

      socket?.emit("createPost", {
        dataEmit,
      });

      // socket.emit("postHandler", {
      //   post,
      //   userFollowings: userCurrent?.followings,
      //   message: `${userCurrent?.userName} just made a new post`,
      // });

      setPosts((prev) => [post, ...prev]);
      setFiles([]);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <Avatar user={userCurrent} width="50px" height="50px" />

          <input
            required
            placeholder={`What's in your mind ${userCurrent?.userName} ?`}
            className="shareInput"
            ref={descRef}
          />
        </div>
        <hr className="shareHr" />
        <form className="" onSubmit={handleCreatePost}>
          <div className="shareBottom">
            <div className="shareOptions">
              <button
                type={"button"}
                data-target={`#${id.current}`}
                data-toggle="modal"
                className="shareOption"
                style={{
                  border: 0,
                  outline: 0,
                  backgroundColor: "transparent",
                }}
              >
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo or Video</span>
              </button>
              <div className="shareOption">
                <Label htmlColor="blue" className="shareIcon" />
                <span className="shareOptionText">Tag</span>
              </div>
              <div className="shareOption">
                <Room htmlColor="green" className="shareIcon" />
                <span className="shareOptionText">Location</span>
              </div>
              <div className="shareOption">
                <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                <span className="shareOptionText">Feelings</span>
              </div>
            </div>
            <button type={"submit"} className="shareButton">
              Share
            </button>
          </div>

          <div className="shareImgContainer">
            {files.map((file) => {
              return (
                <div className="imgContainer" key={file.uuid}>
                  <DisplayImg file={file} setFiles={setFiles} />
                </div>
              );
            })}
          </div>
        </form>
      </div>
      <ModalChooseImage
        onSave={handleSaveImages}
        height={"150px"}
        multiple={true}
        id={id.current}
        text={"Choose a photo for the post"}
      />
    </div>
  );
}
