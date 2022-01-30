import React, { Component, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Grid, ButtonGroup, Typography, Box } from "@material-ui/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "/static/css/History.css";
import ChessAnimation from "./ChessAnimation";
import Slider from "@mui/material/Slider";

function Moves({ gameId }) {
  const [moves, setMoves] = useState([]);
  const [interval, setinterval] = useState(3000);

  const handleChange = (event, newValue) => {
    setinterval(newValue * 1000);
  };

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
    if (gameId !== null) {
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
  }, [gameId, interval]);

  return (
    <>
      {moves && moves.length != 0 ? (
        <>
          <Slider
            size="small"
            defaultValue={3}
            aria-label="Small"
            valueLabelDisplay="auto"
            value={interval / 1000}
            onChange={handleChange}
            min={0}
            max={10}
            step={1}
            sx={{ marginTop: "2rem", width: "70%" }}
          />
          <ChessAnimation moves={moves} interval={interval}></ChessAnimation>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Moves;
