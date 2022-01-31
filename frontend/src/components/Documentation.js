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
            send your moves and get one back as a request.The difficulty level
            you can choose is between 1 - 5.
          </p>
        </div>
        <div className="gpt3_head-content__list-item">
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
                <span>&#123;'GAME': 'NO WINNER'&#125;</span>
              </div>
              <div class="code_line_success">
                <span>
                  &#123;'GAME': 'NO WINNER', 'BotMove': &#123;fromto&#125;&#125;
                </span>
              </div>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;
