import React from "react";
import "./buttonSocials.scss";

const ButtonSocials = () => {
  return (
    <ul className="button-socials">
      <li>
        <span className="facebook">
          <i className="fab fa-facebook " aria-hidden="true"></i>
        </span>
      </li>
      <li>
        <span className="twitter">
          <i className="fab fa-twitter " aria-hidden="true"></i>
        </span>
      </li>
      <li>
        <span className="google">
          <i className="fab fa-google-plus-g " aria-hidden="true"></i>
        </span>
      </li>
      <li>
        <span className="linkedin">
          <i className="fab fa-linkedin " aria-hidden="true"></i>
        </span>
      </li>
      <li>
        <span className="instagram">
          <i className="fab fa-instagram " aria-hidden="true"></i>
        </span>
      </li>
    </ul>
  );
};

export default ButtonSocials;
