import React, { useRef } from "react";
import "./createComment.css";
import { PermMedia } from "@material-ui/icons";
import DisplayImg from "../../displayimg/DisplayImg";
import Avatar from "../../avatar/Avatar";
import { v4 as uuidv4 } from "uuid";

const CreateComment = ({ onCreateComment, user, setFiles, files, id }) => {
  const commentRef = useRef();

  return (
    <>
      <form
        className="createComment"
        onSubmit={(e) => {
          onCreateComment(e, commentRef.current.value);
          commentRef.current.value = "";
        }}
      >
        <div className="createCommentInput">
          <Avatar width={"50px"} height={"50px"} user={user} />
          <div className="createCommentInputTop">
            <input
              autoFocus
              type="text"
              ref={commentRef}
              placeholder={"Enter comment..."}
            />

            <label htmlFor={"filesCreateComment" + id} className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
            </label>
            <input
              style={{ display: " none" }}
              type={"file"}
              id={"filesCreateComment" + id}
              accept=".png,.jpeg,.jpg"
              multiple
              onChange={(e) => {
                const data = Array.from(e.target.files);
                setFiles([
                  ...data.map((file) => {
                    file.uuid = uuidv4();
                    return file;
                  }),
                ]);
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary btnCreateComment">
            Send
          </button>
        </div>
        <div className="disPlayImgCreateComment">
          {files.map((file) => (
            <div className="imgContainer" key={file.uuid}>
              <DisplayImg file={file} setFiles={setFiles} />
            </div>
          ))}
        </div>
      </form>
    </>
  );
};

export default CreateComment;
