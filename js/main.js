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

let adjMineCount = 0

function checkAdjacent(row, col) {
  //CHECK IF CELLS ARE BEYOND THE EDGE OF THE BOARD
  if (row >= 0 && row < rows && col >= 0 && col < columns) {
    if (gameboard[row][col] === 'mine') {
      adjMineCount += 1
    }
  }
}

//CALCULATE AND PRINT CELLS ADJACENT TO MINES
function generateAdjacent() {
	for (let row = 0; row < gameboard.length; row++) {
		for (let col = 0; col < gameboard[row].length; col++) {

      //CHECK HOW MANY ADJACENT MINES TO CELL
      checkAdjacent(row - 1, col);
      checkAdjacent(row - 1, col + 1);
      checkAdjacent(row, col + 1);
      checkAdjacent(row + 1, col + 1);
      checkAdjacent(row + 1, col);
      checkAdjacent(row + 1, col - 1);
      checkAdjacent(row, col - 1);
      checkAdjacent(row - 1, col - 1);
      
      //SET CELL TO MINE COUNT
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
		show($this.id[0], $this.id[1]);
	}
	winCheck();
	console.table(gameboard);
	console.log(safeCellsIds);
}

function showCheck(row, column){
  if (row >= 0 && row < rows && column >= 0 && column < columns) {
    if (gameboard[row][column] === 0) {
      show(row, column);
    } else if (gameboard[row][column] > 0) {
      $(`#${row}${column}`).text(`${gameboard[row][column]}`).css('background-color', 'silver');
      safeCellsIds[safeCellsIds.indexOf(`${row}${column}`)] = 'opened';
    }
  }
}

function show(row, column) {
	$(`#${+row}${+column}`).css('background-color', 'silver');
	gameboard[+row][+column] = null;
	safeCellsIds[safeCellsIds.indexOf(`${+row}${+column}`)] = 'opened';

  showCheck(+row - 1, +column);
  showCheck(+row - 1, +column - 1);
  showCheck(+row - 1, +column + 1);
  showCheck(+row, +column - 1);
  showCheck(+row, +column + 1);
  showCheck(+row + 1, +column - 1);
  showCheck(+row + 1, +column);
  showCheck(+row + 1, +column + 1);

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
