import React from "react";

function Tile({ x, y, flipped, isBomb, value }) {
  return (
    <div style={{ height: 80, width: 80, border: "solid thin black" }}>
      <div>{x}</div>
      <div>{y}</div>
      <div>{flipped}</div>
      <div>{isBomb}</div>
      <div>{value}</div>
    </div>
  );
}

export default Tile;
