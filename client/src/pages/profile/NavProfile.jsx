import React from "react";

const NavProfile = ({ option, setOption }) => {
  const options = ["friends", "about", "posts", "share", "moreOption"];

  return (
    <ul className="nav">
      {options.map((el) => (
        <li
          key={el}
          className={`${option === el ? "choose" : ""}`}
          onClick={() => setOption(el)}
        >
          {el[0].toUpperCase() + el.slice(1)}
        </li>
      ))}
    </ul>
  );
};

export default NavProfile;
