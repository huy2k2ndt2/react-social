import React from "react";
import { STORE_IMG } from "../../contants/imgContant";

const NavModalCall = () => {
  return (
    <nav>
      <img src={STORE_IMG + "logo.png"} alt="" />
      <ul>
        <li>
          <img
            src={STORE_IMG + "live.png"}
            alt=""
            className="icon_modal-active"
          />
        </li>
        <li>
          <img src={STORE_IMG + "video.png"} alt="" />
        </li>
        <li>
          <img src={STORE_IMG + "message.png"} alt="" />
        </li>
        <li>
          <img src={STORE_IMG + "notification.png"} alt="" />
        </li>
        <li>
          <img src={STORE_IMG + "users.png"} alt="" />
        </li>
        <li>
          <img src={STORE_IMG + "setting.png"} alt="" />
        </li>
      </ul>
    </nav>
  );
};

export default NavModalCall;
