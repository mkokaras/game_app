import React, { Component, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Grid, ButtonGroup, Typography, Box } from "@material-ui/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "/static/css/History.css";

function Moves({ gameId }) {
  const [moves, setMoves] = useState([]);

  function check_if_authenticated(data) {
    if (data.detail == "Invalid token.") {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
      history.push("/login");
      return false;
    }
    return true;
  }

  useEffect(() => {
    console.log(gameId);

    if (gameId !== null) {
      console.log("HERE MOVES");
      const requestOptions = {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const resp = fetch(`/api/get-moves?gameId=${gameId}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (check_if_authenticated(data) == false) {
            return;
          }
          if (data.Moves !== "EMPTY") {
            setMoves(data.Moves);
          }
        });
    }
  }, [gameId]);

  return (
    <>
      {moves && moves.length != 0 ? (
        <>
          {moves.map((value) => (
            <div key={value} className="gpt3_head-content__list-item">
              <p>From : {value.source}</p>
              <p>To : {value.destination}</p>
              <p>Color : {value.piece}</p>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Moves;
