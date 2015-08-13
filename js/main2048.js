var board = new Array();
var score = 0;

$(document).ready(function() {
  newgame();
});

function newgame() {
  //init
  init();
  //random  2 num
  genrateOneNumber();
  genrateOneNumber();
}

function init() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $('#grid-cell-' + i + "-" + j);
      gridCell.css('top', getPosTop(i, j));
      gridCell.css('left', getPosLeft(i, j));
    }
  }
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
    }
  }
  updateBoardView();
  score = 0;
}

function updateBoardView() { //动态添加number
  $(".number-cell").remove();
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++) {
      $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
      var theNumberCell = $('#number-cell-' + i + '-' + j);

      if (board[i][j] == 0) {
        theNumberCell.css('width', '0px');
        theNumberCell.css('height', '0px');
        theNumberCell.css('top', getPosTop(i, j) + 50);
        theNumberCell.css('left', getPosLeft(i, j) + 50);
      } else {
        theNumberCell.css('width', '100px');
        theNumberCell.css('height', '100px');
        theNumberCell.css('top', getPosTop(i, j));
        theNumberCell.css('left', getPosLeft(i, j));
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
    }
}

function genrateOneNumber() {
  if (nospace(board))
    return false;

  //随机位置
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));

  while (true) {
    if (board[randx][randy] == 0)
      break;
    //重新生成位子
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
  }
  //随机数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  //Combin num and place
  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);
  return true;
}

$(document).keydown(function(event) {
  switch (event.keyCode) {
    case 37: //left
      if (moveLeft()) {
        setTimeout("genrateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      } //判断向左移动且判断能否向左移动
      break;
    case 38:
      if (moveUp()) {
        setTimeout("genrateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 39:
      if (moveRight()) {
        setTimeout("genrateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 40:
      if (moveDown()) {
        setTimeout("genrateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    default:
      break;
  }
});

function isGameOver() {
  if (nospace(board) && nomove(board))
    gameover();
}

function gameover() {
  alert("Game Over");
}
/*
判断canMoveLeft()?
左边是否有数字
左边数字是否和自己相等？？
*/
function moveLeft() {
  if (!canMoveLeft(board))
    return false;

  /*moveLetf
    落脚位置是否为空？
    落脚位置数字和带移动数字的位置是否相等？
    移动路径中是否有障碍物？
  */
  for (var i = 0; i < 4; i++)
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            //moveLetf
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] *= 2;
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveRight() {
  if (!canMoveRight(board))
    return false;

  //moveRight
  for (var i = 0; i < 4; i++)
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {

          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] *= 2;
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp() {

  if (!canMoveUp(board))
    return false;

  //moveUp
  for (var j = 0; j < 4; j++)
    for (var i = 1; i < 4; i++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {

          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown() {
  if (!canMoveDown(board))
    return false;

  //moveDown
  for (var j = 0; j < 4; j++)
    for (var i = 2; i >= 0; i--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {

          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoardView()", 200);
  return true;
}
