import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import "./Game.css";

const LEVELS = ["easy", "medium", "hard"];

function Game() {
  const [level, setLevel] = useState("medium");
  const [gridSize, setGridSize] = useState(4);
  const [time, setTime] = useState(0);
  const [gameStatus, setGameStatus] = useState("waiting");
  const gameInPlay = gameStatus === "playing";
  const gameOver = gameStatus === "won" || gameStatus === "lost";
  const buttonsDisabled = gameInPlay || gameOver;

  const reportEndOfGame = result => {
    setGameStatus(result);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    if (gameStatus === "waiting") {
      clearInterval(timer);
      setTime(0);
    }

    if (gameOver) {
      clearInterval(timer);
      setTime(time);
    }
    return () => clearInterval(timer);
  });

  function getDisplayTime() {
    // add zeros to our second count
    let padding = "";
    let displayTime = time.toString();

    if (displayTime.length === 1) {
      padding = "00";
    } else if (displayTime.length === 2) {
      padding = "0";
    }
    return padding + displayTime;
  }

  const displayTime = getDisplayTime();

  return (
    <div className="game">
      <div className="heading border">minesweeper</div>
      <div className="game-buttons border">
        <div className="row">
          {LEVELS.map((menuLevel, i) => (
            <div
              key={i}
              className="level-buttons"
              style={{
                color: buttonsDisabled && "gray",
                borderColor:
                  // buttons are disabled and this button is the user selected level
                  buttonsDisabled && menuLevel === level
                    ? "gray"
                    : // else if buttons aren't disabled and this button is the user selected level
                    menuLevel === level
                    ? "orange"
                    : // else keep the border there so there's no jumping when it's applied
                      "transparent",
              }}
              onClick={() => !buttonsDisabled && setLevel(menuLevel)}
            >
              {menuLevel}
            </div>
          ))}
          <select
            style={{ fontSize: 20, margin: 10 }}
            disabled={buttonsDisabled}
            onChange={e => setGridSize(parseInt(e.target.value))}
          >
            <option value="4">4 x 4</option>
            <option value="8">8 x 8</option>
            <option value="12">12 x 12</option>
          </select>
        </div>
        <div className="row">
          <div
            className="start-button"
            style={{
              borderColor: buttonsDisabled && "#fed330",
              animation: gameInPlay && "none",
            }}
            onClick={() => {
              setGameStatus(buttonsDisabled ? "waiting" : "playing");
            }}
          >
            {buttonsDisabled ? "Reset" : "Start"}
          </div>
          <div className="timer">{displayTime}s</div>
        </div>
      </div>
      <Board
        level={level}
        height={gridSize}
        width={gridSize}
        gameStatus={gameStatus}
        reportEndOfGame={reportEndOfGame}
        disableTiles={!gameInPlay}
      />
      <div className="border game-status">
        <div>
          {gameStatus === "won"
            ? "Hooray, you won!"
            : gameStatus === "lost"
            ? "Bummer, you lost!"
            : null}
        </div>
      </div>
    </div>
  );
}

export default Game;
