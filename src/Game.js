import React, { useState } from "react";

import Board from "./Board";

function Game() {
  const [gameStatus, setGameStatus] = useState("waiting");
  return (
    <div>
      board
      <Board level={"easy"} height={10} width={10} gameStatus={gameStatus} />
    </div>
  );
}

export default Game;
