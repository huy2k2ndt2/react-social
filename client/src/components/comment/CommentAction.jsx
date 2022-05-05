import React from "react";
import { Link } from "react-router-dom";
import { STORE_IMG, NO_AVATAR } from "../../contants/imgContant";
import * as timeago from "timeago.js";
import CommentReply from "../commentReply/CommentReply";
import CreateComment from "../form/createComment/CreateComment";

const CommentAction = ({ type, user }) => {
  return (
    <></>
    // <>
    //   <div className="commentAction">
    //     <div className="commentLikeContainer">
    //       <span
    //         className={`commentLike ${isLiked && "like"}`}
    //         onClick={likeHandler}
    //       >
    //         Like
    //       </span>
    //       <span className="commentNumberLike">{like}</span>
    //     </div>
    //     <span
    //       className="reply"
    //       onClick={() => {
    //         setIsComment(!isComment);
    //       }}
    //     >
    //       Reply
    //     </span>
    //     <span className="commentDate">
    //       {timeago.format(comment?.createdAt)}
    //     </span>
    //     <span
    //       className="showFeedback"
    //       onClick={() => setIsShowCommentsReply(true)}
    //     >
    //       Show feedback
    //     </span>
    //   </div>
    // </>
  );
};

export default CommentAction;
