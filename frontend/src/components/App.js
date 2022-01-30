import React, { Component } from "react";
import { render } from "react-dom";
import ChessApp from "./ChessApp";
import HomePage from "./HomePage";
import Register from "./Register";
import Login from "./Login";
import Lobby from "./Lobby";
import History from "./History";
import Moves from "./Moves";
import Activation from "./Activation";
import Documentation from "./Documentation";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import "/static/css/App.css";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <div className="gradient__bg">
          <Router forceRefresh={true}>
            <Switch>
              <Route exact path="/" component={HomePage}></Route>
              <Route path="/register" component={Register}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/chess/:id" component={ChessApp}></Route>
              <Route
                path="/moves/:id"
                component={Moves}
                target="_blank"
              ></Route>
              <Route path="/loby" component={Lobby}></Route>
              <Route path="/history" component={History}></Route>
              <Route
                path="/activation/:id/:token"
                component={Activation}
              ></Route>
              <Route path="/documentation" component={Documentation}></Route>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;

const appDiv = document.getElementById("app");
render(<App></App>, appDiv);
