'use strict';

const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNewGame = document.querySelector('.btn--new');
const diceImg = document.querySelector('.dice');
const curScoreP1 = document.querySelector('#current--0');
const curScoreP2 = document.querySelector('#current--1');
const totalScoreP1 = document.querySelector('#score--0');
const totalScoreP2 = document.querySelector('#score--1');
const p1 = document.querySelector('.player--0');
const p2 = document.querySelector('.player--1');
const p1Name = document.querySelector('#name--0');
const p2Name = document.querySelector('#name--1');

const player1 = {
  name: 'Player 1',
  totalScore: Number(totalScoreP1.textContent),
  curScore: Number(curScoreP1.textContent),
};

const player2 = {
  name: 'Player 2',
  totalScore: Number(totalScoreP2.textContent),
  curScore: Number(curScoreP1.textContent),
};

let curPlayer = 0;

const roll = function () {
  return Math.floor(Math.random() * 6 + 1);
};

const switchPlayer = function () {
  curPlayer = curPlayer === 0 ? 1 : 0;
};

const p1Active = function () {
  p1.classList.add('player--active');
  p2.classList.remove('player--active');
};

const p2Active = function () {
  p1.classList.remove('player--active');
  p2.classList.add('player--active');
};

const assingScore = function (assign, value) {
  assign.textContent = value;
};

const resetGame = function () {
  curPlayer = 0;
  diceImg.classList.add('hidden');
  player1.curScore = 0;
  player1.totalScore = 0;
  player2.curScore = 0;
  player2.totalScore = 0;
  assingScore(curScoreP1, player1.curScore);
  assingScore(curScoreP2, player2.curScore);
  assingScore(totalScoreP1, player1.totalScore);
  assingScore(totalScoreP2, player2.totalScore);
  p1.classList.remove('player--winner');
  p2.classList.remove('player--winner');
  p1Active();
};
resetGame();

btnRoll.addEventListener('click', function () {
  diceImg.classList.remove('hidden');
  const dice = roll();
  diceImg.src = `dice-${dice}.png`;
  if (dice !== 1) {
    if (curPlayer === 0) {
      player1.curScore += dice;
      assingScore(curScoreP1, player1.curScore);
    } else {
      player2.curScore += dice;
      assingScore(curScoreP2, player2.curScore);
    }
  }
  if (dice === 1) {
    if (curPlayer === 0) {
      player1.curScore = 0;
      assingScore(curScoreP1, player1.curScore);
      p2Active();
      switchPlayer();
    } else {
      player2.curScore = 0;
      assingScore(curScoreP2, player2.curScore);
      p1Active();
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (curPlayer === 0) {
    p2Active();
    player1.totalScore += player1.curScore;
    assingScore(totalScoreP1, player1.totalScore);
    if (player1.totalScore >= 100) {
      p1.classList.add('player--winner');
    } else {
      player1.curScore = 0;
      assingScore(curScoreP1, player1.curScore);
      switchPlayer();
    }
  } else {
    p1Active();
    player2.totalScore += player2.curScore;
    assingScore(totalScoreP2, player2.totalScore);
    if (player2.totalScore >= 100) {
      p2.classList.add('player--winner');
    } else {
      player2.curScore = 0;
      assingScore(curScoreP2, player2.curScore);
      switchPlayer();
    }
  }
});

btnNewGame.addEventListener('click', resetGame);
