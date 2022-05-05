import "./friend.scss";
import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import useCheckOnline from "../../hooks/useCheckOnline";

export default function Friend({ friend }) {
  return (
    <Link to={"/profile/" + friend?._id} className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <Avatar user={friend} link={false} />
      </div>
      <span className="rightbarUsername">{friend?.userName}</span>
    </Link>
  );
}
