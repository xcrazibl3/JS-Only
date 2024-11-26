'use strict';

let secretNumber = secretNumGen();
const message = document.querySelector('.message');
const body = document.body;
const highscore = document.querySelector('.highscore');
const score = document.querySelector('.score');
let curScore = Number(score.textContent);
const numberShow = document.querySelector('.number');
const againBtn = document.querySelector('.again');

const reset = function () {
  secretNumber = secretNumGen();
  body.style.background = '#222';
  message.textContent = 'Start guessing...';
  score.textContent = 20;
  curScore = Number(score.textContent);
  numberShow.textContent = '?';
  document.querySelector('.guess').value = '';
};

const scoreCheck = function () {
  if (curScore <= 0) {
    message.textContent = '💥You lost the game!';
    setTimeout(reset, 1500);
    numberShow.textContent = '💥';
  }
};

const scoreDecrease = function () {
  curScore--;
  score.textContent = curScore;
};

function secretNumGen() {
  return Math.floor(Math.random() * 20 + 1);
}

const displayMessage = function (target, message) {
  target.textContent = message;
};

document.querySelector('.check').addEventListener('click', function () {
  let guessNumber = Number(document.querySelector('.guess').value);
  console.log(guessNumber);
  if (curScore >= 1) {
    if (!guessNumber || guessNumber < 0 || guessNumber > 20) {
      displayMessage(message, '⛔Not a correct number!');
    } else if (guessNumber === secretNumber) {
      body.style.background = '#60b347';
      displayMessage(highscore, curScore);
      displayMessage(message, '🎉Correct answer!');
      displayMessage(numberShow, secretNumber);
      setTimeout(reset, 1500);
    } else {
      scoreDecrease();
      if (guessNumber < secretNumber) {
        displayMessage(message, '⬆️ Your guess is too low!');
        scoreCheck();
      } else if (guessNumber > secretNumber) {
        displayMessage(message, '⬇️ Your guess it too high!');
        scoreCheck();
      }
    }
  }
});

againBtn.addEventListener('click', reset);
