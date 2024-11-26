'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const message = document.createElement('div');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const navLinks = document.querySelector('.nav__links');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const onHover = function (e) {
  if (!e.target.classList.contains('nav__link')) return;
  const siblings = navLinks.querySelectorAll('.nav__link');
  siblings.forEach((el) => {
    if (el !== e.target) {
      el.style.opacity = this + '';
    }
  });
};

//Modal Window

btnsOpenModal.forEach((btn) => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Cookies Message
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookies">Got it!</button>';
message.classList.add('cookie-message');
message.style.backgroundColor = '#37383d';
message.style.setProperty('width', '120%');
header.append(message);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
document
  .querySelector('.btn--close--cookies')
  .addEventListener('click', function () {
    message.remove();
  });

//Implementing Smooth Scrolling on the button

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Implementing Smooth Scrolling on the NAV
navLinks.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('btn--show-modal')) return;
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabs Component
// const tabBtns = document.querySelectorAll('operations__tab ');

tabContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab');
  //Guard Clause
  if (!clicked) return;
  //Reset active tab button
  document
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');
  //Active tab button
  clicked.classList.add('operations__tab--active');
  //Resset the active style on the content tab
  document
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');
  //Add active to the content tab of the selected button
  clicked.classList.contains('operations__tab');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Hover on the NAV
navLinks.addEventListener('mouseover', onHover.bind(0.5));

navLinks.addEventListener('mouseout', onHover.bind(1));

//Sticky NAV
const options = {
  root: null,
  rootMargin: `-${getComputedStyle(nav).height}`,
  threshold: 0,
};

const stickyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting === false) nav.classList.add('sticky');
  if (entry.isIntersecting === true) nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(stickyNav, options);
navObserver.observe(header);

//Make sections fade in

const sections = document.querySelectorAll('.section');
const sectionFadeIn = function (entries, observer) {
  const [entry] = entries;
  //guard clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionFadeIn, {
  root: null,
  threshold: 0.15,
});

sections.forEach((section) => {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//Lazy Image Loading
const lazyImgs = document.querySelectorAll('img[data-src]');
const lazyImgLoad = function (entries, observer) {
  const [entry] = entries;
  //guard clause
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyImgLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImgs.forEach((img) => {
  imgObserver.observe(img);
});

//Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
//Variables
let curSlide = 0;
const maxSlide = slides.length - 1;

//functions
const markActive = function (slide) {
  const dotsList = document.querySelectorAll('.dots__dot');
  dotsList.forEach((dot) => dot.classList.remove('dots__dot--active'));
  dotsList[slide].classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
  markActive(slide);
};

const slideInRight = function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
};

const slideInLeft = function () {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};

slides.forEach((s, i) => {
  const dot = `<button class="dots__dot" data-slide="${i}"></button>`;
  s.style.transform = `translateX(${100 * i}%)`;
  dotsContainer.insertAdjacentHTML('beforeend', dot);
});
goToSlide(0);

//Event Handlers

sliderBtnRight.addEventListener('click', slideInRight);

sliderBtnLeft.addEventListener('click', slideInLeft);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') slideInRight();
  if (e.key === 'ArrowLeft') slideInLeft();
});

dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const { slide } = e.target.dataset;
  goToSlide(slide);
});
