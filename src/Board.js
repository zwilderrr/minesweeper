import React from "react";

import Tile from "./Tile";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initializeBoard();
  }

  initializeBoard() {
    // iterate through height and width
    // make tile, increasing bomb count
    // reiterate through and make values
    const { height, width } = this.props;
    const board = this.createBoardWithBombs();
    let bombCount = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileObject = board[y][x];
        if (tileObject.isBomb) {
          bombCount++;
        } else {
          tileObject.value = this.getSurroundingBombCount(board);
        }
        board[y][x] = <Tile {...tileObject} />;
      }
    }
    this.setState({ board, bombCount });
  }

  createBoardWithBombs() {
    const { level, height, width } = this.props;
    const bombProbability = level === "easy" ? 0.1 : "medium" ? 0.3 : 0.5;
    const board = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const tile = this.makeTileObject(x, y, bombProbability);
        row.push(tile);
      }
      board.push(row);
    }

    return board;
  }

  getSurroundingBombCount(board) {
    return 3;
  }

  makeTileObject(x, y, bombProbability) {
    const isBomb = Math.random() < bombProbability;
    return {
      x,
      y,
      isBomb,
      flipped: false,
      value: undefined
    };
  }

  render() {
    const { board, bombCount } = this.state;
    return (
      <>
        bombCount: {bombCount}
        <div style={{ display: "flex", flexWrap: "wrap" }}>{board}</div>
      </>
    );
  }
}

export default Board;
