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
import { useParams } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function Activation({ history }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);

  const { id, token } = useParams();

  useEffect(() => {
    const resp = fetch(`/api/activation?id=${id}&confirmation_token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Activation == "Invalid") {
          setMessage("Token is invalid or expired");
          setOpen(true);
        } else if (data.Activation == "NO") {
          setMessage("User does not exist");
          setOpen(true);
        } else {
          setMessage("Activation Succesfull!");
          setOpen(true);
          let interval;

          interval = setInterval(() => {
            history.push("/login");
            clearInterval(interval);
          }, 3000);
        }
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Activation Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Activation;
