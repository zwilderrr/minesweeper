import React from "react";

const DEV_MODE = true;

function Tile({ x, y, flipped, flagged, isBomb, value, onClick }) {
  const handleClick = e => {
    e.preventDefault();
    if (flipped) {
      return;
    }
    if (e.nativeEvent.which === 1) {
      onClick(y, x);
    } else if (e.nativeEvent.which === 3) {
      onClick(y, x, true);
    }
  };

  return (
    <div
      style={{
        height: 50,
        width: 50,
        border: `solid thick ${
          (DEV_MODE || flipped) && isBomb ? "red" : "black"
        }`
      }}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      <div>{flagged ? "flag" : flipped && value ? value : ""}</div>
    </div>
  );
}

export default Tile;
