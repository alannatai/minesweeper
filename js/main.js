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
	}
}

generateMines();

//CALCULATE AND PRINT CELLS ADJACENT TO MINES
function generateAdjacent() {
  let adjMineCount = 0
	for (let row = 0; row < gameboard.length; row++) {
		for (let col = 0; col < gameboard[row].length; col++) {

      //CHECK IF CELLS ARE BEYOND THE EDGE OF THE BOARD
      if ((row - 1) >= 0 && (row + 1) < rows && (col - 1) >= 0 && (col + 1) < columns) {
        //CHECK HOW MANY ADJACENT MINES TO CELL
        if (gameboard[row - 1][col] === 'mine') {adjMineCount += 1}
        if (gameboard[row - 1][col + 1] === 'mine') {adjMineCount += 1}
        if (gameboard[row][col + 1] === 'mine') {adjMineCount += 1}
        if (gameboard[row + 1][col + 1] === 'mine') {adjMineCount += 1}
        if (gameboard[row + 1][col] === 'mine') {adjMineCount += 1}
        if (gameboard[row + 1][col - 1] === 'mine') {adjMineCount += 1}
        if (gameboard[row][col - 1] === 'mine') {adjMineCount += 1}
        if (gameboard[row - 1][col - 1] === 'mine') {adjMineCount += 1}
      }
      
      //SET CELL TO PRINT MINE COUNT
			if (!(gameboard[row][col] === 'mine')) {
				gameboard[row][col] = adjMineCount;
      }
      //RESET MINE COUNT
			adjMineCount = 0;
		}
	}
}

//optimize code to loop 10 times on the mines
//check area around each mine and +1 to all squares surrounding
//then increment for every adjacent mine

generateAdjacent();

let safeCellsIds = safeCells.map(cell => cell.join(''));
console.log(safeCellsIds);
console.table(gameboard);

//RIGHT CLICK EVENT HANDLER TO PLACE AND REMOVE FLAGS
$('.cell').mousedown(function(event) {
	let cellEl = $(`#${this.id[0]}${this.id[1]}`);

	if (event.which === 3) {
		const $this = $(this);
		$this.toggleClass('flagged');

		if ($this.hasClass('flagged')) {
			cellEl.html('');
			cellEl.on('click', clickHandler);
		} else {
			cellEl.html(`&#128681;`);
			cellEl.off('click', clickHandler);
		}
	}
});

//ON CELL CLICK EVENT HANDLER
$('.cell').on('click', clickHandler);

function clickHandler(event) {
	let $this = event.target;
	let cell = gameboard[$this.id[0]][$this.id[1]];
	let cellEl = $(`#${$this.id[0]}${$this.id[1]}`);

	console.log(cell);

	if (cell === 'mine') {
		$('#status-message')
			.text('GAME OVER')
			.css('color', 'red');
		cellEl.css('background-color', 'red').html(`&#128163;`);
		$('.cell').off('click', clickHandler);
	} else if (cell > 0) {
		cellEl.text(`${cell}`).css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf($this.id)] = 'opened';
	} else if (cell === 0) {
		cellEl.css('background-color', 'silver');
		show($this.id[0], $this.id[1]);
		cell = null;
		safeCellsIds[safeCellsIds.indexOf($this.id)] = 'opened';
	}
	winCheck();
	console.table(gameboard);
	console.log(safeCellsIds);
}

function show(row, column) {
	$(`#${+row}${+column}`).css('background-color', 'silver');
	gameboard[row][column] = null;
	safeCellsIds[safeCellsIds.indexOf(`${+row}${+column}`)] = 'opened';

	if (+row - 1 === -1) {
	} else if (gameboard[+row - 1][+column] === 0) {
		show(+row - 1, +column);
	} else if (gameboard[+row - 1][+column] > 0) {
		$(`#${+row - 1}${+column}`)
			.text(`${gameboard[+row - 1][+column]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row - 1}${+column}`)] = 'opened';
	}

	if (+row - 1 === -1 || +column - 1 === -1) {
	} else if (gameboard[+row - 1][+column - 1] === 0) {
		show(+row - 1, +column - 1);
	} else if (gameboard[+row - 1][+column - 1] > 0) {
		$(`#${+row - 1}${+column - 1}`)
			.text(`${gameboard[+row - 1][+column - 1]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row - 1}${+column - 1}`)] = 'opened';
	}

	if (+row - 1 === -1 || +column + 1 >= columns) {
	} else if (gameboard[+row - 1][+column + 1] === 0) {
		show(+row - 1, +column + 1);
	} else if (gameboard[+row - 1][+column + 1] > 0) {
		$(`#${+row - 1}${+column + 1}`)
			.text(`${gameboard[+row - 1][+column + 1]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row - 1}${+column + 1}`)] = 'opened';
	}

	if (+column - 1 === -1) {
	} else if (gameboard[+row][+column - 1] === 0) {
		show(+row, +column - 1);
	} else if (gameboard[+row][+column - 1] > 0) {
		$(`#${+row}${+column - 1}`)
			.text(`${gameboard[+row][+column - 1]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row}${+column - 1}`)] = 'opened';
	}

	if (+column + 1 >= columns) {
	} else if (gameboard[+row][+column + 1] === 0) {
		show(+row, +column + 1);
	} else if (gameboard[+row][+column + 1] > 0) {
		$(`#${+row}${+column + 1}`)
			.text(`${gameboard[+row][+column + 1]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row}${+column + 1}`)] = 'opened';
	}

	if (+row + 1 >= rows || +column - 1 === -1) {
	} else if (gameboard[+row + 1][+column - 1] === 0) {
		show(+row + 1, +column - 1);
	} else if (gameboard[+row + 1][+column - 1] > 0) {
		$(`#${+row + 1}${+column - 1}`)
			.text(`${gameboard[+row + 1][+column - 1]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row + 1}${+column - 1}`)] = 'opened';
	}

	if (+row + 1 >= rows) {
	} else if (gameboard[+row + 1][+column] === 0) {
		show(+row + 1, +column);
	} else if (gameboard[+row + 1][+column] > 0) {
		$(`#${+row + 1}${+column}`)
			.text(`${gameboard[+row + 1][+column]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row + 1}${+column}`)] = 'opened';
	}

	if (+row + 1 >= rows || +column + 1 >= columns) {
	} else if (gameboard[+row + 1][+column + 1] === 0) {
		show(+row + 1, +column + 1);
	} else if (gameboard[+row + 1][+column + 1] > 0) {
		$(`#${+row + 1}${+column + 1}`)
			.text(`${gameboard[+row + 1][+column + 1]}`)
			.css('background-color', 'silver');
		safeCellsIds[safeCellsIds.indexOf(`${+row + 1}${+column + 1}`)] = 'opened';
	}
	winCheck();
}

//WIN CONDITION
function winCheck() {
	let allOpened = safeCellsIds.every(val => val === 'opened');

	if (allOpened) {
		$('#status-message')
			.text('YOU WIN!')
			.css('color', 'cornflowerblue');
		$('.cell').off('click', clickHandler);
		$('#fireworks').addClass('img-show');
	}
}

winCheck();
