import "./commentReply.css";
import React, { useEffect, useState, useRef } from "react";
import * as timeago from "timeago.js";
import { toast } from "react-toastify";
import Avatar from "../avatar/Avatar";
import CommentInfo from "../comment/CommentInfo";
import CommentCrud from "../comment/CommentCrud";
import ModalConfirmDelete from "../modal/ModalConfirmDelete";
import { getDataAPI, putDataAPI, deleteDataAPI } from "../../api/fetchData";
import { useSelector } from "react-redux";

function CommentReply({ comment, commentReply, setCommentsReply }) {
  const [like, setLike] = useState();
  const [user, setUser] = useState({});
  const [isCrudComment, setIsCrudComment] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { userCurrent } = useSelector((state) => state.auth);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setLike(commentReply?.likes.length);
    setIsLiked(commentReply?.likes.includes(userCurrent._id));
  }, [commentReply?.likes, userCurrent?._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getDataAPI(
          `/user?userId=${commentReply?.userId}`
        );

        const { user } = response;
        setUser(user);
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchUser();
  }, [commentReply]);

  useEffect(() => {
    const handleCheckClick = (e) => {
      if (isCrudComment) {
        setIsCrudComment(false);
      }
    };

    document.body.addEventListener("click", handleCheckClick);

    return () => document.body.removeEventListener("click", handleCheckClick);
  }, [isCrudComment]);

  const likeHandler = async () => {
    try {
      const response = isLiked
        ? await putDataAPI(`/comment/unlike-comment/${commentReply._id}`, {
            userId: userCurrent._id,
          })
        : await putDataAPI(`/comment/like-comment/${commentReply._id}`, {
            userId: userCurrent._id,
          });
      const { message } = response;
      toast.success(message, { autoClose: 1000 });
    } catch (err) {
      console.log("err", err);
    }
    setIsLiked(!isLiked);
    setLike(isLiked ? like - 1 : like + 1);
  };

  const handleRemoveCommnetReply = async () => {
    try {
      const response = await deleteDataAPI(
        `/comment/remove-comment-reply/${comment._id}/${commentReply._id}/${userCurrent._id}`
      );

      const { message } = response;
      toast.success(message, { autoClose: 1000 });

      setCommentsReply((prev) =>
        prev.filter((item) => item._id !== commentReply._id)
      );
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="commentReplyContainer">
        <div className="commentReplyLeft">
          <Avatar user={userCurrent} />
        </div>
        <div className="commentReplyRight">
          <div className="commentReplyRightTop">
            <CommentInfo
              user={userCurrent}
              comment={commentReply}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              setMessages={setCommentsReply}
            />

            {commentReply?.userId === userCurrent._id && (
              <div
                className="commentCrud"
                onClick={() => setIsCrudComment(!isCrudComment)}
              >
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAHVJREFUSEtjZKAxYKSx+QyjFhAM4dEgGqFB5MDAwDAf6vdEBgaGA1A2qeJgbdhS0QMGBgZ5qKEgtiISmxRxnBZ8YGBg4Ica+pCBgUEByiZVHKcFoKBYADU0AS2ISBHHaQHBpEeKgtGcTDC0RoNoNIgIhgBBBQBNkxgZxgF3rgAAAABJRU5ErkJggg==" />

                {isCrudComment && (
                  <CommentCrud
                    id={commentReply._id}
                    onRemoveComment={handleRemoveCommnetReply}
                    setIsEdit={setIsEdit}
                  />
                )}
              </div>
            )}
          </div>
          <div className="commentReplyAction">
            <div className="commentReplyLikeContainer">
              <span
                className={`commentReplyLike ${isLiked && "like"}`}
                onClick={likeHandler}
              >
                Like
              </span>
              <span className="commentReplyNumberLike">{like}</span>
            </div>

            <span className="commentRefDate">
              {timeago.format(commentReply?.createdAt)}
            </span>

            {commentReply.isEdit && <span className="showIsEdit">Edited</span>}
          </div>
        </div>

        <ModalConfirmDelete
          id={commentReply?._id}
          onRemove={handleRemoveCommnetReply}
          text="this comment ?"
        />
      </div>
    </>
  );
}

export default CommentReply;
