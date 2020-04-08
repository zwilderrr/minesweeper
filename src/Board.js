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

  initializeBoard = () => {
    const { height, width } = this.props;
    const board = this.createBoardWithBombs();
    let bombCount = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileObject = board[y][x];
        if (tileObject.isBomb) {
          bombCount++;
        } else {
          tileObject.value = this.getSurroundingBombCount(board, y, x);
        }
        board[y][x] = tileObject;
      }
    }
    this.setState({ board, bombCount });
  };

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

    // you might be tempted to make the Tiles all at once so that you
    // don't have to rerender the board each time a tile changes.
    // Each tile would be given an onClick callback fx to report to the gameboard it's value, and
    // you'd keep track of the total - flipped === bombs.
    // The problem with that is
    // the board would still have to keep a copy of the state of the game
    // so that it could identify which tiles to flip when clicking on a blank space,
    // and which to skip because they are flagged
    return board;
  }

  getSurroundingBombCount(board, y, x) {
    const { height, width } = this.props;
    let count = 0;
    for (let row = y - 1; row <= y + 1; row++) {
      if (row < 0 || row === width) {
        continue;
      }
      for (let column = x - 1; column <= x + 1; column++) {
        if (column < 0 || column === height) {
          continue;
        }
        if (board[row][column].isBomb) {
          count++;
        }
      }
    }
    return count;
  }

  makeTileObject(x, y, bombProbability) {
    const isBomb = Math.random() < bombProbability;
    return {
      x,
      y,
      isBomb,
      flipped: false,
      flagged: false,
      value: undefined
    };
  }

  handleTileClick = (y, x, toggleFlag) => {
    const { board } = this.state;
    // make a copy so that react shallow comparison detects a change
    const nextTile = board[y][x];
    if (toggleFlag) {
      nextTile.flagged = !nextTile.flagged;
    } else if (nextTile.isBomb) {
      this.setState({ revealAll: true });
    } else {
      nextTile.flipped = true;
    }
    board[y][x] = nextTile;

    this.setState({ board });
  };

  render() {
    const { board, bombCount, revealAll } = this.state;
    if (!board) {
      return <div>loading...</div>;
    }
    return (
      <>
        <button
          onClick={() =>
            this.setState({ revealAll: false }, this.initializeBoard)
          }
        >
          Reset Game
        </button>
        {board.map((row, i) => (
          // key can be index because we're not worried about order changing
          <div key={i} style={{ display: "flex" }}>
            {row.map(tile => (
              <Tile
                {...tile}
                flipped={revealAll ? true : tile.flipped}
                key={`${tile.x}${tile.y}`}
                onClick={this.handleTileClick}
              />
            ))}
          </div>
        ))}
      </>
    );
  }
}

export default Board;
