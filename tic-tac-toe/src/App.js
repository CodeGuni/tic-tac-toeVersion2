import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning' : ''}`}
      onClick={onSquareClick}
      disabled={value}
    >
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="board">
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onSquareClick={() => onSquareClick(i)}
          isWinningSquare={winningLine && winningLine.includes(i)}
        />
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState({ x: 0, o: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const { winner, line } = calculateWinner(currentSquares);

  function handleSquareClick(i) {
    if (winner || currentSquares[i]) return;
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const newWinner = calculateWinner(nextSquares).winner;
    if (newWinner) {
      setScores((prev) => ({
        ...prev,
        [newWinner.toLowerCase()]: prev[newWinner.toLowerCase()] + 1,
      }));
    }
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleNewGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const status = winner
    ? `Winner: ${winner}`
    : currentSquares.every((square) => square !== null)
    ? 'Draw: No winner'
    : `Move ${currentMove + 1}: ${xIsNext ? 'X' : 'O'}'s turn`;

  const moves = history.map((_, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to start';
    return (
      <li key={move}>
        <button className={move === currentMove ? 'active-move' : ''} onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="game-container">
      <h1>Neon Tic-Tac-Toe</h1>
      <div className="scoreboard">
        <span>X Wins: {scores.x}</span>
        <span>O Wins: {scores.o}</span>
      </div>
      <div className="status">{status}</div>
      <Board squares={currentSquares} onSquareClick={handleSquareClick} winningLine={line} />
      <button className="new-game-button" onClick={handleNewGame}>
        New Game
      </button>
      <div className="move-history">
        <h2>Move History</h2>
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

export default Game;