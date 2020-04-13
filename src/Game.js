import React, { useState } from "react";

import Board from "./Board";

function Game() {
  const [gameStatus, setGameStatus] = useState("waiting");
  return (
    // make something cool for each status
    <div className={gameStatus}>
      <Board
        level={"easy"}
        height={10}
        width={10}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
      />
    </div>
  );
}

export default Game;
