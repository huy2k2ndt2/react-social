import React from "react";
import "./statusActive.scss";

const StatusActive = ({ isOnline, time, padding }) => {
  return (
    <span
      className={`active ${isOnline ? "online" : "offline"}`}
      style={{ padding: padding }}
    >
      {!isOnline && time}
    </span>
  );
};

export default StatusActive;
