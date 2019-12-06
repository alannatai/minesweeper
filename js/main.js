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
let currentMineCount;

//CREATE BLANK GAMEBOARD FROM ROW/COLUMN LENGTH
function createRow(length, value) {
	return new Array(length).fill(value);
};
function createGameboard () {
  let mappedBoard = createRow(rows, null).map(() => createRow(columns, 0));
  return mappedBoard;
};

//RENDER GAMEBOARD INTO DOM
//GENERATE RANDOM MINES INTO GAMEBOARD
function generateGameboard() {
  for (let row = 0; row < gameboard.length; row++) {
    for (let col = 0; col < gameboard[row].length; col++) {
      const cellEl = $('<div></div>').addClass('cell');
      $('#board').append(cellEl.attr('id', `${row}-${col}`));
      safeCells.push([row, col]);
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

//CHECK IF CELLS ARE BEYOND THE EDGE OF THE BOARD
//INCREMENT MINEMOUNT
function checkAdjacentMines(row, col) {
  if (row >= 0 && row < rows && col >= 0 && col < columns) {
    if (gameboard[row][col] === 'mine') {
      adjMineCount += 1
    }
  }
}

//LOOP THROUGH GAMEBOARD AND PRINT CELLS ADJACENT TO MINES
function generateAdjacent() {
	for (let row = 0; row < gameboard.length; row++) {
		for (let col = 0; col < gameboard[row].length; col++) {

      //CHECK HOW MANY ADJACENT MINES TO CELL
      checkAdjacentMines(row - 1, col);
      checkAdjacentMines(row - 1, col + 1);
      checkAdjacentMines(row, col + 1);
      checkAdjacentMines(row + 1, col + 1);
      checkAdjacentMines(row + 1, col);
      checkAdjacentMines(row + 1, col - 1);
      checkAdjacentMines(row, col - 1);
      checkAdjacentMines(row - 1, col - 1);
      
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

let flagCount = 0;
function checkAdjacentFlags(row, col) {
  if (row >= 0 && row < rows && col >= 0 && col < columns) {
    if ($(`#${row}-${col}`).hasClass('flagged')) {
      flagCount += 1
    }
  }
}

//RIGHT CLICK EVENT HANDLER
function rightClickHandler(event) {

  // UI Variables
  const idArray = event.target.id.split('-');
  const row = parseInt(idArray[0]);
  const col = parseInt(idArray[1]);
  const cell = gameboard[row][col];
  const cellEl = $(`#${event.target.id}`);

	if (event.which === 3) {
    const $this = $(this);

    //not flagged and not opened
    if(cellStateBoard[row][col] !== 'opened'){
      
      // set the flag on/off
      if ($this.hasClass('flagged')) {
        cellEl.html('');
        $('#mine-count').text(`${currentMineCount += 1}`);
        cellEl.on('click', clickHandler);
        $this.toggleClass('flagged');
      } else {
        cellEl.html(`&#128681;`);
        $('#mine-count').text(`${currentMineCount -= 1}`);
        cellEl.off('click', clickHandler);
        $this.toggleClass('flagged');
      }
    }

    //is number and opened
    if (gameboard[row][col] > 0 && cellStateBoard[row][col] === 'opened') {
     
      checkAdjacentFlags(row - 1, col);
      checkAdjacentFlags(row - 1, col + 1);
      checkAdjacentFlags(row, col + 1);
      checkAdjacentFlags(row + 1, col + 1);
      checkAdjacentFlags(row + 1, col);
      checkAdjacentFlags(row + 1, col - 1);
      checkAdjacentFlags(row, col - 1);
      checkAdjacentFlags(row - 1, col - 1);

      if (cell === flagCount) {
        show(row, col);
      }
      flagCount = 0;
    }
  }
  winCheck();
}

//ON CELL CLICK EVENT HANDLER
function clickHandler(event) {
  const idArray = event.target.id.split('-');
  const cell = gameboard[idArray[0]][idArray[1]];
  const cellEl = $(`#${event.target.id}`)

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
	winCheck();
}

function showCheck(row, column){
  // dont run a check if the cell is not on the board
  if (row >= 0 && row < rows && column >= 0 && column < columns) {
    const cell = gameboard[row][column];
    const cellEl = $(`#${row}-${column}`);
    const cellElFlagged = cellEl.hasClass('flagged');

    if (cell === 0 && !(cellElFlagged)) {
      show(row, column);
    } else if (cell > 0 && !(cellElFlagged)) {
      // make sure you open ONLY non flagged
      cellEl.text(`${cell}`).css({'background': 'silver', 'color': numColours[cell]});
      cellStateBoard[row][column] = 'opened';
    } else if (cell === 'mine' && !(cellElFlagged)) {
      $('#status-message').text('GAME OVER').css('color', 'red');
		  cellEl.css('background', 'red').html(`&#128163;`);
      $('.cell').off('click', clickHandler);
      $('.cell').off('mousedown', rightClickHandler);
    }
  }
}

function show(row, column) {
  $(`#${row}-${column}`).css('background', 'silver');
  const rowNum = parseInt(row);
  const colNum = parseInt(column);
  cellStateBoard[rowNum][colNum] = 'opened';

  if (gameboard[rowNum][colNum] === 0) {
    gameboard[rowNum][colNum] = null;
  } 
  
  showCheck(rowNum - 1, colNum);
  showCheck(rowNum - 1, colNum - 1);
  showCheck(rowNum - 1, colNum + 1);
  showCheck(rowNum, colNum - 1);
  showCheck(rowNum, colNum + 1);
  showCheck(rowNum + 1, colNum - 1);
  showCheck(rowNum + 1, colNum);
  showCheck(rowNum + 1, colNum + 1);  
}

function openAll() {
  for (let row = 0; row < gameboard.length; row++) {
		for (let col = 0; col < gameboard[row].length; col++) {
      showCheck(row, col);
      if(currentMineCount === 0) {
        winCheck();
      }
    }
  }
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
      .css('color', '#60d1e5');
    $('#mine-count').text('0').css('color', '#60d1e5');
    $('.cell').off('click', clickHandler);
    $('.cell').off('mousedown', rightClickHandler);
		$('#fireworks').addClass('img-show');
	}
}

function init(level) {
  rows = levels[level].rows;
  columns = levels[level].columns;
  mineCount = levels[level].mineCount;
  $('#board').empty().css('width', `${levels[level].boardWidth}`); 

  gameboard = null;
  cellStateBoard = null;
  safeCells = [];
  currentMineCount = levels[level].mineCount;
  $('#mine-count').text(`${currentMineCount}`).css('color', 'red');
  $('#status-message').text('');
  $('#fireworks').removeClass('img-show');
  gameboard = createGameboard();
  cellStateBoard = createGameboard();
  generateGameboard();
  generateAdjacent();

  $('.cell').on('click', clickHandler); 
  $('.cell').on('mousedown', rightClickHandler);
  $('#open-all').on('click', openAll);
  console.log('gameboard', gameboard);
}

function levelListeners() {
  $('#easy').on('click', function() { init('easy') });
  $('#med').on('click', function() { init('medium') });
  $('#hard').on('click', function() { init('hard') });
};

init('easy');
levelListeners();
