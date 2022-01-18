import React, { Component, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {
  Grid,
  ButtonGroup,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import { useEffect } from "react";
import Box from "@material-ui/core/Box";
import { Redirect } from "react-router-dom";
import Moves from "./Moves";
import "/static/css/History.css";

function History({ history }) {
  const [games, setGames] = useState([]);
  const [results, setResults] = useState([]);
  const [gameId, setGame] = useState(null);

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
    const requestOptions = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    const resp = fetch(
      `/api/get-history?token=${localStorage.getItem("token")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
        console.log(data);
        setGames(data.Games);
      });
  }, []);

  const handleView = (key) => {
    //history.push(`/moves/${key}`);
    console.log(key);
    setGame(key);
  };

  return (
    <div className="history">
      <div className="container_history">
        <div className="left_history">
          <h1 className="grey_text_history">History</h1>
          <div className="gpt3_head-content__list_hist">
            {games && games.length != 0 ? (
              Object.entries(games).map(([key, value]) => (
                <div key={value} className="gpt3_head-content__list-item_hist">
                  <div className="gameId">
                    <p>GameId : {key}</p>
                  </div>
                  <p>Result : {value[0]}</p>
                  <p>Color : {value[1] === "b" ? "BLACK" : "WHITE"}</p>
                  <button onClick={() => handleView(key)}>View</button>
                </div>
              ))
            ) : (
              <h1 className="grey_text">You havent played any games.</h1>
            )}
          </div>
        </div>
        <div className="right_history">
          <h1 className="grey_text_history">Moves</h1>
          <div className="gpt3_head-content__list_hist">
            <Moves gameId={gameId}></Moves>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
