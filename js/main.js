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

//STATE
let rows = 9;
let columns = 9;
let mineCount = 10;
let cells = [];

//CREATE BLANK GAMEBOARD FROM ROW/COLUMN SIZE
function createGameboard(length, value) {
	return new Array(length).fill(value);
}
let gameboard = createGameboard(rows, null).map(() =>
	createGameboard(columns, '0')
);

//RENDER GAMEBOARD INTO DOM
for (let i = 0; i < gameboard.length; i++) {
	for (let j = 0; j < gameboard[i].length; j++) {
		const cellEl = $('<div></div>').addClass('cell');
		$('#board').append(cellEl.attr('id', `${i}${j}`));
		cells.push([i, j]);
	}
}

//GENERATE RANDOM MINES INTO GAMEBOARD
function generateMines() {
	for (let i = 0; i < mineCount; i++) {
		let randomMines = Math.floor(Math.random() * cells.length);
		let mine = cells[randomMines];
		gameboard[mine[0]][mine[1]] = 'mine';
		$(`#${mine[0]}${mine[1]}`).css('background-color', 'red').html(`&#128163;`);
		cells.splice(randomMines, 1);
	}
}

generateMines();

//CHECK ADJACENT MINES
let adjMineCount = 0;

function checkN(cellRow, cellColumn) {
	if (cellRow - 1 === -1) {
		return;
	} else if (gameboard[cellRow - 1][cellColumn] === 'mine') {
		adjMineCount += 1;
	}
}
function checkNE(cellRow, cellColumn) {
	if (cellRow - 1 === -1 || cellColumn + 1 >= columns) {
		return;
	} else if (gameboard[cellRow - 1][cellColumn + 1] === 'mine') {
		adjMineCount += 1;
	}
}
function checkE(cellRow, cellColumn) {
	if (cellColumn + 1 >= columns) {
		return;
	} else if (gameboard[cellRow][cellColumn + 1] === 'mine') {
		adjMineCount += 1;
	}
}
function checkSE(cellRow, cellColumn) {
	if (cellRow + 1 >= rows || cellColumn + 1 >= columns) {
		return;
	} else if (gameboard[cellRow + 1][cellColumn + 1] === 'mine') {
		adjMineCount += 1;
	}
}
function checkS(cellRow, cellColumn) {
	if (cellRow + 1 >= rows) {
		return;
	} else if (gameboard[cellRow + 1][cellColumn] === 'mine') {
		adjMineCount += 1;
	}
}
function checkSW(cellRow, cellColumn) {
	if (cellRow + 1 >= rows || cellColumn - 1 === -1) {
		return;
	} else if (gameboard[cellRow + 1][cellColumn - 1] === 'mine') {
		adjMineCount += 1;
	}
}
function checkW(cellRow, cellColumn) {
	if (cellColumn - 1 === -1) {
		return;
	} else if (gameboard[cellRow][cellColumn - 1] === 'mine') {
		adjMineCount += 1;
	}
}
function checkNW(cellRow, cellColumn) {
	if (cellRow - 1 === -1 || cellColumn - 1 === -1) {
		return;
	} else if (gameboard[cellRow - 1][cellColumn - 1] === 'mine') {
		adjMineCount += 1;
	}
}

//refactor checking functions*****
function check(row, column) {
  if (row - 1 === -1 || column - 1 === -1 || row + 1 >= rows || column + 1 >= columns) {
    return;
  } 
}

//CALCULATE AND PRINT CELLS ADJACENT TO MINES
function generateAdjacent() {
	for (let r = 0; r < gameboard.length; r++) {
		for (let c = 0; c < gameboard[r].length; c++) {
			checkN(r, c);
			checkNE(r, c);
			checkE(r, c);
			checkSE(r, c);
			checkS(r, c);
			checkSW(r, c);
			checkW(r, c);
			checkNW(r, c);
			if (!(gameboard[r][c] === 'mine')) {
				gameboard[r][c] = adjMineCount;
				$(`#${r}${c}`).text(`${adjMineCount}`);
			}
			adjMineCount = 0;
		}
	}
}

//optimize code to loop 10 times, check area around each mine and +1 to all squares surrounding
// then increment for every adjacent mine

generateAdjacent();

console.log('cells:', cells);
console.log('gameboard:', gameboard);

//ON CELL CLICK EVENT HANDLER
$('.cell').on('click', function() {
	let cell = gameboard[this.id[0]][this.id[1]];
	console.log(cell);
	if (cell === 'mine') {
		$('#status-message').text('GAME OVER');
	} else if (cell > 0) {
		console.log('show');
	} else if (cell === 0) {
    console.log('clear')
  }
});
