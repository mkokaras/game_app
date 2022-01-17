import React, { Component, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControllLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import image from "/static/images/horse_pic.png";
import "/static/css/Register.css";

function Login({ history }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/loby");
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    };
    fetch("/api/auth/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Login === "NOK") {
          setOpen(true);
        } else {
          localStorage.setItem("token", data.token);
          history.push("/loby");
        }
      });
  };
  return (
    <div className="register-page">
      <div className="image">
        <img src={image} alt="ai"></img>
      </div>
      <div className="register">
        <div className="register-container">
          <div className="register-heading">
            <h1 className="gradient__text">Join Now!</h1>
          </div>
          <div className="register-form">
            <form onSubmit={handleSubmit}>
              <label>Username</label>
              <input type="username" name="username" />
              <label>Password</label>
              <input type="password" name="password" />
              <input type="submit" value="Login" />
            </form>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Login Failure"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Invalid Credentials.Try Again.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Login;
