//////*--------------- CONSTANTS ---------------*//////
const LEVELS = {
	easy: {
		rows: 9,
		columns: 9,
		mineCount: 10,
		boardWidth: '270px'
	},
	medium: {
		rows: 16,
		columns: 16,
		mineCount: 40,
		boardWidth: '480px'
	},
	hard: {
		rows: 16,
		columns: 30,
		mineCount: 99,
		boardWidth: '900px'
	}
};

const NUMBER_COLOURS = {
	1: 'blue',
	2: 'green',
	3: 'red',
	4: 'navy',
	5: 'brown',
	6: 'teal',
	7: 'black',
	8: 'grey'
};

//////*--------------- VARIABLES ---------------*//////
let gameboard;
let revealedBoard;
let safeCells = [];
let currentMineCount;
let adjMineCount = 0;
let adjFlagCount = 0;

//////*--------------- DOM ELEMENTS ---------------*//////
const boardEl = $('#board');
const mineCounterEl = $('#mine-count');
const statusMessageEl = $('#status-message');

//////*--------------- GENERATE BOARD FUNCTIONS ---------------*//////

//CREATE BLANK GAMEBOARD FROM ROW/COLUMN LENGTH
function createRow(length, value) {
	return new Array(length).fill(value);
}
function createGameboard() {
	let mappedBoard = createRow(rows, null).map(() => createRow(columns, 0));
	return mappedBoard;
}

//RENDER GAMEBOARD INTO DOM
function generateGameboard() {
	for (let row = 0; row < gameboard.length; row++) {
		for (let col = 0; col < gameboard[row].length; col++) {
			const cellEl = $('<div></div>').addClass('cell');
			boardEl.append(cellEl.attr('id', `${row}-${col}`));
			safeCells.push([row, col]);
		}
  }
};

//GENERATE RANDOM MINES INTO GAMEBOARD
function generateMines() {
	for (let i = 0; i < mineCount; i++) {
		let randomMines = Math.floor(Math.random() * safeCells.length);
		let mine = safeCells[randomMines];

		gameboard[mine[0]][mine[1]] = 'mine'; //set mines into gameboard
		revealedBoard[mine[0]][mine[1]] = 'mine';

		safeCells.splice(randomMines, 1); //remove mines from cells array to avoid repeating mines
	}
};

//APPLY CALLBACK TO 8 ADJACENT CELLS
function checkAdjacent(cb, row, col) {
  cb(row - 1, col - 1);
  cb(row - 1, col);
  cb(row - 1, col + 1);
  cb(row, col - 1);
  cb(row, col + 1);
  cb(row + 1, col - 1);
  cb(row + 1, col);
  cb(row + 1, col + 1);
};

//CHECK IF CELLS ARE WITHIN EDGE OF BOARD & INCREMENT MINEMOUNT
function countMines(row, col) {
	if (row >= 0 && row < rows && col >= 0 && col < columns) {
		if (gameboard[row][col] === 'mine') {
			adjMineCount += 1;
		}
	}
}

//LOOP THROUGH GAMEBOARD AND PRINT CELLS ADJACENT TO MINES
function generateNumbers() {
	for (let row = 0; row < gameboard.length; row++) {
    for (let col = 0; col < gameboard[row].length; col++) {
    
      //CHECK HOW MANY ADJACENT MINES TO CELL
      checkAdjacent(countMines, row, col);

			//SET CELL TO MINE COUNT
			if (!(gameboard[row][col] === 'mine')) {
				gameboard[row][col] = adjMineCount;
			}
			//RESET MINE COUNT
			adjMineCount = 0;
		}
	}
}

//optimize code to loop 10 times on the mines VS loop entire board
//check area around each mine and +1 to all squares surrounding then increment for every adjacent mine

//////*--------------- CLICK HANDLER FUNCTIONS ---------------*//////

//CHECK IF CELLS ARE WITHIN EDGE OF BOARD & INCREMENT FLAGCOUNT
function countFlags(row, col) {
	if (row >= 0 && row < rows && col >= 0 && col < columns) {
		if ($(`#${row}-${col}`).hasClass('flagged')) {
			adjFlagCount += 1;
		}
	}
}

//RIGHT CLICK EVENT HANDLER
function rightClickHandler(event) {
	const row = parseInt(event.target.id.split('-')[0]);
	const col = parseInt(event.target.id.split('-')[1]);
	const cell = gameboard[row][col];
	const cellEl = $(`#${event.target.id}`);

	if (event.which === 3) {
		const $this = $(this);

		//CLOSED CELL IS RIGHT CLICKED
		if (revealedBoard[row][col] !== 'opened') {
			//TOGGLE FLAG ON OR OFF
			if ($this.hasClass('flagged')) {
				renderNoFlag(cellEl);
				$this.toggleClass('flagged');
			} else {
				renderFlag(cellEl);
				$this.toggleClass('flagged');
			}
		}
		//OPENED NUMBER IS RIGHT CLICKED
		if (gameboard[row][col] > 0 && revealedBoard[row][col] === 'opened') {
      //CHECK HOW MANY ADJACENT FLAGS TO CELL
			checkAdjacent(countFlags, row, col);
      //SHOW CELLS IF THERE IS THE CORRECT AMOUNT OF FLAGS
			if (cell === adjFlagCount) {
				showClicked(row, col);
      }
      //RESET FLAG COUNT
			adjFlagCount = 0;
		}
	}
	winCheck();
}

//ON CELL CLICK EVENT HANDLER
function clickHandler(event) {
	const idArray = event.target.id.split('-');
	const cell = gameboard[idArray[0]][idArray[1]];
	const cellEl = $(`#${event.target.id}`);

	if (cell === 'mine') {
		renderGameOver(cellEl);
	} else if (cell > 0) {
		renderCellNumber(idArray[0],idArray[1], cell, cellEl);
	} else if (cell === 0) {
		showClicked(idArray[0], idArray[1]);
	}
	winCheck();
}

//OPEN ALL CELLS ON THE BOARD
function openAllClickHandler() {
	for (let row = 0; row < gameboard.length; row++) {
		for (let col = 0; col < gameboard[row].length; col++) {
			showAdjacent(row, col);
			if (currentMineCount === 0) {
				winCheck();
			}
		}
	}
}

//////*--------------- REVEAL EMPTY SECTION FUNCTIONS ---------------*//////

//SHOW EMPTY CELL AND CHECK ADJACENT
function showClicked(row, col) {
	$(`#${row}-${col}`).css('background', 'silver');
	const rowNum = parseInt(row);
	const colNum = parseInt(col);
	revealedBoard[rowNum][colNum] = 'opened';

	if (gameboard[rowNum][colNum] === 0) {
		gameboard[rowNum][colNum] = null;
  }
  checkAdjacent(showAdjacent, rowNum, colNum);
}

//CHECK ADJACENT AND SHOW ADJACENT CELLS 
function showAdjacent(row, col) {
	//IF CELLS ARE WITHIN EDGE OF BOARD
	if (row >= 0 && row < rows && col >= 0 && col < columns) {
		const cell = gameboard[row][col];
		const cellEl = $(`#${row}-${col}`);
		const cellElFlagged = cellEl.hasClass('flagged');

		if (cell === 0 && !cellElFlagged) {   //NO VALUE AND NOT FLAGGED
			showClicked(row, col);
		} else if (cell > 0 && !cellElFlagged) {    //NUMBER AND NOT FLAGGED
      renderCellNumber(row, col, cell, cellEl);   
		} else if (cell === 'mine' && !cellElFlagged) {   //MINE AND NOT FLAGGED
			renderGameOver(cellEl);
		}
	}
}

//WIN CONDITION
function winCheck() {
	let allOpened = revealedBoard.every(array => {
		let allOpenedValues = array.every(
			val => val === 'opened' || val === 'mine'
		);
		return allOpenedValues;
	});

	if (allOpened) {
		renderWin();
	}
}

//////*--------------- RENDER FUNCTIONS ---------------*//////
function renderCellNumber(row, col, cell, cellEl) {
  cellEl
  .text(`${cell}`)
  .css({ background: 'silver', color: NUMBER_COLOURS[cell] });
  revealedBoard[row][col] = 'opened';
};

function renderFlag(cellEl) {
  cellEl.html(`&#128681;`);
	mineCounterEl.text(`${(currentMineCount -= 1)}`);
	cellEl.off('click', clickHandler);
};

function renderNoFlag(cellEl) {
  cellEl.html('');
	mineCounterEl.text(`${(currentMineCount += 1)}`);
	cellEl.on('click', clickHandler);
};

function renderGameOver(cellEl) {
	statusMessageEl.text('GAME OVER').css('color', 'red');
	cellEl.css('background', 'red').html(`&#128163;`);
	$('.cell').off('click', clickHandler);
	$('.cell').off('mousedown', rightClickHandler);
};

function renderWin() {
	statusMessageEl.text('YOU WIN!').css('color', '#60d1e5');
	mineCounterEl.text('0').css('color', '#60d1e5');
	$('.cell').off('click', clickHandler);
	$('.cell').off('mousedown', rightClickHandler);
	$('#open-all').off('click', openAllClickHandler);
	$('#fireworks').addClass('img-show');
};

//////*--------------- INITIALIZE FUNCTIONS ---------------*//////
function init(level) {
	rows = LEVELS[level].rows;
	columns = LEVELS[level].columns;
	mineCount = LEVELS[level].mineCount;
	boardEl.empty().css('width', `${LEVELS[level].boardWidth}`);

	gameboard = null;
	revealedBoard = null;
	safeCells = [];
	currentMineCount = LEVELS[level].mineCount;
	mineCounterEl.text(`${currentMineCount}`).css('color', 'red');
	statusMessageEl.text('');
	$('#fireworks').removeClass('img-show');
	gameboard = createGameboard();
	revealedBoard = createGameboard();
  generateGameboard();
  generateMines();
	generateNumbers();

	$('.cell').on('click', clickHandler);
	$('.cell').on('mousedown', rightClickHandler);
	$('#open-all').on('click', openAllClickHandler);
}

function levelListeners() {
	$('#easy').on('click', function() {
		init('easy');
	});
	$('#med').on('click', function() {
		init('medium');
	});
	$('#hard').on('click', function() {
		init('hard');
	});
}

init('easy');
levelListeners();
