import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useFormatTime from "../../hooks/useFormatTime";
import StatusActive from "../statusActive/StatusActive";
import "./avatar.scss";
import { displayAvatar } from "../../helpers/image";
import { useSelector } from "react-redux";
import useCheckOnline from "../../hooks/useCheckOnline";

const Avatar = ({
  isStatus = true,
  user,
  width,
  height,
  link = true,
  isShowOffline = true,
  className = "",
}) => {
  const [status, setStatus] = useState();
  const [isOnline, setIsOnline] = useCheckOnline(user);

  const { userCurrent } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userCurrent || !user) return;
    setStatus(
      userCurrent._id === user._id
        ? true
        : userCurrent.friends.includes(user._id)
    );
  }, [user, userCurrent]);

  const time = useFormatTime(user);

  const src = useMemo(() => displayAvatar(user), [user]);

  return (
    <>
      {link ? (
        <Link
          to={`/profile/${user?._id}`}
          style={{
            width,
            height,
          }}
          className={`avatarContainer ${className}`}
        >
          <img className="avatarImg" src={src} alt="" />

          {status && isStatus ? (
            isShowOffline ? (
              time && <StatusActive isOnline={isOnline} time={time} />
            ) : (
              isOnline &&
              time && <StatusActive isOnline={isOnline} time={time} />
            )
          ) : (
            <></>
          )}
        </Link>
      ) : (
        <div
          className={`avatarContainer ${className}`}
          style={{
            width,
            height,
          }}
        >
          <img className="avatarImg" src={src} alt="" />
          {status && isStatus ? (
            isShowOffline ? (
              time && <StatusActive isOnline={isOnline} time={time} />
            ) : (
              isOnline &&
              time && <StatusActive isOnline={isOnline} time={time} />
            )
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default Avatar;
