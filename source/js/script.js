let button = document.querySelector('.main-navigation__button');
let menu = document.querySelector('.main-navigation__list');

button.classList.remove('main-navigation__button--no-js');
menu.classList.remove('main-navigation__list--no-js');

button.addEventListener('click', function () {
  button.classList.toggle('main-navigation__button--close');
  menu.classList.toggle('main-navigation__list--closed');
})
