import React, { Component, useState } from "react";
import * as Chess from "chess.js";
import Board from "./Board";
import { useEffect, useRef } from "react";
import "/static/css/ChessAnimation.css";

let chess = new Chess();

function ChessAnimation({ moves, interval }) {
  const [board, setBoard] = useState([]);
  const [game, setGame] = useState();
  const timeout = useRef([]);

  useEffect(() => {
    timeout.current.forEach((value, index) => {
      clearTimeout(timeout.current[index]);
    });

    chess = new Chess();

    moves.map((value, index) => {
      timeout.current[index] = setTimeout(function () {
        var from = value.source;

        var to = value.destination;

        let move_temp = { from, to };

        chess.move(move_temp);

        const isGameOver = false;

        const game = {
          board: chess.board(),
          pendingPromotion: false,
          isGameOver,
          result: isGameOver ? getGameResult() : null,
          source: localStorage.getItem("token"),
          fen: chess.fen(),
          turn: chess.turn(),
          type: "bot",
        };
        setGame(game);
        setBoard(chess.board());
        chess.load(chess.fen());
      }, index * interval);
    });
  }, [moves]);

  useEffect(() => {}, [interval]);

  return (
    <div className="chess_animation">
      <Board
        board={board}
        handleMove={() => {}}
        game={game}
        move={() => {}}
        color={"w"}
        moveLocal={() => {}}
        handleMoveLocal={() => {}}
        isLocal={true}
        update={() => {}}
      ></Board>
    </div>
  );
}

export default ChessAnimation;
