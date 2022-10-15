const btn = document.querySelector('.menu__btn');
const menu = document.querySelector('.menu');

btn.addEventListener('click', () => {
	btn.classList.toggle('menu__btn-active');
	menu.classList.toggle('menu-active');
	document.body.classList.toggle('lock');
	main.classList.toggle('main-header');
	header.classList.toggle('bg-b-header');
	headerInner.classList.toggle('header-menu');
	menuItem.forEach((e) =>
		e.classList.remove('menu__item-active')
	);
	subMenu.forEach((e) => {
		e.classList.remove('sub-menu-active')
	});
});

const menuItem = document.querySelectorAll('.menu__item');
const header = document.querySelector('.header');
const headerInner = document.querySelector('.header__inner');
const subMenu = document.querySelectorAll('.sub-menu__body');
const main = document.querySelector('.main');

menuItem.forEach((item) =>

	item.addEventListener('click', (e) => {
		if (e.target.parentNode === item) {
			e.preventDefault();
			menuItem.forEach((e) =>
				e.classList.remove('menu__item-active')
			);
			subMenu.forEach((e) => {
				e.classList.remove('sub-menu-active')
			});
			if (!(e.target.classList.contains('text'))) return;
			const NextsubMenu = e.target.nextElementSibling;
			if (NextsubMenu.classList.contains('sub-menu__body')) {
				// console.log(NextsubMenu)
				item.classList.add('menu__item-active');
				NextsubMenu.classList.add('sub-menu-active');
				header.classList.add('bg-b-header');
				headerInner.classList.add('header-menu');
				document.body.classList.add('lock');
				main.classList.add('main-header')
			} else return;
		};
	})
);
main.addEventListener('click', (e) => {
	// e.preventDefault();
	menuItem.forEach((e) => {
		e.classList.remove('menu__item-active')
	});
	subMenu.forEach((e) => {
		e.classList.remove('sub-menu-active')
	});
	header.classList.remove('bg-b-header');
	headerInner.classList.remove('header-menu');
	document.body.classList.remove('lock');
	main.classList.remove('main-header')
	btn.classList.remove('menu__btn-active');
	menu.classList.remove('menu-active');
});


//slider
let swiper = new Swiper('.swiper', {
	slidesPerView: "auto",
	centeredSlides: true,
	spaceBetween: 20,
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

const accordionItemTitle = document.querySelectorAll('.accordion-item__title');
const accordionItem = document.querySelectorAll('.accordion-item');

accordionItemTitle.forEach((item) => {
	item.addEventListener('click', () => {
		const parent = item.parentNode;
		if (parent.classList.contains('accordion-item-active')) {
			parent.classList.remove('accordion-item-active');
		} else {
			accordionItem.forEach((e) => {
				e.classList.remove('accordion-item-active');
			});
			parent.classList.add('accordion-item-active');
		}
	})
})

//inputMask
const form = document.querySelector('.form');
const telSelector = form.querySelector('input[type="tel"]');
const inputMask = new Inputmask('+7 (999) 999-99-99');
inputMask.mask(telSelector);

const validation = new JustValidate('.form');

validation
	.addField('.input-email', [
		{
			rule: 'required',
			value: true,
			errorMessage: 'Email обязателен',
		},
		{
			rule: 'email',
			value: true,
			errorMessage: 'Введите корректный Email',
		},
	])
	.addField('.input-tel', [
		{
			rule: 'required',
			value: true,
			errorMessage: 'Телефон обязателен',
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

const formBtn = document.querySelector('.form__item-btn');
formBtn.addEventListener('click', () => {
	if (document.querySelector('.just-validate-error-label')) {
		document.querySelector('.form__list').classList.toggle('error');
	}
})