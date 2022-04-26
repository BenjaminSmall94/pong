'use strict';

// ************ Global Variables ****************

const BALLDIAMETER = 18;
const PADDLEHEIGHT = 90;
const PADDLEWIDTH = 20;
let ballXY = [471,231];
let playerXY = [80, 195];
let cpuXY = [880, 195];
let ballSpeed = 5;
let ballVelocity = getBallVelocity();
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let timerID;


// ************* DOM References *****************

const player = document.getElementById('player');
const cpu = document.getElementById('cpu');
const ball = document.getElementById('ball');
const startButton = document.getElementById('start-button');

// ***************** Main ***********************

startButton.addEventListener('click', startGame);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

function startGame() {
  timerID = setInterval(updateFrame, 17);
  startButton.textContent = 'Pause';
  startButton.removeEventListener('click', startGame);
  startButton.addEventListener('click', pauseGame);
}

function pauseGame() {
  clearInterval(timerID);
  startButton.removeEventListener('click', pauseGame);
  startButton.addEventListener('click', startGame);
  startButton.textContent = 'Start';
}

function getBallVelocity() {
  let ballDirection = Math.random() * 2 * Math.PI;
  while(!(ballDirection > 7 * Math.PI / 4 || ballDirection < Math.PI / 4 || ballDirection > 3 * Math.PI / 4 && ballDirection < 5 * Math.PI / 4)) {
    ballDirection = Math.random() * 2 * Math.PI;
  }
  return [Math.cos(ballDirection) * ballSpeed, Math.sin(ballDirection) * ballSpeed];
}

function ballTouchingPaddleSide(paddleXY) {
  if(yCoordinateMatch(paddleXY) && isTouchingLeftSide(paddleXY) || yCoordinateMatch(paddleXY) && isTouchingRightSide(paddleXY)) {
    return true;
  } else {
    return false;
  }
}

function isTouchingRightSide(paddleXY) {
  return ballXY[0] > paddleXY[0] + PADDLEWIDTH - ballSpeed / 2 && ballXY[0] < paddleXY[0] + PADDLEWIDTH + ballSpeed / 2 && ballVelocity[0] < 0;
}

function isTouchingLeftSide(paddleXY) {
  return ballXY[0] + BALLDIAMETER < paddleXY[0] + ballSpeed / 2 && ballXY[0] + BALLDIAMETER > paddleXY[0] - ballSpeed / 2 && ballVelocity[0] > 0;
}


function yCoordinateMatch(paddleCoordinates) {
  return ballXY[1] < paddleCoordinates[1] + PADDLEHEIGHT && ballXY[1] + BALLDIAMETER > paddleCoordinates[1];
}

function touchingPaddleEnd(paddleXY) {
  if(xCoordinateMatch(paddleXY) && isHittingTopSide(paddleXY) || xCoordinateMatch(paddleXY) && isHittingBottomSide(paddleXY)) {
    return true;
  } else {
    return false;
  }
}

function isHittingBottomSide(paddleXY) {
  return ballXY[1] > paddleXY[1] + PADDLEHEIGHT - ballSpeed / 2 && ballXY[1] < paddleXY[1] + PADDLEHEIGHT + ballSpeed / 2 && ballVelocity[1] < 0;
}

function isHittingTopSide(paddleXY) {
  return ballXY[1] + BALLDIAMETER < paddleXY[1] + ballSpeed / 2 && ballXY[1] + BALLDIAMETER > paddleXY[1] - ballSpeed / 2 && ballVelocity[1] > 0;
}

function xCoordinateMatch(paddleCoordinates) {
  return ballXY[0] < paddleCoordinates[0] + PADDLEWIDTH && ballXY[0] + BALLDIAMETER > paddleCoordinates[0];
}

function checkBallObstacles() {
  if(ballXY[0] < 1 || ballXY[0] + BALLDIAMETER > 960 || ballTouchingPaddleSide(cpuXY) || ballTouchingPaddleSide(playerXY)) {
    ballVelocity[0] = ballVelocity[0] * -1;
  }
  if(ballXY[1] < 1 || ballXY[1] + BALLDIAMETER > 480 || touchingPaddleEnd(cpuXY) || touchingPaddleEnd(playerXY)) {
    ballVelocity[1] = ballVelocity[1] * -1;
  }
}

function moveBall() {
  ballXY[0] += ballVelocity[0];
  ballXY[1] += ballVelocity[1];
  ball.style.left = `${ballXY[0]}px`;
  ball.style.top = `${ballXY[1]}px`;
}

function updateBallPosition() {
  checkBallObstacles();
  moveBall();
}

function updatePaddlePositions() {
  movePlayer();
  moveCPU();
}

function moveCPU() {
  if(ballXY[1] + BALLDIAMETER / 2 < cpuXY[1] + PADDLEHEIGHT / 2 && cpuXY[1] >= 2) {
    cpuXY[1] -= ballSpeed / 2;
    cpu.style.top = `${Math.floor(cpuXY[1])}px`;
  } else if(ballXY[1] + BALLDIAMETER / 2 > cpuXY[1] + PADDLEHEIGHT / 2 && cpuXY[1] <= 478 - PADDLEHEIGHT) {
    cpuXY[1] += ballSpeed / 2;
    cpu.style.top = `${Math.floor(cpuXY[1])}px`;
  }
}

function movePlayer() {
  // if(leftPressed) {
  //   playerXY[0] -= ballSpeed / 2;
  // }
  // if(rightPressed) {
  //   playerXY[0] += ballSpeed / 2;
  // }
  if(upPressed && playerXY[1] >= 2) {
    playerXY[1] -= ballSpeed / 2;
  }
  if(downPressed && playerXY[1] <= 478 - PADDLEHEIGHT) {
    playerXY[1] += ballSpeed / 2;
  }
  player.style.left = `${playerXY[0]}px`;
  player.style.top = `${playerXY[1]}px`;
}

function keyDown(e) {
  if(e.keyCode === 37) {
    leftPressed = true;
  } else if (e.keyCode === 38) {
    upPressed = true;
  } else if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 40) {
    downPressed = true;
  }
}

function keyUp(e) {
  if(e.keyCode === 37) {
    leftPressed = false;
  } else if (e.keyCode === 38) {
    upPressed = false;
  } else if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 40) {
    downPressed = false;
  }
}

function updateFrame() {
  updateBallPosition();
  updatePaddlePositions();
}
