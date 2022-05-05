import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";

export default function Feed({ userName }) {
  const [posts, setPosts] = useState([]);

  const { socket } = useSelector((state) => state.network);

  const { userCurrent, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleUpdateFeed = ({ post, type, message }) => {
      toast.info(message, { autoClose: 2000 });

      setPosts((prev) =>
        type === "removePost"
          ? prev.filter((postFeed) => postFeed?._id !== post?._id)
          : type === "updatePost"
          ? prev.map((postFeed) =>
              postFeed?._id !== post?._id ? postFeed : post
            )
          : [post, ...prev]
      );
    };

    if (socket) {
      socket.on("updateFeed", handleUpdateFeed);
    }

    return () => {
      socket?.off("updateFeed", handleUpdateFeed);
    };
  }, [socket]);

  useEffect(() => {
    let isMount = true;

    const fetchPosts = async () => {
      try {
        if (userName || userCurrent?._id) {
          const response = userName
            ? await getDataAPI(`/post/profile/${userName}`)
            : await getDataAPI(`/post/get-all-post/${userCurrent?._id}`);

          const { posts } = response;
          if (isMount) {
            setPosts(
              posts.sort(
                (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
              )
            );
          }
        }
      } catch (err) {}
    };
    fetchPosts();

    return () => (isMount = false);
  }, [userName, userCurrent?._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!userName || userName === userCurrent?.userName) && (
          <Share setPosts={setPosts} />
        )}
        {posts.map((p) => (
          <Post setPosts={setPosts} key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
