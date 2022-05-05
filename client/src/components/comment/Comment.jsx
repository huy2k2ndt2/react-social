import "./comment.css";
import React, { useEffect, useState
  , useRef } from "react";
import * as timeago from "timeago.js";
import { toast } from "react-toastify";
import CommentReply from "../commentReply/CommentReply";
import ModalConfirmDelete from "../modal/ModalConfirmDelete";
import CreateComment from "../form/createComment/CreateComment";
import CommentCrud from "./CommentCrud";
import CommentInfo from "./CommentInfo";
import Avatar from "../avatar/Avatar";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { getDataAPI, putDataAPI, postDataAPI } from "../../api/fetchData";
import { imageUpload } from "../../helpers/image";

function Comment({ comment, post, setComments }) {
  const [like, setLike] = useState();
  const [user, setUser] = useState({});
  const [isShowCommentsReply, setIsShowCommentsReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [commentsReply, setCommentsReply] = useState([]);
  const [isCrudComment, setIsCrudComment] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);

  const idCreateComment = useRef(uuidv4());

  useEffect(() => {
    const handleCheckClick = (e) => {
      if (isCrudComment) {
        setIsCrudComment(false);
      }
    };

    document.body.addEventListener("click", handleCheckClick);

    return () => document.body.removeEventListener("click", handleCheckClick);
  }, [isCrudComment]);

  useEffect(() => {
    setLike(comment?.likes.length);
    setIsLiked(comment?.likes.includes(userCurrent._id));
  }, [comment?.likes, userCurrent?._id]);

  useEffect(() => {
    let isMount = true;
    const fetchUser = async () => {
      try {
        const response = await getDataAPI(`/user?userId=${comment?.userId}`);

        const { user } = response;
        if (isMount) setUser(user);
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchUser();

    return () => (isMount = false);
  }, [comment]);

  useEffect(() => {
    let isMount = true;
    const handleGetCommentReply = async () => {
      try {
        const response = await getDataAPI(
          `/comment/get-all-comments-reply/${comment?._id}`
        );

        const { message, comments } = response;

        if (isMount) setCommentsReply(comments);
      } catch (err) {
        console.log("err", err);
      }
    };
    if (isShowCommentsReply) {
      handleGetCommentReply();
    }

    return () => (isMount = false);
  }, [isShowCommentsReply]);

  const likeHandler = async () => {
    try {
      const response = isLiked
        ? await putDataAPI(`/comment/unlike-comment/${comment._id}`, {
            userId: userCurrent._id,
          })
        : await putDataAPI(`/comment/like-comment/${comment._id}`, {
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

  const handleCreateCommentReply = async (e, text) => {
    e.preventDefault();

    try {
      if (!text && !files.length) {
        return toast.info("Please enter data to comment", { autoClose: 2000 });
      }
      const commentInfo = {
        postId: post?._id,
        userId: user?._id,
        text,
      };

      const images = await imageUpload(files);
      commentInfo.images = [...images];

      const response = await postDataAPI(`/comment`, commentInfo);

      const { comment: commentReply, message } = response;

      const responseToAddCommentReply = await postDataAPI(
        `/comment/add-comment-reply/${comment?._id}`,
        {
          commentReplyId: commentReply._id,
        }
      );

      if (isShowCommentsReply) {
        setCommentsReply((prev) => [commentReply, ...prev]);
      }

      setFiles([]);
      setIsShowCommentsReply(true);

      toast.success(message, { autoClose: 2000 });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleRemoveComment = async () => {
    try {
      const response = await postDataAPI(`/post/remove-comment/${post?._id}`, {
        commentId: comment?._id,
        userId: userCurrent?._id,
      });

      const { message } = response;
      toast.success(message, { autoClose: 2000 });

      setComments((prev) =>
        prev.filter((commentPost) => commentPost._id !== comment._id)
      );

      socket?.emit("commentPostHandler", {
        type: "remove",
        comment,
        postId: post?._id,
        userPost: post.userId,
        message: userCurrent?.userName + " deleted the comment on your post",
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="commentLeft">
        <Avatar user={user} />
      </div>
      <div className="commentRight">
        <div className="commentRightTop">
          <CommentInfo
            post={post}
            user={user}
            comment={comment}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setMessages={setComments}
          />

          {comment?.userId === userCurrent?._id && (
            <div
              className="commentCrud"
              onClick={() => setIsCrudComment(!isCrudComment)}
            >
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAHVJREFUSEtjZKAxYKSx+QyjFhAM4dEgGqFB5MDAwDAf6vdEBgaGA1A2qeJgbdhS0QMGBgZ5qKEgtiISmxRxnBZ8YGBg4Ica+pCBgUEByiZVHKcFoKBYADU0AS2ISBHHaQHBpEeKgtGcTDC0RoNoNIgIhgBBBQBNkxgZxgF3rgAAAABJRU5ErkJggg==" />

              {isCrudComment && (
                <CommentCrud
                  id={comment?._id}
                  onRemoveComment={handleRemoveComment}
                  setIsEdit={setIsEdit}
                />
              )}
            </div>
          )}
        </div>

        <div className="commentAction">
          <div className="commentLikeContainer">
            <span
              className={`commentLike ${isLiked && "like"}`}
              onClick={likeHandler}
            >
              Like
            </span>
            <span className="commentNumberLike">{like}</span>
          </div>
          <span
            className="reply"
            onClick={() => {
              setIsComment(!isComment);
            }}
          >
            Reply
          </span>
          <span className="commentDate">
            {timeago.format(comment?.createdAt)}
          </span>
          <span
            className="showFeedback"
            onClick={() => setIsShowCommentsReply(!isShowCommentsReply)}
          >
            feedbacks
          </span>

          {comment.isEdit && <span className="showIsEdit">Edited</span>}
        </div>

        <div className="comentBottom">
          {isComment && (
            <CreateComment
              id={idCreateComment.current}
              files={files}
              setFiles={setFiles}
              user={userCurrent}
              onCreateComment={handleCreateCommentReply}
            />
          )}

          {isShowCommentsReply &&
            commentsReply.map((commentReply) => (
              <CommentReply
                comment={comment}
                setCommentsReply={setCommentsReply}
                key={commentReply?._id}
                commentReply={commentReply}
              />
            ))}
        </div>

        <ModalConfirmDelete
          text="this comment ?"
          id={comment?._id}
          onRemove={handleRemoveComment}
        />
      </div>
    </>
  );
}

export default Comment;
