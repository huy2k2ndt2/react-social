import React from "react";
import { useSelector } from "react-redux";
import ButtonFollow from "./ButtonFollow";
import ButtonFriend from "./ButtonFriend";
import ButtonMessage from "./ButtonMessage";
import "./profileButtonActions.scss";

const ProfileButtonAction = () => {
  const { isMe } = useSelector((state) => state.profile);

  return (
    <>
      {!isMe ? (
        <div className="card-profile__action">
          <ButtonFriend />
          <ButtonFollow />
          <ButtonMessage />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfileButtonAction;
