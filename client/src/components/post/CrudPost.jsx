import React from "react";
import "./crudPost.css";
import { Link, useNavigate } from "react-router-dom";

const CrudPost = ({ id, setIsEdit }) => {
  const navigate = useNavigate();
  return (
    <>
      <>
        <button className="detailPost" onClick={() => navigate("/post/" + id)}>
          Detail Post
        </button>
        <button
          className="updatePost"
          onClick={() => setIsEdit((prev) => !prev)}
        >
          Edit
        </button>

        <button
          type="button"
          className="removePost"
          data-toggle="modal"
          data-target={"#" + id}
        >
          Remove
        </button>
      </>
    </>
  );
};

export default CrudPost;
