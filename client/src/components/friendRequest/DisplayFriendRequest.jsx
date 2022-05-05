import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendRequest from "./FriendRequest";
import { getDataAPI } from "../../api/fetchData";
import { SET_LIST_FRIEND_REQUEST } from "../../redux/actions";

const DisplayFriendRequest = () => {
  const { type, listFriendRequest } = useSelector(
    (state) => state.friendRequest
  );

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;

    const getFriendRequest = async () => {
      if (type) {
        try {
          const response = await getDataAPI(
            `/friend-request/get-all-requests-${type}`
          );

          const { message, friendRequests } = response;

          // toast.success(message, { autoClose: 2000 });
          if (isMount) {
            dispatch({
              type: SET_LIST_FRIEND_REQUEST,
              payload: friendRequests,
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getFriendRequest();

    return () => (isMount = false);
  }, [type]);

  return (
    <>
      {listFriendRequest &&
        listFriendRequest.map((friendRequest) => (
          <div className="friendRequest" key={friendRequest?._id}>
            <FriendRequest friendRequest={friendRequest} />
          </div>
        ))}
    </>
  );
};

export default DisplayFriendRequest;
