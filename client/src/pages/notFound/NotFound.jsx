import React from "react";
import { Link } from "react-router-dom";
import "./notFound.scss";

const NotFound = () => {
  return (
    <div className="pageNotFound">
      <h1>404 Error Page</h1>
      <p className="zoom-area">
        <b>Page Not Found</b>
      </p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <Link to="/" className="more-link">
          Visit page Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
