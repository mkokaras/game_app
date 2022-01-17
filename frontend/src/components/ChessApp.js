import React, { useEffect, useState } from "react";
import Board from "./Board";
import * as Chess from "chess.js";
import { useParams } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "/static/css/Chess.css";

let ws;
const chess = new Chess();

function ChessApp({ history }) {
  const [list, setList] = useState(["e5", "e6", "e7", "e8", "e9", "e10"]);
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();
  const [game, setGame] = useState();
  const { id } = useParams();
  const [color, setColor] = useState(null);
  const [turn, setTurn] = useState(null);
  const [name, setName] = useState(null);
  const [vara, setVara] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [chessGameId, setchessGameId] = useState(null);
  const [moveList, setMoveList] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    ws = new W3CWebSocket(
      `ws://djangochessapp.herokuapp.com/ws/chat/${id}/?token=${localStorage.getItem(
        "token"
      )}`
    );
    ws.onopen = () => {
      initGame();
    };

    ws.onmessage = (e) => {
      var data = JSON.parse(e.data);

      console.log("MESSAGE RECEIVED :");
      console.log(data);

      if (
        (data.message.type === "winner" || data.message.type === "redirect") &&
        data.message.to_userid.toString() === localStorage.getItem("userid")
      ) {
        if (data.message.type === "winner") {
          setMessage(
            "Your opponent disconnected so you won the game!.Redirecting..."
          );
          setOpen(true);

          let interval;

          interval = setInterval(() => {
            history.push("/loby");
            clearInterval(interval);
          }, 3000);
        } else {
          setMessage("Your opponent disconnected.Redirecting...");
          setOpen(true);

          let interval;

          interval = setInterval(() => {
            history.push("/loby");
            clearInterval(interval);
          }, 3000);
        }
      } else if (data.message.type === "move") {
        var array = moveList;

        array.push(data.message);

        setMoveList(array);
      } else {
        setTurn(data.message.turn);

        console.log("UPDATE BOARD");

        if (data.message.source !== localStorage.getItem("token")) {
          setGame(data.message);
          setBoard(data.message.board);
          setIsGameOver(data.message.isGameOver);
          setResult(data.message.result);
          chess.load(data.message.fen);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (result && color === "w") {
      const requestOptions1 = {
        method: "PATCH",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: id,
          result: result,
          duration: 0,
        }),
      };

      const resp1 = fetch("/api/update-chess-game", requestOptions1)
        .then((response) => response.json())
        .then((data) => console.log(data));

      const requestOptions2 = {
        method: "DELETE",
      };

      const resp2 = fetch(
        "/api/update-invitation" + "?username=" + name,
        requestOptions2
      )
        .then((response) => response.json())
        .then((data) => history.push("/loby"));
    } else if (result) {
      history.push("/loby");
    }
  }, [result]);

  async function initGame() {
    const requestOptions = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      "/api/get-game" + "?gameId=" + id,
      requestOptions
    ).then((response) => response.json());

    if (response.gameId) {
      onlineGame(response);
    }
  }
  async function onlineGame(data) {
    const requestOptions3 = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const creator = await fetch(
      "/api/get-creator" + "?gameId=" + data.gameId,
      requestOptions3
    ).then((response) => response.json());

    if (
      creator.memberId.toString() !== localStorage.getItem("userid") &&
      data.game_status === "waiting"
    ) {
      const requestOptions1 = {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: localStorage.getItem("userid"),
          startingpiece: creator.startingpiece === "w" ? "b" : "w",
          creator: false,
          gameId: data.gameId,
        }),
      };

      const piece = creator.startingpiece === "w" ? "b" : "w";

      setColor(piece);

      const requestOptions2 = {
        method: "PATCH",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_status: "ready",
          gameId: data.gameId,
        }),
      };

      const resp2 = await fetch("/api/member", requestOptions1)
        .then((response) => response.json())
        .then((data) => console.log(data));

      const resp1 = await fetch("/api/update-game", requestOptions2)
        .then((response) => response.json())
        .then((data) => console.log(data));

      updateGame();
    } else {
      var value = await isActive();

      console.log(value);

      if (value) {
        setColor(creator.startingpiece);
        updateGame();
      } else {
        history.push("/loby");
      }
    }

    const requestOptions = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    const resp = await fetch(
      "/api/get-username" + "?token=" + localStorage.getItem("token"),
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setName(data.username);
      });
  }

  async function isActive() {
    var success;

    const requestOptions = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    const invite = await fetch(
      "/api/update-invitation" + "?token=" + localStorage.getItem("token"),
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        success = data.Success;
      });

    console.log(success);

    if (success === "OK") {
      return true;
    }

    return false;
  }

  async function updateGame(pendingPromotion) {
    const isGameOver = chess.game_over();

    const newGame = {
      board: chess.board(),
      pendingPromotion,
      isGameOver,
      result: isGameOver ? getGameResult() : null,
      source: localStorage.getItem("token"),
      fen: chess.fen(),
      turn: chess.turn(),
    };

    setGame(newGame);
    setBoard(newGame.board);
    setIsGameOver(newGame.isGameOver);
    setResult(newGame.result);
    chess.load(chess.fen());

    ws.send(
      JSON.stringify({
        message: newGame,
      })
    );
  }

  const handleMove = async (from, to) => {
    const promotions = chess
      .moves({ verbose: true })
      .filter((m) => m.promotion);

    if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
      const pendingPromotion = { from, to, color: promotions[0].color };

      updateGame(pendingPromotion);
    }
    const pendingPromotion = game.pendingPromotion;

    if (!pendingPromotion) {
      const output = await move(from, to);
      return output;
    }
  };

  const move = async (from, to, promotion) => {
    let tempMove = { from, to };

    if (promotion) {
      tempMove.promotion = promotion;
    }
    const legalMove = chess.move(tempMove);

    if (legalMove && color == turn) {
      if (color === "w" && hasStarted === false) {
        setHasStarted(true);

        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: id,
            result: "active",
            duration: 0,
          }),
        };

        const resp2 = await fetch("/api/start-chess-game", requestOptions)
          .then((response) => response.json())
          .then((data) => console.log(data));
      }

      if (promotion) {
        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: from,
            destination: to,
            duration: 0,
            promotion: promotion,
            chessgameId: id,
            piece: color,
          }),
        };

        const resp2 = await fetch("/api/chess-move", requestOptions)
          .then((response) => response.json())
          .then((data) => console.log(data));

        const move_info = {
          source: from,
          dest: to,
          color: color,
          type: "move",
          promotion: promotion,
        };

        ws.send(
          JSON.stringify({
            message: move_info,
          })
        );
      } else {
        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: from,
            destination: to,
            duration: 0,
            promotion: ".",
            chessgameId: id,
            piece: color,
          }),
        };

        const resp2 = await fetch("/api/chess-move", requestOptions)
          .then((response) => response.json())
          .then((data) => console.log(data));

        const move_info = {
          source: from,
          dest: to,
          color: color,
          type: "move",
          promotion: ".",
        };

        ws.send(
          JSON.stringify({
            message: move_info,
          })
        );
      }

      updateGame();
      return true;
    } else return false;
  };

  function getGameResult() {
    if (chess.in_checkmate()) {
      const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
      return winner;
    } else if (chess.in_draw()) {
      let reason = "50 - MOVES - RULE";

      if (chess.in_stalemate()) {
        reason = "STALEMATE";
      } else if (chess.in_threefold_repetion()) {
        reason = "REPETION";
      } else if (chess.insufficient_material()) {
        reason = "INSUFFIECIENT MATERIAL";
      }
      return `DRAW - ${reason}`;
    } else {
      return "UNKNOWN REASON";
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuit = () => {
    history.push("/loby");
  };

  async function IterateMoves() {
    moveList.map(async (move) => {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(move),
      };

      const resp2 = await fetch("/api/chess-move", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));
    });
  }
  return (
    <div className="chess">
      <div className="container_chess">
        <div className="left_chess">
          <div className="gpt3_head-content__list-item_chess">
            <p>
              Quitting the game after the first move has occured instantly
              counts as lose.
            </p>
          </div>
          <div className="gpt3_head-content__list-item_chess">
            <button onClick={handleQuit}>Quit Game</button>
          </div>
        </div>
        <div className="center-chess">
          <div className="board-container">
            <Board
              board={board}
              handleMove={handleMove}
              game={game}
              move={move}
              color={color}
            ></Board>
          </div>
        </div>
        <div className="right_chess">
          <div className="gpt3_head-content__list_chess">
            {moveList.map((value, index) => (
              <div key={index} className="gpt3_head-content__list-item_chess">
                <p>{value.source}</p>
                <p>{value.dest}</p>
                <p>{value.color}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Game Notification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChessApp;
