import React from "react";
const DEV_MODE = false;
const BOMB = (
  <span role="img" aria-label="horns">
    😈
  </span>
);

const FLAG = (
  <span role="img" aria-label="flag">
    🚩
  </span>
);

function Tile({ x, y, flipped, flagged, bomb, value, disabled, onClick }) {
  const handleClick = e => {
    // this prevent the right click menu from appearing
    e.preventDefault();

    if (disabled) {
      return;
    }

    if (e.nativeEvent.which === 1 && !flagged) {
      onClick(y, x);
      // check for right click, and if so, pass `true` to tell the click handler it's a toggleFlag event
    } else if (e.nativeEvent.which === 3) {
      onClick(y, x, true);
    }
  };

  const tileDisplay =
    flipped && value ? value : flipped && bomb ? BOMB : flagged ? FLAG : null;

  return (
    <div
      style={{
        height: "3vw",
        width: "3vw",
        display: "flex",
        margin: 0.5,
        borderRadius: 5,
        background: flipped ? "white" : "lightgray",
        border: `solid thin ${
          (DEV_MODE || flipped) && bomb ? "red" : "lightgray"
        }`,
      }}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {/* use vw here to make the tiles bigger with the screen */}
      <div style={{ margin: "auto", fontSize: "2vw" }}>{tileDisplay}</div>
    </div>
  );
}

export default Tile;
