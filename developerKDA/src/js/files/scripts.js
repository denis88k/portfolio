const btn = document.querySelector('.menu__btn');
const navLinks = document.querySelector('.nav-links');
const navItem = document.querySelectorAll('.nav__item');
const navLink = document.querySelectorAll('.nav__link');
const main = document.querySelector('.main');


btn.addEventListener('click', () => {
   btn.classList.toggle('menu__btn-active');
   navLinks.classList.toggle('nav-links-active');
   document.body.classList.toggle('lock');
   navLink.forEach((e) => {
      e.classList.remove('nav__link-active');
   });
   main.classList.toggle('main-bg');
});

navItem.forEach((item) => {

   item.addEventListener('click', (e) => {
      e.preventDefault();
      const eTarget = e.target;
      if (eTarget.classList.contains('nav__link-active')) {
         eTarget.classList.remove('nav__link-active');
      } else {
         navLink.forEach((e) => {
            e.classList.remove('nav__link-active');
         });
         eTarget.classList.add('nav__link-active')
      }
   })
})

main.addEventListener('click', () => {
   navLink.forEach((e) => {
      e.classList.remove('nav__link-active');
   });
   document.body.classList.remove('lock');
   btn.classList.remove('menu__btn-active');
   navLinks.classList.remove('nav-links-active');
   main.classList.remove('main-bg');
});

//slider
let swiper = new Swiper('.swiper', {
   slidesPerView: "auto",
   centeredSlides: true,
   loop: true,
   autoplay: {
      delay: 5000,
   },
   pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
   },
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   },
});

const pagBul = document.querySelector('.swiper-pagination');

const observer = new MutationObserver(pagination)

function pagination() {
   const pagBuls = document.querySelectorAll('.swiper-pagination-bullet');
   console.log('tcnm');
   if (pagBuls[0].classList.contains('swiper-pagination-bullet-active')) {
      pagBuls.forEach((e) => {
         e.classList.remove('pag-bullet-blue');
         e.classList.remove('pag-bullet-purple');
      });
      for (let i = 1; i < (pagBuls.length); i++) {
         pagBuls[i].classList.add('pag-bullet-green');
      };
   };
   if (pagBuls[1].classList.contains('swiper-pagination-bullet-active')) {
      pagBuls.forEach((e) => {
         e.classList.remove('pag-bullet-green');
         e.classList.remove('pag-bullet-purple');
      });
      pagBuls[0].classList.add('pag-bullet-blue');
      pagBuls[2].classList.add('pag-bullet-blue');
   };
   if (pagBuls[2].classList.contains('swiper-pagination-bullet-active')) {
      pagBuls.forEach((e) => {
         e.classList.remove('pag-bullet-green');
         e.classList.remove('pag-bullet-blue');
      });
      for (let i = 0; i < (pagBuls.length - 1); i++) {
         pagBuls[i].classList.add('pag-bullet-purple');
      };
   };
};

observer.observe(pagBul, {
   attributes: true,
   characterData: true
});

//inputMask
const form = document.querySelector('.form__request');
const telSelector = form.querySelector('input[type="tel"]');
const inputMask = new Inputmask('+7 (999) 999-99-99');
inputMask.mask(telSelector);

const validation = new JustValidate('.form');

validation
   .addField('.input-name', [
      {
         rule: 'minLength',
         value: 3,
      },
      {
         rule: 'maxLength',
         value: 30,
      },
      {
         rule: 'required',
         value: true,
         errorMessage: 'Введите имя!'
      }
   ])
   .addField('.input-tel', [
      {
         rule: 'required',
         value: true,
         errorMessage: 'Телефон обязателен!',
      },
      {
         rule: 'function',
         validator: function () {
            const phone = telSelector.inputmask.unmaskedvalue();
            return phone.length === 10;
         },
         errorMessage: 'Введите корректный телефон',
      },
   ])
   .onSuccess((event) => {
      console.log('Validation passes and form submitted', event);

      event.target.reset();
   });


