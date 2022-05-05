import React from "react";

const CommentCrud = ({ id, setIsEdit }) => {
  return (
    <>
      <div className="commentCrudAction">
        <button
          className="updateComment"
          onClick={() => setIsEdit((prev) => !prev)}
        >
          Edit
        </button>

        <button
          type="button"
          className="removeComment"
          data-toggle="modal"
          data-target={"#" + id}
        >
          Remove
        </button>
      </div>
    </>
  );
};

export default CommentCrud;
