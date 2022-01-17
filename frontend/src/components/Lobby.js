import { Button, ListItemText } from "@material-ui/core";
import React, { Component, useState } from "react";
import { Grid, ButtonGroup, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Box } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import RefreshIcon from "@mui/icons-material/Refresh";
import image from "/static/images/horse_pic.png";
import "/static/css/Lobby.css";

const ws = new W3CWebSocket(
  `wss://djangochessapp.herokuapp.com/ws/lobby/?token=${localStorage.getItem(
    "token"
  )}`
);

function Lobby({ history }) {
  const [showModal, setShowModal] = useState(false);
  const [userOnline, setUsersOnline] = useState(null);
  const [hasInvitaton, setHasInvitation] = useState(false);
  const [invitationSrc, setInvitationSrc] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [invitationDest, setInvitationDest] = useState(null);
  const [message, setMessage] = useState(null);
  const [onlineGame, setOnlineGame] = useState(false);

  const newGameOptions = [
    { label: "Black Pieces", value: "b" },
    { label: "White Pieces", value: "w" },
    { label: "Random", value: "r" },
  ];

  //Socket stuff

  ws.onopen = async () => {
    const requestOptions = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    console.log("go there");

    if (!localStorage.getItem("userid")) {
      const user = await fetch(
        "/api/get-user-id" + "?token=" + localStorage.getItem("token"),
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (check_if_authenticated(data) == false) {
            return;
          }
          localStorage.setItem("userid", data);
        });
    }

    console.log(`My userId is : ${localStorage.getItem("userid")}`);
  };

  ws.onmessage = async (e) => {
    var data = JSON.parse(e.data);

    if (
      data.message.type === "invite" &&
      data.message.to_userid.toString() === localStorage.getItem("userid")
    ) {
      setInvitationSrc(data.message.from_user);
      setOpen(true);
    } else if (
      data.message.type === "accept" &&
      localStorage.getItem("userid") === data.message.to_userid.toString()
    ) {
      console.log("Accepted the game");
      history.push(`/chess/${data.message.gameId}`);
    } else if (
      data.message.type === "decline" &&
      localStorage.getItem("userid") === data.message.to_userid.toString()
    ) {
      setOpen3(true);
      setInvitationDest(null);
    }
  };

  useEffect(() => {
    getOnlineUsers();
  }, []);

  function check_if_authenticated(data) {
    if (data.detail == "Invalid token.") {
      history.push("/login");
      return false;
    }
    return true;
  }

  //handlers

  const handleClose = async () => {
    var username;

    const requestOptions1 = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    const resp = await fetch(
      "/api/get-username" + "?token=" + localStorage.getItem("token"),
      requestOptions1
    )
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
        username = data.username;
      });

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_token: invitationSrc,
        to_username: username,
        status: "delete",
      }),
    };

    const resp2 = await fetch("/api/update-invitation", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
      });

    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleAcceptClose = async () => {
    var onlineGame;

    const gameid = `${Math.random()
      .toString(36)
      .substring(2, 9)}_${Date.now()}`.substring(0, 10);

    const invitation = {
      method: "PATCH",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_token: gameid,
        to_username: invitationSrc,
        status: "accept",
      }),
    };

    const resp1 = await fetch(
      "/api/update-invitation" + "?userid=" + localStorage.getItem("userid"),
      invitation
    ).then((response) => response.json());

    if (check_if_authenticated(resp1) === false) {
      return;
    }
    if (resp1.Fail === "NOTVALID") {
      setOpen(false);
      setOpen2(true);
      setMessage("Invitation is not valid");

      return;
    } else {
      const smth = await startOnlineGame("w", gameid);

      setOpen(false);

      history.push(`/chess/${gameid}`);
    }
  };

  const handleDeclineClose = async () => {
    var username;

    const requestOptions1 = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    const resp = await fetch(
      "/api/get-username" + "?token=" + localStorage.getItem("token"),
      requestOptions1
    )
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
        username = data.username;
      });

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_token: invitationSrc,
        to_username: username,
        status: "delete",
      }),
    };

    const resp2 = await fetch("/api/update-invitation", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
      });

    setOpen(false);
  };

  const handleDeclineClose2 = () => {
    setOpen2(false);
  };

  const handleDeclineClose3 = () => {
    setOpen3(false);
  };

  const handleInvite = async (value) => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_token: localStorage.getItem("token"),
        to_username: value,
        status: "pending",
      }),
    };
    const resp1 = await fetch("/api/set-invite", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
        if (data.Fail == "BUSY") {
          setOpen2(true);
          setMessage("This user is currently busy!");
        } else if (data.Fail == "NOONLINE") {
          setOpen2(true);
          setMessage("This user is not online!");
          getOnlineUsers();
        } else if (data.Fail == "ONE") {
          setOpen2(true);
          setMessage(
            "You have to cancel your invitation to invite someone else"
          );
        } else {
          setInvitationDest(value);
        }
      });
  };

  const handleCancelInvite = async (value) => {
    const requestOptions = {
      method: "DELETE",
    };

    const resp2 = fetch(
      "/api/update-invitation" + "?username=" + invitationSrc,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
        setInvitationDest(null);
      });
  };

  const logout = async () => {
    const requestOptions1 = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    localStorage.removeItem("token");
    localStorage.removeItem("userid");

    const resp1 = await fetch("/api/auth/logout", requestOptions1);

    history.push("/");
  };

  const startOnlineGame = async (startingPiece, gameId) => {
    const requestOptions1 = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: localStorage.getItem("userid"),
        startingpiece: startingPiece,
        creator: true,
        gameId: gameId,
      }),
    };

    const requestOptions2 = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_status: "waiting",
        gameId: gameId,
      }),
    };

    const resp1 = await fetch("/api/game", requestOptions2)
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
      });

    const resp2 = await fetch("/api/member", requestOptions1)
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
      });

    return gameId;
  };

  const getOnlineUsers = async () => {
    const requestOptions = {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    const userlist = await fetch(
      "/api/get-online-users" + "?token=" + localStorage.getItem("token"),
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (check_if_authenticated(data) == false) {
          return;
        }
        setOnlineUsers(data);
      });
  };

  const handleViewHistory = () => {
    history.push("/history");
  };

  return (
    <div className="gpt3__header section__margin" id="home">
      <div className="gpt3_head-content__list">
        <div className="lobby_icons">
          <GroupIcon sx={{ color: "white" }}></GroupIcon>
          <RefreshIcon
            sx={{ color: "white" }}
            onClick={getOnlineUsers}
          ></RefreshIcon>
        </div>
        {onlineUsers && onlineUsers.length != 0 ? (
          onlineUsers.map((value) => (
            <div key={value} className="gpt3_head-content__list-item">
              <p>{value}</p>
              {value != invitationDest ? (
                <button onClick={() => handleInvite(value)}>Invite</button>
              ) : (
                <button onClick={() => handleCancelInvite(value)}>
                  Cancel Invitation
                </button>
              )}
            </div>
          ))
        ) : (
          <h1 className="grey_text">Lobby is Empty</h1>
        )}
      </div>
      <div className="gpt3__header-image">
        <img src={image} alt="chess"></img>
      </div>
      <div className="gpt3_head-content__list">
        <SettingsIcon sx={{ color: "white" }}></SettingsIcon>
        <div className="gpt3_head-content__list-item">
          <button onClick={handleViewHistory}>View Match History</button>
        </div>
        <div className="gpt3_head-content__list-item">
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You have an invitation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            User {invitationSrc} invited you to play Chess!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeclineClose}>Decline</Button>
          <Button onClick={handleAcceptClose} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You cannot invite this user!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDeclineClose2}>OK</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        open={open3}
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Invitation Update"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This user declined your invitation
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDeclineClose3}>OK</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Lobby;
