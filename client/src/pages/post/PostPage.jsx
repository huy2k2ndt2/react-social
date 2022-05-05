import "../home/home.css";
import "./postPage.css";

import React, { useState, useEffect } from "react";
import Post from "../../components/post/Post";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Topbar from "../../components/topbar/Topbar";
import { getDataAPI } from "../../api/fetchData";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    let isMount = true;

    const fetchPost = async () => {
      try {
        const response = await getDataAPI(`/post/${postId}`);

        const { post } = response;
        if (isMount) {
          setPost(post);
        }
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchPost();

    return () => (isMount = false);
  }, [postId]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <div className="postPageContainer">
          {post && <Post post={post} className="postPage" />}
        </div>
        <Rightbar />
      </div>
    </>
  );
};

export default PostPage;
