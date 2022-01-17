import React, { Component, useEffect } from "react";
import "/static/css/App.css";

function Square({ children, black, isSelected }) {
  const bgClass = isSelected
    ? "square-yellow"
    : black
    ? "square-black"
    : "square-white";
  return <div className={`${bgClass} board-square`}>{children}</div>;
}

export default Square;
