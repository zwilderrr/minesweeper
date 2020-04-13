import React from "react";
import "./App.css";

import Game from "./Game";

function App() {
  // Game component takes care of monitoring the game state (eg level, grid size, in-progress, etc)
  return <Game />;
}

export default App;
