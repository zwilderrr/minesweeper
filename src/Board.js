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
        if (tileObject.bomb) {
          bombCount++;
        } else {
          tileObject.value = this.getSurroundingBombCount(board, y, x);
        }
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
        if (board[row][column].bomb) {
          count++;
        }
      }
    }
    return count;
  }

  makeTileObject(x, y, bombProbability) {
    const bomb = Math.random() < bombProbability;
    return {
      x,
      y,
      bomb,
      flipped: false,
      flagged: false,
      value: undefined,
    };
  }

  handleTileClick = (y, x, toggleFlag) => {
    let { board, bombCount } = this.state;
    const nextTile = board[y][x];

    if (toggleFlag) {
      nextTile.flagged = !nextTile.flagged;
      nextTile.flagged ? bombCount-- : bombCount++;
    } else if (nextTile.bomb) {
      this.endGame();
    } else {
      if (nextTile.value) {
        nextTile.flipped = true;
      } else {
        this.flipTileAndSurroundingTiles(board, y, x);
      }
    }
    if (this.isGameWon()) {
      this.endGame(true);
      return;
    }
    this.setState({ board, bombCount });
  };

  flipTileAndSurroundingTiles(board, y, x) {
    const { height, width } = this.props;
    for (let row = y - 1; row <= y + 1; row++) {
      if (row < 0 || row === width) {
        continue;
      }
      for (let column = x - 1; column <= x + 1; column++) {
        const nextTile = board[row][column];
        if (column < 0 || column === height) {
          continue;
        }
        if (!nextTile.value && !nextTile.flipped && !nextTile.flagged) {
          nextTile.flipped = true;
          this.flipTileAndSurroundingTiles(board, row, column);
        }
      }
    }
  }

  isGameWon() {
    const { board } = this.state;
    let tileCount = 0;
    let flipped = 0;
    let actualBombCount = 0;

    board.forEach((t) => {
      tileCount++;
      t.bomb && actualBombCount++;
      t.flipped && flipped++;
    });

    return flipped + actualBombCount === tileCount;
  }

  endGame(gameWon = false) {
    this.props.setGameStatus(gameWon ? "won" : "lost");
  }

  resetGame = () => {
    this.props.setGameStatus("waiting");
    this.initializeBoard();
  };

  render() {
    const { gameStatus } = this.props;
    const { board, bombCount } = this.state;

    const revealAll = gameStatus !== "waiting";

    return (
      <>
        <button onClick={() => this.resetGame()}>Reset Game</button>
        {bombCount}

        <div>
          {board &&
            board.map((row, i) => (
              // key can be index because we're not worried about order changing
              <div key={i} style={{ display: "flex" }}>
                {row.map((tile) => (
                  <Tile
                    {...tile}
                    flipped={revealAll ? true : tile.flipped}
                    key={`${tile.x}${tile.y}`}
                    onClick={this.handleTileClick}
                  />
                ))}
              </div>
            ))}
        </div>
      </>
    );
  }
}

export default Board;
