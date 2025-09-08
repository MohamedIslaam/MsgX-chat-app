import React from "react";
import "./Loader.css";

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
      <p className="loader-text">Starting server... Please wait</p>
    </div>
  );
}

export default Loader;
