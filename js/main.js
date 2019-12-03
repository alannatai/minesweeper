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
let safeCells = [];
let gameWon = false;

//CREATE BLANK GAMEBOARD FROM ROW/COLUMN SIZE
function createGameboard(length, value) {
	return new Array(length).fill(value);
}
let gameboard = createGameboard(rows, null).map(() =>
	createGameboard(columns, 0)
);

//RENDER GAMEBOARD INTO DOM
for (let i = 0; i < gameboard.length; i++) {
	for (let j = 0; j < gameboard[i].length; j++) {
		const cellEl = $('<div></div>').addClass('cell');
		$('#board').append(cellEl.attr('id', `${i}${j}`));
		safeCells.push([i, j]);
	}
}

//GENERATE RANDOM MINES INTO GAMEBOARD
function generateMines() {
	for (let i = 0; i < mineCount; i++) {
		let randomMines = Math.floor(Math.random() * safeCells.length);
		let mine = safeCells[randomMines];

		gameboard[mine[0]][mine[1]] = 'mine'; //set mines into gameboard
		//set mines into DOM
		safeCells.splice(randomMines, 1); //remove mines from cells array

		//check adjcent spaces to mines
		//if not outside board, add +1 to every adjacent cell
		// let row = mine[0];
		// let column = mine[1];

		// if ((gameboard[row][column] === 'mine')) {
		//   check(gameboard, row, column);
		// }

		// gameboard[row][column + 1] += 1;
		// gameboard[row + 1][column] += 1;
		// gameboard[row + 1][column + 1] += 1;
		// gameboard[row - 1][column] += 1;
		// gameboard[row - 1][column + 1] += 1;
		// gameboard[row + 1][column - 1] += 1;
		// gameboard[row][column - 1] += 1;
		// gameboard[row - 1][column - 1] += 1;
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
function check(cellRow, cellColumn) {
	if (
		cellRow - 1 === -1 ||
		cellColumn - 1 === -1 ||
		cellRow + 1 >= rows ||
		cellColumn + 1 >= columns
	) {
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
			}
			adjMineCount = 0;
		}
  }
}


//optimize code to loop 10 times, check area around each mine and +1 to all squares surrounding
// then increment for every adjacent mine

generateAdjacent();

let safeCellsIds = safeCells.map(cell => cell.join(''));
console.log(safeCellsIds)

console.log('safeCells:', safeCells);
console.table(gameboard);

//RIGHT CLICK EVENT HANDLER TO PLACE AND REMOVE FLAGS
$('.cell').mousedown(function(event) {
  let cellEl = $(`#${this.id[0]}${this.id[1]}`);

  if (event.which === 3) {
    const $this = $(this);
    $this.toggleClass('flagged');

    if ($this.hasClass('flagged')){
      cellEl.html('');
    } else {
      cellEl.html(`&#128681;`);  
    }
  }
});

//ON CELL CLICK EVENT HANDLER
$('.cell').on('click', function() {
  let cell = gameboard[this.id[0]][this.id[1]];
  let cellEl = $(`#${this.id[0]}${this.id[1]}`);
  
  console.log(cell);
  
	if (cell === 'mine') {
		$('#status-message').text('GAME OVER');
		cellEl
			.css('background-color', 'red')
			.html(`&#128163;`);
	} else if (cell > 0) {
		cellEl.text(`${cell}`);
    safeCellsIds[safeCellsIds.indexOf(this.id)] = 'opened';
	} else if (cell === 0) {
		cellEl.text(`${cell}`);
    show(this.id[0], this.id[1]);
    cell = null;
    safeCellsIds[safeCellsIds.indexOf(this.id)] = 'opened';
  }
  winCheck();
  console.table(gameboard);
  console.log(safeCellsIds);
});

function show(row, column) {
	let rowNum = parseInt(row);
  let columnNum = parseInt(column);
  
	if (rowNum - 1 === -1) {
	} else if (gameboard[rowNum - 1][columnNum] === 0) {
    $(`#${rowNum - 1}${columnNum}`).text(`${gameboard[rowNum - 1][columnNum]}`);
    gameboard[rowNum - 1][columnNum] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum - 1}${columnNum}`)] = 'opened';
    show(rowNum - 1, columnNum);
	} else if (gameboard[rowNum - 1][columnNum] > 0) {
    $(`#${rowNum - 1}${columnNum}`).text(`${gameboard[rowNum - 1][columnNum]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum - 1}${columnNum}`)] = 'opened';
  }

	if (rowNum - 1 === -1 || columnNum - 1 === -1) {
	} else if (gameboard[rowNum - 1][columnNum - 1] === 0) {
    $(`#${rowNum - 1}${columnNum - 1}`).text(`${gameboard[rowNum - 1][columnNum - 1]}`);
    gameboard[rowNum - 1][columnNum - 1] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum - 1}${columnNum - 1}`)] = 'opened';
		show(rowNum - 1, columnNum - 1);
	} else if (gameboard[rowNum - 1][columnNum - 1] > 0) {
    $(`#${rowNum - 1}${columnNum - 1}`).text(`${gameboard[rowNum - 1][columnNum - 1]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum - 1}${columnNum - 1}`)] = 'opened';
  }

	if (rowNum - 1 === -1 || columnNum + 1 >= columns) {
	} else if (gameboard[rowNum - 1][columnNum + 1] === 0) {
    $(`#${rowNum - 1}${columnNum + 1}`).text(`${gameboard[rowNum - 1][columnNum + 1]}`);
    gameboard[rowNum - 1][columnNum + 1] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum - 1}${columnNum + 1}`)] = 'opened';
		 show(rowNum - 1, columnNum + 1);
	} else if (gameboard[rowNum - 1][columnNum + 1] > 0) {
    $(`#${rowNum - 1}${columnNum + 1}`).text(`${gameboard[rowNum - 1][columnNum + 1]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum - 1}${columnNum + 1}`)] = 'opened';
  }

	if (columnNum - 1 === -1) {
	} else if (gameboard[rowNum][columnNum - 1] === 0) {
    $(`#${rowNum}${columnNum - 1}`).text(`${gameboard[rowNum][columnNum - 1]}`);
    gameboard[rowNum][columnNum - 1] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum}${columnNum - 1}`)] = 'opened';
		show(rowNum, columnNum - 1);
	} else if (gameboard[rowNum][columnNum - 1] > 0) {
    $(`#${rowNum}${columnNum - 1}`).text(`${gameboard[rowNum][columnNum - 1]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum}${columnNum - 1}`)] = 'opened';
  }

	if (columnNum + 1 >= columns) {
	} else if (gameboard[rowNum][columnNum + 1] === 0) {
    $(`#${rowNum}${columnNum + 1}`).text(`${gameboard[rowNum][columnNum + 1]}`);
    gameboard[rowNum][columnNum + 1] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum}${columnNum + 1}`)] = 'opened';
		show(rowNum, columnNum + 1);
	} else if (gameboard[rowNum][columnNum + 1] > 0) {
    $(`#${rowNum}${columnNum + 1}`).text(`${gameboard[rowNum][columnNum + 1]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum}${columnNum + 1}`)] = 'opened';
  }

	if (rowNum + 1 >= rows || columnNum - 1 === -1) {
	} else if (gameboard[rowNum + 1][columnNum - 1] === 0) {
    $(`#${rowNum + 1}${columnNum - 1}`).text(`${gameboard[rowNum + 1][columnNum - 1]}`);
    gameboard[rowNum + 1][columnNum - 1] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum + 1}${columnNum - 1}`)] = 'opened';
		show(rowNum + 1, columnNum - 1);
	} else if (gameboard[rowNum + 1][columnNum - 1] > 0) {
    $(`#${rowNum + 1}${columnNum - 1}`).text(`${gameboard[rowNum + 1][columnNum - 1]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum + 1}${columnNum - 1}`)] = 'opened';
  }

	if (rowNum + 1 >= rows) {
	} else if (gameboard[rowNum + 1][columnNum] === 0) {
    $(`#${rowNum + 1}${columnNum}`).text(`${gameboard[rowNum + 1][columnNum]}`);
    gameboard[rowNum + 1][columnNum] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum + 1}${columnNum}`)] = 'opened';
		show(rowNum + 1, columnNum);
	} else if (gameboard[rowNum + 1][columnNum] > 0) {
    $(`#${rowNum + 1}${columnNum}`).text(`${gameboard[rowNum + 1][columnNum]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum + 1}${columnNum}`)] = 'opened';
  }

	if (rowNum + 1 >= rows || columnNum + 1 >= columns) {
	} else if (gameboard[rowNum + 1][columnNum + 1] === 0) {
    $(`#${rowNum + 1}${columnNum + 1}`).text(`${gameboard[rowNum + 1][columnNum + 1]}`);
    gameboard[rowNum + 1][columnNum + 1] = null;
    safeCellsIds[safeCellsIds.indexOf(`${rowNum + 1}${columnNum + 1}`)] = 'opened';
		show(rowNum + 1, columnNum + 1);
  } else if (gameboard[rowNum + 1][columnNum + 1] > 0) {
    $(`#${rowNum + 1}${columnNum + 1}`).text(`${gameboard[rowNum + 1][columnNum + 1]}`);
    safeCellsIds[safeCellsIds.indexOf(`${rowNum + 1}${columnNum + 1}`)] = 'opened';
  }
  winCheck();
}

//WIN CONDITION
function winCheck() {
  let allOpened = safeCellsIds.every((val) => val === 'opened');

  if (allOpened) {
    $('#status-message').text('YOU WIN!');
  }
}

winCheck();

