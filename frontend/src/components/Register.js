import React, { Component, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
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
import { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import image from "/static/images/horse_pic.png";
import "/static/css/Register.css";

function Register({ history }) {
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.get("username"),
        email: data.get("email"),
        password: data.get("password"),
      }),
    };
    fetch("/api/auth/register", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Register === "NOK") {
          setOpen(true);
        } else {
          history.push("/login");
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
              <label>Email</label>
              <input type="email" name="email" />
              <label>Password</label>
              <input type="password" name="password" />
              <input type="submit" value="Register" />
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
        <DialogTitle id="alert-dialog-title">{"Register Failure"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Invalid Credentials.Try Again.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Register;
