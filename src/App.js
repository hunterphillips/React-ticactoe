/** TODO:
 * theme background
 * When someone wins, highlight the three squares that caused the win.
 */
import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./app.css";

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			themes: [
				["🐔", "🥚", "#ffd9d2"],
				["🧠", "💪", "#f0f8ff8c"],
				["🤠", "👽", "wheat"],
			],
			theme: 0,
			squares: Array(9).fill(null),
			gameOver: false,
			isTie: false,
			isX: [true, false][Math.round(Math.random())], // random first player
			history: [{ squares: Array(9).fill(null) }],
		};
		this.resetGame = this.resetGame.bind(this);
	}

	render() {
		// show who is next OR game result
		const status = this.state.isTie
			? "☹️ ties are for quitters"
			: this.state.gameOver
			? (this.state.isX
					? this.state.themes[this.state.theme][1] // previous player won if game is over
					: this.state.themes[this.state.theme][0]) + " wins!"
			: "Next player: " +
			  (this.state.isX
					? this.state.themes[this.state.theme][0]
					: this.state.themes[this.state.theme][1]);

		// list of previous moves > click to revert game to that move
		const moves = this.state.history.map((move, i) => {
			if (move.squares.length && i != this.state.history.length - 1)
				return (
					<li key={i} onClick={() => this.revertGame(move, i + 1)}>
						Replay move: {i + 1}
					</li>
				);
		});
		// theme select options
		const themes = this.state.themes.map((theme, i) => (
			<option key={i} value={i}>
				{theme[0] + " VS " + theme[1]}
			</option>
		));

		return (
			<div className="game">
				<div className="theme-select-container">
					Theme:
					<select
						name="themes"
						id="themeSelect"
						onChange={(e) => this.themeChange(e)}
					>
						{themes}
					</select>
				</div>
				<div className="game-board">
					<Board
						squares={this.state.squares}
						gameOver={this.state.gameOver}
						resetGame={this.resetGame}
						squareClick={(i) => this.squareClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}

	themeChange(e) {
		this.setState({ theme: e.target.value });
		this.resetGame();
	}

	squareClick(i) {
		// return if square already marked or game over
		if (this.state.squares[i] || this.state.gameOver) return;

		const squaresCopy = [...this.state.squares];
		squaresCopy[i] = this.state.isX
			? this.state.themes[this.state.theme][0]
			: this.state.themes[this.state.theme][1];
		this.addHistory(squaresCopy, this.state.isX);
		this.setState({
			isX: !this.state.isX,
			squares: squaresCopy,
		});
		// check if board has a winner or a tie
		if (this.isWinner(squaresCopy)) {
			return this.setState({ gameOver: true });
		}
		if (this.isTie(squaresCopy)) {
			this.setState({ gameOver: true, isTie: true });
		}
	}

	addHistory(squares, isX) {
		// store previous game state after each move
		const history = [...this.state.history, { squares: squares, isX: isX }];
		this.setState({ history: history });
	}

	isWinner(squares) {
		// check rows and columns
		for (let i = 0; i < 3; i++) {
			let row = squares.slice(i * 3, 3 + i * 3);
			if (this.isValid(row)) {
				this.highlightSquares(row);
				return true;
			}
		}
		for (let i = 0; i < 3; i++) {
			let column = [squares[i], squares[i + 3], squares[i + 6]];
			if (this.isValid(column)) {
				this.highlightSquares(column);
				return true;
			}
		}
		// check diagnols
		return (
			this.isValid([squares[0], squares[4], squares[8]]) ||
			this.isValid([squares[2], squares[4], squares[6]])
		);
	}

	isValid(values) {
		// check if all values match && are NOT null
		values = [...new Set(values)];
		return values.length === 1 && values[0];
	}

	isTie(squares) {
		// check if no squares are null (all played)
		return !squares.includes(null);
	}

	// TODO
	highlightSquares(squares) {
		// console.log(squares);
	}

	revertGame(move, moveNumber) {
		// restore game to previous move
		let history = this.state.history.slice(0, moveNumber);
		this.setState({
			history: history,
			squares: move.squares,
			gameOver: false,
			isTie: false,
			isX: !move.isX,
		});
		this.render();
	}

	resetGame() {
		// clearsquares & history
		this.setState({
			isX: [true, false][Math.round(Math.random())],
			gameOver: false,
			isTie: false,
			squares: Array(9).fill(null),
			history: [{ squares: Array(9).fill(null) }],
		});
	}
}

// board
class Board extends React.Component {
	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
				<div
					id="replayButton"
					className={this.props.gameOver ? "show" : "hide"}
					onClick={() => this.props.resetGame()}
				>
					Play Again
				</div>
			</div>
		);
	}

	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.squareClick(i)}
			/>
		);
	}
}

// board square (function component)
function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

export default hot(module)(Game);
