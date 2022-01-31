import React, { Component } from "react";
import "/static/css/Documentation.css";
import Box from "@mui/material/Box";
function Documentation() {
  return (
    <div className="documentation">
      <h1 className="grey_text_history">Documentation</h1>
      <div className="gpt3_head-content__list">
        <div className="gpt3_head-content__list-item">
          <p className="api">YOUR API KEY : {localStorage.getItem("token")}</p>
        </div>
        <div className="gpt3_head-content__list-item">
          <p>
            The above documentation is for using the ChessAI API.With these
            calls below and by using your API KEY you are able to send a move
            and get a move back.The first two blocks of requests are needed for
            the initialization of the game.Then you can use the third one and
            send your moves and get one back as a request.The responses with NOK
            are the "negative" responses which means that something went
            wrong.Same applies to the ILLEGAL MOVE.Note that on every call you
            must use your API-KEY/Token on the Authorization Header.
          </p>
        </div>
        <div className="gpt3_head-content__list-item_head">
          <p>Request for a game creation</p>
        </div>
        <div className="gpt3_head-content__list-item">
          <div className="code_box">
            <code>
              <div class="code_line_header">Request:</div>
              <div class="code_line">POST :</div>
              <div class="code_line">
                https://djangochessapp.herokuapp.com/api/game
              </div>
              <div class="code_line">
                Headers : &#123;Authorization: Token &#123;API-KEY&#125;&#125;
              </div>
              <div class="code_line">
                Body: &#123;"game_status": "bot", "gameId": "." &#125;
              </div>
              <div class="code_line_header">Responses:</div>
              <div class="code_line_success">
                <span>
                  &#123;'GAME': 'OK', 'gameId': &#123;yourgameId&#125;&#125;
                </span>
              </div>
              <div class="code_line_error">
                <span>&#123;'GAME': 'NOK'&#125;</span>
              </div>
            </code>
          </div>
        </div>
        <div className="gpt3_head-content__list-item">
          <p>
            The above request is a POST Request and is used for requesting a new
            game.The body of the request contains two values the game_status and
            gameId which must have the values stated above.It returns a success
            or an error message and if the call was successful then it also
            returns the gameId which you should save for the next API calls.As
            for the color the AI pieces are always black color so your pieces
            are always white color.
          </p>
        </div>
        <div className="gpt3_head-content__list-item_head">
          <p>Initialize The Game</p>
        </div>
        <div className="gpt3_head-content__list-item">
          <div className="code_box">
            <code>
              <div class="code_line_header">Request:</div>
              <div class="code_line">POST :</div>
              <div class="code_line">
                https://djangochessapp.herokuapp.com/api/ai-move
              </div>
              <div class="code_line">
                Headers : &#123;Authorization: Token &#123;API-KEY&#125;&#125;
              </div>
              <div class="code_line">
                Body: &#123;"gameId": &#123;yourgameId&#125;, "fen": "empty",
                "level" : &#123;level&#125; &#125;
              </div>
              <div class="code_line_header">Responses:</div>
              <div class="code_line_success">
                <span>&#123;'FEN': 'OK'&#125;</span>
              </div>
              <div class="code_line_error">
                <span>&#123;'FEN': 'NOK'&#125;</span>
              </div>
            </code>
          </div>
        </div>
        <div className="gpt3_head-content__list-item">
          <p>
            The above request is a POST Request and is used for initializing the
            game with the chess AI.The body of the request contains two values
            the gameId returned from the previous request and fen.Fen is a
            standard notation for describing a particular board position of a
            chess game.The value "empty" is used from the webapp to initialize
            the ChessAI game.So it is just a convention without further use.
          </p>
        </div>
        <div className="gpt3_head-content__list-item_head">
          <p>Send your move</p>
        </div>
        <div className="gpt3_head-content__list-item">
          <div className="code_box">
            <code>
              <div class="code_line_header">Request:</div>
              <div class="code_line">GET :</div>
              <div class="code_line">
                https://djangochessapp.herokuapp.com/api/ai-move
              </div>
              <div class="code_line">
                Headers : &#123;Authorization: Token &#123;API-KEY&#125;&#125;
              </div>
              <div class="code_line">
                Paramaters: &#123;"gameId": &#123;yourgameId&#125;, "move":
                &#123;fromto&#125;&#125;
              </div>
              <div class="code_line_header">Responses:</div>
              <div class="code_line_success">
                <span>&#123;'BotMove': &#123;fromto&#125;&#125;</span>
              </div>
              <div class="code_line_error">
                <span>&#123;'MOVE': 'NOK'&#125;</span>
              </div>
              <div class="code_line_error">
                <span>&#123;'MOVE': 'ILLEGAL'&#125;</span>
              </div>
              <div class="code_line_success">
                <span>&#123;'GAME': 'WINNER'&#125;</span>
              </div>
              <div class="code_line_success">
                <span>&#123;'GAME': 'DRAW'&#125;</span>
              </div>
              <div class="code_line_success">
                <span>
                  &#123;'GAME': 'DRAW','BotMove': &#123;fromto&#125;&#125;
                </span>
              </div>
              <div class="code_line_success">
                <span>
                  &#123;'GAME': 'LOSER', 'BotMove': &#123;fromto&#125;&#125;
                </span>
              </div>
            </code>
          </div>
        </div>
        <div className="gpt3_head-content__list-item">
          <p>
            The above request is a GET request.There are two parameteres on this
            request the gameId and the move.If for example you want to make a
            move from a2 to a3 then this parameter must be "a2a3".Now the main
            objective of this request is to return a move from an AI i.e.
            BotMove : "a7a5".Also,it returns the game's result.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Documentation;
