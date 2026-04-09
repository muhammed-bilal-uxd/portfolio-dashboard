import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <>
      <div className="loading-bg-layer">
        <section className="dots-container">
          {/* <div className="">Loading...</div> */}
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      </div>
    </>
  );
};

export default Loading;
