import React, { Component, useEffect } from "react";
import Square from "./Square";
const promotionPieces = ["r", "n", "b", "q"];
import "/static/css/App.css";

export default function Promote({
  promotion: { from, to, color },
  prevSelect,
  setprevSelect,
  move,
}) {
  useEffect(() => {
    setprevSelect(null);
  }, []);

  return (
    <div className="board">
      {promotionPieces.map((p, i) => (
        <div key={i} className="promote-square">
          <Square black={i % 3 === 0}>
            <div
              className="piece-container"
              onClick={async () => {
                await move(from, to, p);
                console.log({ from, to, p });
              }}
            >
              <img
                src={`/static/images/${p}_${color}.png`}
                alt=""
                className="piece cursor-pointer"
              />
            </div>
          </Square>
        </div>
      ))}
    </div>
  );
}
