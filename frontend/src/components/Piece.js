import React, { useState } from "react";
import { useEffect } from "react";
import {
  b_b,
  b_w,
  k_b,
  k_w,
  n_b,
  n_w,
  p_b,
  p_w,
  q_b,
  q_w,
  r_b,
  r_w,
} from "./Images";
//import { DragPreviewImage, useDrag } from "react-dnd";
import "/static/css/App.css";

function Piece({ piece: { type, color }, position }) {
  //const pieceImg = require(`./static//${type}_${color}.png`);

  const renderPiece = () => {
    switch (`${type}_${color}`) {
      case "b_b":
        return <img src={b_b} alt="1" className="piece" />;
      case "b_w":
        return <img src={b_w} alt="1" className="piece" />;
      case "k_b":
        return <img src={k_b} alt="1" className="piece" />;
      case "k_w":
        return <img src={k_w} alt="1" className="piece" />;
      case "n_b":
        return <img src={n_b} alt="1" className="piece" />;
      case "n_w":
        return <img src={n_w} alt="1" className="piece" />;
      case "p_b":
        return <img src={p_b} alt="1" className="piece" />;
      case "p_w":
        return <img src={p_w} alt="1" className="piece" />;
      case "q_b":
        return <img src={q_b} alt="1" className="piece" />;
      case "q_w":
        return <img src={q_w} alt="1" className="piece" />;
      case "r_b":
        return <img src={r_b} alt="1" className="piece" />;
      case "r_w":
        return <img src={r_w} alt="1" className="piece" />;
    }
  };

  return <div className="piece-container">{renderPiece()}</div>;
}

export default Piece;
