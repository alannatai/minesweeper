/*
generate mines
- certain amount of mines for a certain size of board 9x9 has 10mines
- mines should not be generated in the same spot

generate board
- loop through each cell 
- check if cell has a mine
- if it doesnt then does it have a mine next to it
- depending on how many mines, assign that cell a number
- if no mines, leave blank

cell has 3 states
- shown
- flagged
- bombed

when cell clicked
- check if has bomb, game over
- if number, show
- if empty, clear spot and check adjacent spots
  - loop through adjacent spots, if empty clear spot

when right clicked
- show flag

right click number
- clear all spots adjacent to it except for flags

win
- all cells that are not bombs are "flipped" or shown
*/

// class Cell {
// 	constructor(row, column, id, open, flag, mine) {
// 		this.row = row;
// 		this.column = column;
// 		this.id = `${row}${column}`;
// 		this.open = false;
// 		this.flag = false;
// 		this.mine = false;
// 	}
// }

// class Game {
//   constructor (rows, columns, mines) {
//     this.rows = 9;
//     this.columns = 9;
//     this.mines = 10;
//     this.board = new Array(this.rows);
//   }

//     const cellEl = $('<div></div>').addClass('cell').attr('id');
//     $('#board').append();
//     console.log($('#board'))
//     }

// }

let rows = 9;
let columns = 9;
let mineCount = 10;
let cells = [];

function createGameboard(length, value) {
	return new Array(length).fill(value);
}
let gameboard = createGameboard(rows, null).map(() =>
	createGameboard(columns, 0)
);

for (let i = 0; i < gameboard.length; i++) {
	for (let j = 0; j < gameboard[i].length; j++) {
		const cellEl = $('<div></div>').addClass('cell');
		$('#board').append(cellEl.attr('id', `${i}${j}`));
		cells.push([i, j]);
	}
}

const generateMines = function() {
	for (let i = 0; i < mineCount; i++) {
		let randomMines = Math.floor(Math.random() * cells.length);
		let mine = cells[randomMines];
		gameboard[mine[0]][mine[1]] = 'mine';
		$(`#${mine[0]}${mine[1]}`).css('background-color', 'red');
		cells.splice(randomMines, 1);
	}
};

generateMines();

const generateAdjacent = function() {
	for (let i = 0; i < gameboard.length; i++) {
		for (let j = 0; j < gameboard[i].length; j++) {}
	}
};

console.log('cells:', cells);
console.log('gameboard:', gameboard);
