//inputMask
const forms = document.querySelectorAll('.form');
const inputMask = new Inputmask('+7 (999) 999-99-99');

forms.forEach(form => {

	const telSelector = form.querySelector('.input__tel');
	inputMask.mask(telSelector);

	const validation = new JustValidate(form);

	validation
		.addField('.input__tel', [
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
				errorMessage: 'Введите корректный телефон!',
			},
		])
		.addField('.input__email', [
			{
				rule: 'required',
				value: true,
				errorMessage: 'Email обязателен!',
			},
			{
				rule: 'email',
				value: true,
				errorMessage: 'Введите корректный Email!',
			},
		])
		.addField('.input__name', [
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
		.onSuccess((event) => {
			console.log('Validation passes and form submitted', event);
			event.target.reset();
		});
});

//Popup
const videoLink = document.querySelector('.video__link');
const videoPopup = document.querySelector('.video__popup');
const popupContent = document.querySelector('.popup__content');
const video = document.getElementById('video');

videoLink.addEventListener('click', () => {
	videoPopup.classList.add('active');
	document.body.classList.add('lock');
});

function onYouTubePlayerAPIReady() {
	player = new YT.Player('video', {
		events: { 'onPause': onPlayerPause }
	});
};
function onPlayerPause(event) {
	player.pauseVideo();
};

videoPopup.addEventListener('click', (e) => {
	if (!e.target.closest('.popup__content')) {
		videoPopup.classList.remove('active');
		document.body.classList.remove('lock');
		onPlayerPause();
	};
});

// 7-shop
const slid1 = document.querySelectorAll('.swiper1');
const slid2 = document.querySelectorAll('.swiper2');

slid1.forEach((el) => {
	let swiper = new Swiper(el, {
		loop: true,
		spaceBetween: 30,
		swipe: false,
		allowTouchMove: false,
		navigation: {
			nextEl: '.swiper-button-next1',
			prevEl: '.swiper-button-prev1',
		},
	});
});
slid2.forEach((el) => {
	let swiper = new Swiper(el, {
		loop: true,
		spaceBetween: 30,
		swipe: false,
		allowTouchMove: false,
		navigation: {
			nextEl: '.swiper-button-next2',
			prevEl: '.swiper-button-prev2',
		},
	});
});

const shopItem = document.querySelectorAll('.shop__item');
const swiperImg = document.querySelectorAll('.swiper-img');

shopItem.forEach((item, index) => {
	item.addEventListener('click', (e) => {
		e.preventDefault();
		if (e.target.classList.contains('shop__item-title')) {
			shopItem.forEach(e => {
				e.classList.remove('shop__item-active');
			});
			swiperImg.forEach(e => {
				e.classList.remove('swiper-img-active');
			});
			item.classList.add('shop__item-active');
			swiperImg[index].classList.add('swiper-img-active');
		};
	});
});


//calculator
const calcLists = document.querySelector('.calc__lists');
const ranges = document.querySelectorAll('.range__input');

ranges.forEach((range) => {
	progressbar(range);
});

function progressbar(range) {
	const rangeMin = range.getAttribute('min');
	const rangeMax = range.getAttribute('max');
	const rangeProgres = range.nextElementSibling;
	if (rangeProgres.classList.contains('range__progressbar')) {
		rangeProgres.style.width = (((range.value - rangeMin) * 100) / (rangeMax - rangeMin)) + "%";
	};
};

function calcResult() {
	const result = (ranges[0].value * 6000 + ranges[1].value * 100 + ranges[2].value * 1000) * 0.35 * ranges[3].value;
	const resultCalcs = document.querySelectorAll('.result-calc');
	resultCalcs.forEach((calc) => {
		calc.innerHTML = result.toLocaleString();
	})
};

calcResult();

calcLists.addEventListener('input', (event) => {
	progressbar(event.target);
	calcResult();
});