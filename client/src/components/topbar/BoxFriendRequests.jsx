import React from "react";
import "./boxFriendRequests.scss";
import DisplayFriendRequest from "../friendRequest/DisplayFriendRequest";
import { SET_TYPE } from "../../redux/actions";
import { useDispatch } from "react-redux";

const BoxFriendRequests = () => {
  const dispatch = useDispatch();

  return (
    <div className="boxFriendRequest nav-item dropdown">
      <h3 className="title">Options</h3>
      <div className="button-options">
        <button
          type="button"
          className="btn btn-success"
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: "received",
            })
          }
        >
          Friend request received
        </button>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() =>
            dispatch({
              type: SET_TYPE,
              payload: "sent",
            })
          }
        >
          Friend request sent
        </button>
      </div>
      <DisplayFriendRequest />
      <div className="friendRequest"></div>
    </div>
  );
};

export default BoxFriendRequests;
