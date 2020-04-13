import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import "./Game.css";

const LEVELS = ["easy", "medium", "hard"];

function Game() {
  const timer = useRef(false);
  const [level, setLevel] = useState("medium");
  const [gridSize, setGridSize] = useState(4);
  const [time, setTime] = useState(0);
  const [finishedGameTime, setFinishedGameTime] = useState(0);
  const [gameStatus, setGameStatus] = useState("waiting");
  const gameInPlay = gameStatus === "playing";
  const gameOver = gameStatus === "won" || gameStatus === "lost";
  const buttonsDisabled = gameInPlay || gameOver;

  const reportEndOfGame = result => {
    setGameStatus(result);
  };

  function increaseTime() {
    setTime(time + 1);
  }

  useEffect(() => {
    // gives the `increaseTime` function a closure over the current value of `time`,
    timer.current = increaseTime;
  });

  useEffect(() => {
    function addSecond() {
      timer.current();
    }

    if (gameOver) {
      // store the previous game's time so the player can relish in his accomplishment (or failure!)
      setFinishedGameTime(time);
    } else {
      // otherwise, reset it to zero so it doesn't persist when the 'reset' button is clicked
      setFinishedGameTime(0);
    }

    let timerId = setInterval(addSecond, 1000);

    if (gameStatus !== "playing") {
      clearInterval(timerId);
      setTime(0);
    }

    return () => clearInterval(timerId);
  }, [gameStatus]);

  function getDisplayTime() {
    // add zeros to our second count
    let padding = "";
    let displayTime = gameInPlay
      ? time.toString()
      : finishedGameTime.toString();

    if (displayTime.length === 1) {
      padding = "00";
    } else if (displayTime.length === 2) {
      padding = "0";
    }
    return padding + displayTime;
  }

  return (
    <div className="game">
      <div className="heading border">minesweeper</div>
      <div className="game-buttons border">
        <div className="row">
          {LEVELS.map((menuLevel, i) => (
            <div
              key={i}
              onClick={() => !buttonsDisabled && setLevel(menuLevel)}
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
            >
              {menuLevel}
            </div>
          ))}
          <select
            disabled={buttonsDisabled}
            onChange={e => setGridSize(parseInt(e.target.value))}
            style={{ fontSize: 20, margin: 10 }}
          >
            <option value="4">4 x 4</option>
            <option value="8">8 x 8</option>
            <option value="12">12 x 12</option>
          </select>
        </div>
        <div className="row">
          <div
            style={{
              borderColor: buttonsDisabled && "#fed330",
              animation: gameInPlay && "none",
            }}
            onClick={() => {
              setGameStatus(buttonsDisabled ? "waiting" : "playing");
            }}
            className="start-button"
          >
            {buttonsDisabled ? "Reset" : "Start"}
          </div>
          <div className="timer">{getDisplayTime()}s</div>
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
