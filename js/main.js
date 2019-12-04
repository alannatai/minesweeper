const levels = {
  'easy': {
    rows: 9,
    columns: 9,
    mineCount: 10,
    boardWidth: '270px'
  },
  'medium': {
    rows: 16,
    columns: 16,
    mineCount: 40,
    boardWidth: '480px'
  },
  'hard': {
    rows: 16,
    columns: 30,
    mineCount: 99,
    boardWidth: '900px'
  }
}
const numColours = {
  1: 'blue',
  2: 'green',
  3: 'red',
  4: 'navy',
  5: 'brown',
  6: 'teal',
  7: 'black',
  8: 'grey'
}
let gameboard;
let cellStateBoard;
let safeCells = [];

//CREATE BLANK GAMEBOARD FROM ROW/COLUMN SIZE
function createRow(length, value) {
	return new Array(length).fill(value);
}

function createGameboard () {
  let mappedBoard = createRow(rows, null).map(() => createRow(columns, 0));
  return mappedBoard;
}

//RENDER GAMEBOARD INTO DOM
//GENERATE RANDOM MINES INTO GAMEBOARD
function generateGameboard() {
  for (let i = 0; i < gameboard.length; i++) {
    for (let j = 0; j < gameboard[i].length; j++) {
      const cellEl = $('<div></div>').addClass('cell');
      $('#board').append(cellEl.attr('id', `${i}-${j}`));
      safeCells.push([i, j]);
    }
  }

	for (let i = 0; i < mineCount; i++) {
		let randomMines = Math.floor(Math.random() * safeCells.length);
		let mine = safeCells[randomMines];

    gameboard[mine[0]][mine[1]] = 'mine'; //set mines into gameboard
    cellStateBoard[mine[0]][mine[1]] = 'mine';
		
		safeCells.splice(randomMines, 1); //remove mines from cells array to avoid repeating mines
  }
}

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

function levelInitiator(level) {
  rows = levels[level].rows;
  columns = levels[level].columns;
  mineCount = levels[level].mineCount;
  $('#board').empty().css('width', `${levels[level].boardWidth}`); 

  gameboard = null;
  cellStateBoard = null;
  safeCells = [];
  $('#status-message').text('');
  $('#fireworks').removeClass('img-show');
  gameboard = createGameboard();
  cellStateBoard = createGameboard();
  generateGameboard();
  generateAdjacent();

  $('#easy').on('click', function() {levelInitiator('easy')});
  $('#med').on('click', function() {levelInitiator('medium')});
  $('#hard').on('click', function() {levelInitiator('hard')});
  $('.cell').on('click', clickHandler); 
  $('.cell').on('mousedown', rightClickHandler);
}

levelInitiator('easy');

//optimize code to loop 10 times on the mines
//check area around each mine and +1 to all squares surrounding
//then increment for every adjacent mine

//RIGHT CLICK EVENT HANDLER TO PLACE AND REMOVE FLAGS
function rightClickHandler(event) {
  let $this = event.target;
  let idArray = $this.id.split('-');
  let cellEl = $(`#${$this.id}`);

	if (event.which === 3) {
    const $this = $(this);
    if(cellStateBoard[idArray[0]][idArray[1]] === 0 || cellStateBoard[idArray[0]][idArray[1]] === 'mine'){
      
      $this.toggleClass('flagged');

      if ($this.hasClass('flagged')) {
        cellEl.html('');
        cellEl.on('click', clickHandler);
      } else {
        cellEl.html(`&#128681;`);
        cellEl.off('click', clickHandler);
      }
    }
  }
}

//ON CELL CLICK EVENT HANDLER
function clickHandler(event) {
  let $this = event.target;
  let idArray = $this.id.split('-');
  let cell = gameboard[idArray[0]][idArray[1]];
  let cellEl = $(`#${$this.id}`)

	if (cell === 'mine') {
    $('#status-message').text('GAME OVER').css('color', 'red');
		cellEl.css('background', 'red').html(`&#128163;`);
    $('.cell').off('click', clickHandler);
    $('.cell').off('mousedown', rightClickHandler);
	} else if (cell > 0) {
    cellEl.text(`${cell}`).css({'background': 'silver', 'color': numColours[cell]});
    cellStateBoard[idArray[0]][idArray[1]] = 'opened';
	} else if (cell === 0) {
		show(idArray[0], idArray[1]);
  }
  console.log(gameboard);
	winCheck();
}

function showCheck(row, column){
  if (row >= 0 && row < rows && column >= 0 && column < columns) {
    let cell = gameboard[row][column];
    if (cell === 0) {
      show(row, column);
    } else if (cell > 0) {
      $(`#${row}-${column}`).text(`${cell}`).css({'background': 'silver', 'color': numColours[cell]});
      cellStateBoard[row][column] = 'opened';
    }
  }
}

function show(row, column) {
	$(`#${row}-${column}`).css('background', 'silver');
	gameboard[+row][+column] = null;
	cellStateBoard[+row][+column] = 'opened';

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
	let allOpened = cellStateBoard.every(array => {
    let allOpenedValues = array.every(val => val === 'opened' || val === 'mine')
    return allOpenedValues;
  });

	if (allOpened) {
		$('#status-message')
			.text('YOU WIN!')
			.css('color', 'cornflowerblue');
    $('.cell').off('click', clickHandler);
    $('.cell').off('mousedown', rightClickHandler);
		$('#fireworks').addClass('img-show');
	}
}

winCheck();
