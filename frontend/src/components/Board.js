import React, { Component, useState } from "react";
import BoardSquare from "./BoardSquare";
import { useEffect } from "react";
import "/static/css/App.css";

function Board({ board, handleMove, game, move, color }) {
  const [prevSelect, setprevSelect] = useState(null);
  const [nextSelect, setnextSelect] = useState(null);
  const [currBoard, setCurrBoard] = useState([]);

  useEffect(() => {
    setCurrBoard(color === "w" ? board.flat() : board.flat().reverse());
  }, [board, color]);

  function getXYPosition(i) {
    const x = color === "w" ? i % 8 : Math.abs((i % 8) - 7);
    const y =
      color === "w" ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
    return { x, y };
  }
  function isBlack(i) {
    const { x, y } = getXYPosition(i);
    return (x + y) % 2 === 1;
  }

  function getPosition(i) {
    const { x, y } = getXYPosition(i);
    const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
    return `${letter}${y + 1}`;
  }

  return (
    <div className="board">
      {currBoard.map((piece, i) => (
        <div key={i} className="square">
          <BoardSquare
            piece={piece}
            black={isBlack(i)}
            position={getPosition(i)}
            prevSelect={prevSelect}
            nextSelect={nextSelect}
            setprevSelect={setprevSelect}
            setnextSelect={setnextSelect}
            handleMove={handleMove}
            game={game}
            move={move}
          ></BoardSquare>
        </div>
      ))}
    </div>
  );
}

export default Board;
