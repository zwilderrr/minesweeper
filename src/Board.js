import React from "react";

import Tile from "./Tile";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // initialize a board with default values passed by the Game
    this.initializeBoard();
  }

  // Why a class component instead of a functional one?
  // i felt this was clearer than using refs with Hooks to keep track of the component's previous props
  componentDidUpdate(prevProps) {
    const { gameStatus, height, level } = this.props;
    const prevGameStatus = prevProps.gameStatus;
    const prevHeight = prevProps.height;
    const prevLevel = prevProps.level;

    // note: these can be combined into one `if` statement but i thought it clearer to break them out
    // check to see if the board received new props. If so, reinitialize the board
    if (prevHeight !== height || prevLevel !== level) {
      this.initializeBoard();
    }

    // user made no changes to the game configuration (i.e.: he or she just wants to play again)
    // we make a new board
    if (prevGameStatus !== "playing" && gameStatus === "playing") {
      this.initializeBoard();
    }
  }

  initializeBoard = () => {
    const { height, width } = this.props;
    const board = this.createBoardWithBombs();
    let bombCount = 0;

    // O(n^2) is far from ideal, but we're dealing with small numbers here so it won't matter
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

    // check all surrounding squares for a bomb
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
    // nextTile createas a reference to board[y][x], so we never have to reassign board[y][x] = nextTile
    // after making our changes to nextTile
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
    // I love recursion because i love recurion
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

    board.forEach(row => {
      row.forEach(tile => {
        tileCount++;
        tile.bomb && actualBombCount++;
        tile.flipped && flipped++;
      });
    });

    return flipped + actualBombCount === tileCount;
  }

  endGame(gameWon = false) {
    this.props.reportEndOfGame(gameWon ? "won" : "lost");
  }

  render() {
    const { gameStatus, disableTiles } = this.props;
    const { board, bombCount } = this.state;

    // logic regarding how to show Tiles is derived from the current state of
    // the Game, leaving the Board free to make decisions on how to show its Tiles
    const revealAllTiles = gameStatus === "lost";
    const revealNoTiles = gameStatus === "waiting";
    return (
      <>
        <div className="row border">
          <div
            style={{
              margin: 10,
              borderRadius: 3,
              padding: 5,
              fontSize: 20,
              border: "solid thin red",
              // give it a fixed width to prevent jumping when a negative sign is applied
              width: "200px",
            }}
            className="bombs"
          >
            Bombs remaining: {bombCount}
          </div>
          <div style={{ margin: "auto" }}>
            {board &&
              board.map((row, i) => (
                <div key={i} style={{ display: "flex" }}>
                  {row.map(tile => (
                    <Tile
                      {...tile}
                      flipped={
                        revealAllTiles
                          ? true
                          : revealNoTiles
                          ? false
                          : tile.flipped
                      }
                      // make sure the flags are removed after the game is reset
                      flagged={revealNoTiles ? false : tile.flagged}
                      key={`${tile.x}${tile.y}`}
                      onClick={this.handleTileClick}
                      disabled={disableTiles || tile.flipped}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
}

export default Board;
