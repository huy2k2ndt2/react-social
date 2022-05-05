import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDataAPI } from "../../api/fetchData";
import Avatar from "../avatar/Avatar";
import ButtonActionsFriendRequest from "./ButtonActionsFriendRequest";

const FriendRequest = ({ friendRequest }) => {
  const [user, setUser] = useState();

  const { type } = useSelector((state) => state.friendRequest);

  useEffect(() => {
    let isMount = true;

    const handleGetUser = async () => {
      try {
        const id =
          type === "received"
            ? friendRequest?.senderId
            : friendRequest?.receiverId;
        if (!id) {
          toast.error("id user not found", { autoClose: 1000 });
          throw new Error("id user not found");
        }
        const response = await getDataAPI(`/user?userId=${id}`);

        const { message, user } = response;

        if (isMount) setUser(user);
      } catch (err) {
        console.log("err", err);
      }
    };

    handleGetUser();

    return () => (isMount = false);
  }, []);

  return (
    <>
      {user && (
        <>
          <div className="info">
            <Avatar height="60px" width="60px" user={user} />
            <span>{user?.userName}</span>
          </div>
          <ButtonActionsFriendRequest
            user={user}
            friendRequest={friendRequest}
          />
        </>
      )}
    </>
  );
};

export default FriendRequest;
