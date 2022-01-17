import React, { Component } from "react";
import Register from "./Register";
import Login from "./Login";
import ChessApp from "./ChessApp";
import Lobby from "./Lobby";
import History from "./History";
import Moves from "./Moves";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Activation from "./Activation";
//import image from "/static/images/horse_pic.png";
import "/static/css/Homepage.css";
import { useEffect } from "react";

function HomePage({ history }) {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/loby");
    }
  }, []);

  const handleLogin = () => {
    history.push("/login");
  };

  const handleRegister = () => {
    history.push("/register");
  };

  return (
    <div className="gpt3__header_head section__padding" id="home">
      <div className="gpt3__header-content_head">
        <div className="gtp3_head-content__text_head">
          <h1 className="gradient__text">
            Play Competitive Chess with anyone around the world
          </h1>
        </div>
      </div>
      <div className="gpt3__header-input_head">
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account?</p>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div className="gpt3__header-image_head">
        <img
          src={require("/static/images/horse_pic.png").default}
          alt="chess"
        ></img>
      </div>
    </div>
  );
}

export default HomePage;
