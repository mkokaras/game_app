import React, { useEffect, useState } from "react";
import Square from "./Square";
import Piece from "./Piece";
import Promote from "./Promote";
import "/static/css/App.css";

export default function BoardSquare({
  piece,
  black,
  position,
  nextSelect,
  prevSelect,
  setnextSelect,
  setprevSelect,
  handleMove,
  game,
  move,
}) {
  const [promotion, setPromotion] = useState(null);
  const [hasPromotion, setHasPromotion] = useState(false);

  useEffect(() => {
    const pendingPromotion = game.pendingPromotion;

    pendingPromotion && pendingPromotion.to === position
      ? setPromotion(pendingPromotion)
      : setPromotion(null);
  }, [game]);

  const handleClick = async () => {
    if (prevSelect === position) {
      setprevSelect(null);
    } else if (prevSelect !== null) {
      const output = await handleMove(prevSelect, position);

      if (output === true) {
        setprevSelect(null);
      } else {
        setprevSelect(prevSelect);
      }
    } else if (piece !== null) {
      setprevSelect(position);
    }
  };

  return (
    <div className="board-square" onClick={handleClick}>
      {position === prevSelect ? (
        <Square black={black} isSelected={true}>
          {promotion ? (
            <Promote
              promotion={promotion}
              prevSelect={prevSelect}
              setprevSelect={setprevSelect}
              move={move}
            />
          ) : piece ? (
            <Piece piece={piece} position={position}></Piece>
          ) : null}
        </Square>
      ) : (
        <Square black={black} isSelected={false}>
          {promotion ? (
            <Promote
              promotion={promotion}
              prevSelect={prevSelect}
              setprevSelect={setprevSelect}
              move={move}
            />
          ) : piece ? (
            <Piece piece={piece} position={position}></Piece>
          ) : null}
        </Square>
      )}
    </div>
  );
}
