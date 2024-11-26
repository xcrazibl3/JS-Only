'use strict';
const btnsShowModal = document.querySelectorAll('.show-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnClose = document.querySelector('.close-modal');

const modalHide = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const modalShow = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

for (let i = 0; i < btnsShowModal.length; i++) {
  btnsShowModal[i].addEventListener('click', modalShow);
}

btnClose.addEventListener('click', modalHide);

overlay.addEventListener('click', modalHide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    modalHide();
  }
});
