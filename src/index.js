import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    ['00','01','02'],
    ['10','11','12'],
    ['20','21','22'],
    ['00','10','20'],
    ['01','11','21'],
    ['02','12','22'],
    ['00','11','22'],
    ['02','11','20']
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const square_a = squares[a.split('')[0]][a.split('')[1]];
    const square_b = squares[b.split('')[0]][b.split('')[1]];
    const square_c = squares[c.split('')[0]][c.split('')[1]];
    if (square_a && square_a === square_b && square_a === square_c) {
      return lines[i].concat(square_a);
    }
  }

  return null;
}

function Square(props) {
  return (
    <button className={"square" + (props.bold ? ' bold' : "") + (props.flag ? ' win' : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component { 
  renderSquare(i, j, flag) {
    const position = i + "," + j;
    const bold = this.props.preSquares[i][j] !== this.props.squares[i][j];
    return (
      <Square
        key={position}
        value={this.props.squares[i][j]}
        bold={bold}
        flag={flag}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    let btn = [];
    const winner_position = this.props.winnerPosition;
    for(let i=0; i < 3; i++){
      let row = [];
      for(let j=0; j < 3; j++){
        if(winner_position && winner_position.indexOf([i,j].join("")) >= 0){
          row = row.concat(this.renderSquare(i, j, "win"));
        }else{
          row = row.concat(this.renderSquare(i, j));
        }
      }
      btn.push(row);
    }
    return (
      <div>
        {btn.map((item, key) => {
          return <div className="board-row" key={key}>{item}</div>
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        // 错误写法，这样一维数组里每个数组指向同一对象
        // squares: Array(3).fill(Array(3).fill(null).slice()),
        squares:[[null,null,null],[null,null,null],[null,null,null]],
        position: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // 错误写法，二维数组必须拆开返回新数组，否则会指向同一对象
    // const squares = current.squares.slice();
    const squares = current.squares.map((arr) => arr.slice());
    if(calculateWinner(squares) || squares[i][j]){
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: [i,j].join(",")
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jump(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const preState = this.state.stepNumber ?  history[this.state.stepNumber - 1] : history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let desc = move ? "Move #" + move : "Game start";
      let position = move ? " - (" + step.position + ")" : "";
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jump(move)}>{desc}</a>
          <span>{position}</span>
        </li>
      )
    });

    let status;
    let winner_position;
    if(winner){
      status = 'Winner: ' + winner[3];
      winner_position = winner.slice(0, 3);
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerPosition={winner_position}
            preSquares={preState.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

