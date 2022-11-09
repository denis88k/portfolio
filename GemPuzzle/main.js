//размер поля
let sizeFrame = 4;
let countMove = 0;
let timeInterval;
let arrGameBestResult = JSON.parse(localStorage.getItem('gameBestResult'));
const body = document.querySelector('body');

//создаём разметку
body.insertAdjacentHTML('afterbegin', `
  <div class="wrapper">
    <div class="container">
      <h1>Игра в 'Пятнашки'</h1>
        <div class="btns flex-center">
          <button class="btn btn__restart">Перезапуск</button>
          <button class="btn btn__save">Сохранить</button>
          <button class="btn btn__results">Результаты</button>
        </div>
        <div class="status flex-center ">
          <div class="status__move">Move: <span class="move">0</span></div>
          <div class="status__time">Time: <span class="time">00:00:00</span></div>
        </div>
        <div class="field"></div>
        <div class="size-text flex-center">Frame size: <span class="size"> ${sizeFrame} x ${sizeFrame}</span></div>
        <div class="size-other">
          <p class="size-other-text">Выбери размер поля:</p>
        <div class="size-other-list flex-center"></div>
      </div>
    </div>
  </div>
`);

// функция создания массива перемешанного
function getShuffled(sizeFrame) {
  let unshuffled = [];
  for (let i = 1; i < sizeFrame * sizeFrame + 1; i++) {
    unshuffled.push(i);
  }
  // умное перемешивание
  function shuffle(){
    // определить индекс последней пустой плитки
    // определять на какую соседнюю плитку можно переместиться
    let tilesEmptyIndex;
    let tilesEmpty;
    let tilesCoordEmpty = {};
    unshuffled.forEach((el, index)=>{
      if(el === sizeFrame * sizeFrame){
        tilesEmptyIndex = index;
        tilesEmpty = el;
        tilesCoordEmpty.x = tilesEmptyIndex % sizeFrame + 1;
        tilesCoordEmpty.y = Math.floor(tilesEmptyIndex / sizeFrame + 1);
      }
    });

    // массив перемещаемых плиток
    let tilesMoveArr = [];
    // записываем в этот массив данные по перемещаемым плиткам
    unshuffled.forEach((el, index)=>{
      if(el !== sizeFrame * sizeFrame){
        // переменные перемещаемой плитки
        const tilesTargetIndex = index;
        const tilesTarget = el;
        const tilesTargetCoord = {};
        // находим координаты перемещаемой плитки
        tilesTargetCoord.x = tilesTargetIndex % sizeFrame + 1;
        tilesTargetCoord.y = Math.floor(tilesTargetIndex / sizeFrame + 1);
        const diffCoordX = tilesCoordEmpty.x - tilesTargetCoord.x;
        const diffCoordY = tilesCoordEmpty.y - tilesTargetCoord.y;
        // проверка на перемещаемость
        const isValid = (Math.abs(diffCoordX) === 1 || Math.abs(diffCoordY) === 1) && (tilesCoordEmpty.x === tilesTargetCoord.x || tilesCoordEmpty.y === tilesTargetCoord.y);

        if (isValid) {
          tilesMoveArr.push([tilesTargetIndex, tilesTarget]);
          // 0-индекс плитки, 1-значение плитки
        }
      }
    });
    // определяем maxIndex массива плиток, которые могут поменяться местами с пустой плиткой
    const tilesMoveLength = tilesMoveArr.length-1;

    function randomIndexTiles(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // определяем рандомно индекс плитки, которую переместим
    const tilesIndexRandom = randomIndexTiles(0, tilesMoveLength);
    const tilesRandomIndex = tilesMoveArr[tilesIndexRandom][0];
    const tilesRandom = tilesMoveArr[tilesIndexRandom][1];
    
    unshuffled[tilesEmptyIndex] = tilesRandom;
    unshuffled[tilesRandomIndex] = tilesEmpty;
    
    return unshuffled;
  }

  // console.log(unshuffled, 'до норм')
  for(let i = 0; i < 1000; i++){
    unshuffled = shuffle();
  }
  // console.log(unshuffled, 'после норм')

  // проверка на решаемость комбинации
  function isSolutions() {
    let countSolution = 0;
    // подсчитываем сколько элементов больше i
    for (let i = 0; i < unshuffled.length; i++) {
      if (unshuffled[i] != sizeFrame * sizeFrame) {
        for (let j = i + 1; j < unshuffled.length; j++) {
          if (unshuffled[j] != sizeFrame * sizeFrame) {
            if (unshuffled[i] > unshuffled[j]) {
              countSolution++;
            }
          }
        }
      } else {
        countSolution = countSolution + Math.floor(i / sizeFrame + 1);
      };
    };

    // проверяем если число не чётное, то рекурсивно вызываем функцию, 
    // которая снова перемешает массив и так же проверит на чётность
    if ((countSolution % 2)) {
      // console.log(unshuffled, countSolution + ' не решаема')
      shuffle();
      return isSolutions(unshuffled);
    } else {
      // console.log(unshuffled, countSolution + ' решаема')
      return unshuffled;
    };
  }

  return isSolutions();
};


// массив перемешанный, к которому будем обращаться и менять значение
let arrShuffled = getShuffled(sizeFrame);
const field = document.querySelector('.field');

// ====проверка есть ли сохранённая игра в localStorage====
// вытаскиваем данные из localStorage, если игру сохранили и эти данные покажутся после загрузки страницы
let localStorageShuffled = JSON.parse(localStorage.getItem('gameInterval'));
if (localStorageShuffled) {
  arrShuffled = localStorageShuffled['arrShuffled'];
  countMove = localStorageShuffled['move'];
  sizeFrame = localStorageShuffled['sizeFrame'];
};

// инициализация
init(sizeFrame, arrShuffled, field, countMove);
field.addEventListener('click', fieldListener.bind(null, field));

function init(sizeFrame, arrShuffled, field, countMove) {
  shuffleField(sizeFrame, arrShuffled, field, countMove);
  timeGame();
  sizeFrameOther();
  sizeChanges();
};

// ====кнопки====
// ===перезапуск игры===
document.querySelector('.btn__restart').addEventListener('click', restartGame);

function restartGame() {
  // удалить данные по промежуточной игре
  localStorage.removeItem('gameInterval');
  // формируем новый массив расположения плиток
  arrShuffled = getShuffled(sizeFrame);
  // обнуляем шаги
  countMove = 0;
  shuffleField(sizeFrame, arrShuffled, field, countMove);
  timeGame();
};


// ====создание поля из перемешанного массива====
function shuffleField(sizeFrame, arrShuffled, field, countMove) {
  moveCount(countMove);
  // если плитки уже существуют, то старые удаляем
  if (document.querySelectorAll('.tiles').length) {
    field.removeEventListener('click', fieldListener);
    document.querySelectorAll('.tiles').forEach(el => el.remove());
  };

  // создаём поле с плитками
  for (let i = 0; i < arrShuffled.length; i++) {
    field.insertAdjacentHTML('beforeend', `
      <div class="tiles" data-numb="${arrShuffled[i]}">
        <span>${arrShuffled[i]}</span>
      </div>
    `);
  };
  // задаём размер плиткам
  tilesSize(sizeFrame, arrShuffled, field);
};

// ====размер плиток====
function tilesSize(sizeFrame, arrShuffled, field) {
  // получаем размер поля
  const fieldWidth = (field.getBoundingClientRect().width) / sizeFrame;
  // плитки
  const tiles = document.querySelectorAll('.tiles');
  // задаём размер плиткам
  tiles.forEach(el => {
    el.style.cssText = `
      width: ${fieldWidth}px;
      height: ${fieldWidth}px;
    `;

    if (+el.dataset.numb === arrShuffled.length) {
      el.classList.add('last');
    };

  });
};

// ===создание кнопок выбора размера поля===
function sizeFrameOther() {
  // создаём кнопки размера поля плиток
  for (let i = 3; i < 9; i++) {
    document.querySelector('.size-other-list')
      .insertAdjacentHTML('beforeend', `
        <span class="size-change" data-size="${i}">${i}x${i}</span>
      `);
  };
};

// ===кнопки выбора размера поля===
function sizeChanges() {
  const sizeChange = document.querySelectorAll('.size-change');
  sizeChange.forEach(el => {
    // ставим активный класс для кнопки размера поля
    +el.dataset.size === sizeFrame && el.classList.add('size-active');
    // слушаем кнопки, при нажатии вызываем:
    // shuffled: удаляет плитки, генерирует новые,
    // а внутри shuffled вызывается:
    // tilesSize: задаёт размер плиткам
    el.addEventListener('click', () => {
      //удаляем все активные классы
      sizeChange.forEach(el => {
        el.classList.remove('size-active');
      });
      // назначаем активный класс
      el.classList.add('size-active');
      // переназначаем размер поля
      sizeFrame = +el.dataset.size;
      // вставляем размер поля
      document.querySelector('.size').innerHTML = ` ${sizeFrame} x ${sizeFrame}`;
      // перезапуск
      restartGame(sizeFrame, arrShuffled, field, countMove);
    });
  });
};


// ===следить за изменением ширины экрана===
window.addEventListener('resize', () => {
  // const field = document.querySelector('.field');
  tilesSize(sizeFrame, arrShuffled, field);
});


// =======перемещение плиток=======
// ===нажатие на плитки, которые рядом с пустой===
function fieldListener(field, e) {
  field.addEventListener('transitionend', countMoveListener);
  const tiles = document.querySelectorAll('.tiles');
  let eTarget = e.target.closest('.tiles');
  if (eTarget) {
    // ==пустая(sizeFrame**2) плитка
    // находим её индекс в массиве по классу
    const tilesEmptyIndex = Array.from(tiles).findIndex(el => el.closest('.last'));
    const tilesEmpty = tiles[tilesEmptyIndex];
    const tilesCoordEmpty = {};
    // находим её координаты:
    // х - номер столбеца; y - номер строки
    tilesCoordEmpty.x = tilesEmptyIndex % sizeFrame + 1;
    tilesCoordEmpty.y = Math.floor(tilesEmptyIndex / sizeFrame + 1);

    const tilesClickIndex = Array.from(tiles).findIndex(el => el === eTarget);
    const tilesClick = tiles[tilesClickIndex];
    const tilesCoordClick = {};
    tilesCoordClick.x = tilesClickIndex % sizeFrame + 1;
    tilesCoordClick.y = Math.floor(tilesClickIndex / sizeFrame + 1);

    const diffCoordX = tilesCoordEmpty.x - tilesCoordClick.x;
    const diffCoordY = tilesCoordEmpty.y - tilesCoordClick.y;

    const isValid = (Math.abs(diffCoordX) === 1 || Math.abs(diffCoordY) === 1) && (tilesCoordEmpty.x === tilesCoordClick.x || tilesCoordEmpty.y === tilesCoordClick.y);

    const tilesWidth = tilesClick.getBoundingClientRect().width;
    // ==перемещение элемента
    function moveTiles(tiles, diffCoordX, diffCoordY, end) {
      tiles.style.transform = end === 0 ? `translate(${diffCoordX * tilesWidth}px, ${diffCoordY * tilesWidth}px)` : '';
      tiles.style.transition = end === 0 ? 'transform .25s ease' : '0s';
    }

    if (isValid) {
      field.removeEventListener('click', fieldListener);

      moveTiles(tilesClick, diffCoordX, diffCoordY, 0);
      moveTiles(tilesEmpty, -diffCoordX, -diffCoordY, 0);

      // слушаем оконачение события перемещения плитки пустой
      tilesEmpty.addEventListener('transitionend', function tilesClickListener(e) {
        if (e.propertyName === 'transform') {
          arrShuffled[tilesEmptyIndex] = +tilesClick.dataset.numb;
          arrShuffled[tilesClickIndex] = +tilesEmpty.dataset.numb;
          // проверка выигрыша
          isWin(arrShuffled);
          return arrShuffled;
        };
      });

    };
  };
};

// ====слушаем изменения на поле, таргет которого падает на last плитку====
// field.addEventListener('transitionend', countMoveListener);

function countMoveListener(e) {
  if (e.target.closest('.last') && e.propertyName === 'transform') {
    countMove++;
    shuffleField(sizeFrame, arrShuffled, field, countMove);
    return;
  };
};

// ====счётчик шагов====
function moveCount(countMove) {
  const move = document.querySelector('.move');
  move.innerText = `${countMove}`;
};

// ====проверка выигрыша===
function isWin(arrShuffled) {
  if (arrShuffled.every((el, index) => el === index + 1)) {
    // получим время игры и засунем её в инсерт
    const timeWin = document.querySelector('.time');
    // получим кол-во ходов и так же в инсерт
    const countMovesWin = document.querySelector('.move');

    body.classList.add('lock');

    body.querySelector('.wrapper').insertAdjacentHTML("beforeend", `
      <div class="popUp popUp__win">
        <div class="popUp__inner">
            <p class="popUp__win-text">
              УРА!!!!🥳 Ты решил Пятнашки: <br>
              Время - ${timeWin.innerText} и Ходов - ${+countMovesWin.innerText + 1}
            </p>
        </div>
      </div>
    `);
    clearInterval(timeInterval);

    document.querySelector('.popUp').addEventListener('click', (e) => {
      e.target.remove();
      // лучший результата записываем в таблицу
      winLocalStorage(timeWin, countMovesWin);
      body.classList.remove('lock');
      restartGame();
    }, { once: true });
  } else {
    console.log('помни что не все комбинации выигрышные, я конечно же попытался сделать как написано в википедии по поводу решается эта сетка или нет, но хз короче, чёт бывает такое что не решается((')
  };
};

// ====таблица с результатами====
function winLocalStorage(timeWin, countMovesWin) {
  // данные массива
  timeWin = timeWin.innerText;
  countMovesWin = countMovesWin.innerText;
  const hourWin = timeWin.slice(0, 2);
  const minWin = timeWin.slice(3, 5);
  const secWin = timeWin.slice(-2);

  // если объект существует
  if (arrGameBestResult) {
    // запушили данные по результату игры
    arrGameBestResult.push({
      sizeFrame: sizeFrame,
      move: countMovesWin,
      time: `${hourWin}:${minWin}:${secWin}`
    });
    // отсортировали массив результатов
    arrGameBestResult.sort((a, b) => a.move - b.move);
    // если массив результатов больше 10<
    if (10 < arrGameBestResult.length) {
      arrGameBestResult.pop();
    }
  } else {
    arrGameBestResult = [];
    arrGameBestResult.push({
      sizeFrame: sizeFrame,
      move: countMovesWin,
      time: `${hourWin}:${minWin}:${secWin}`
    });
  }
  // запишем массив результатов localStorage
  localStorage.setItem('gameBestResult', JSON.stringify(arrGameBestResult));
}

// ===время игры===
function timeGame() {
  clearInterval(timeInterval);

  const time = document.querySelector('.time');
  const start = new Date();
  // сохранённое время
  let timeSave = 0;
  // если время существует
  if (localStorageShuffled) {
    const hourSave = +localStorageShuffled['hour'] * 60 * 60;
    const minSave = +localStorageShuffled['min'] * 60;
    const secSave = +localStorageShuffled['sec'];
    timeSave = timeSave + (hourSave + minSave + secSave) * 1000;
  }

  const timeCount = () => {
    let now = new Date();
    let leftUntil = now - start + timeSave;

    let hours = Math.floor(leftUntil / 1000 / 60 / 60) % 24;
    let minutes = Math.floor(leftUntil / 1000 / 60) % 60;
    let seconds = Math.floor(leftUntil / 1000) % 60;

    time.innerText = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  // запускаем секундомер, чтобы при загрузке показало 00:00:00
  timeCount();
  // а уже тут будет идти отчёт
  timeInterval = setInterval(timeCount, 1000);
};

// ====locaStorage====
// ====кнопка сохранения игры====
document.querySelector('.btn__save').addEventListener('click', SaveGame);

function SaveGame() {
  const gameInterval = {};
  // запоминаем массив расположения плиток
  gameInterval.arrShuffled = arrShuffled;
  // кол-во шагов
  const moveText = document.querySelector('.move').innerText;
  // закидываем в объект данных
  gameInterval.move = moveText;
  // размер поля
  gameInterval.sizeFrame = sizeFrame;
  // время: час, минута, секунда
  const time = document.querySelector('.time').innerText;
  const hour = time.slice(0, 2);
  const min = time.slice(3, 5);
  const sec = time.slice(-2);
  gameInterval.hour = hour;
  gameInterval.min = min;
  gameInterval.sec = sec;
  localStorage.setItem('gameInterval', JSON.stringify(gameInterval));
}

// ====показать результаты последних 10 лучших игр====
document.querySelector('.btn__results').addEventListener('click', showStatistic)

function showStatistic() {
  body.classList.add('lock');

  body.querySelector('.wrapper').insertAdjacentHTML("beforeend", `
    <div class="popUp popUp__result">
      <div class="popUp__inner">
        <div class="table-header row">
          <div class="table__numb cell">
            <p>№</p>
          </div>
          <div class="table__size-frame cell">
            <p>Размер поля</p>
          </div>
          <div class="table__count-move cell">
            <p>Число ходов</p>
          </div>
          <div class="table__time cell">
            <p>Время игры</p>
          </div>
        </div>
        <div class="table__content row">
        </div>
      </div>
    </div>
  `);

  const tableContent = document.querySelector('.table__content');

  if (arrGameBestResult) {
    for (let i = 0; i < arrGameBestResult.length; i++) {
      const sizeBest = arrGameBestResult[i].sizeFrame;
      const moveBest = arrGameBestResult[i].move;
      const timeBest = arrGameBestResult[i].time;
      tableContent.insertAdjacentHTML("beforeend", `
        <div class="table__content-row">
          <div class="table__numb cell">
            <p>${i + 1}</p>
          </div>
          <div class="table__size-frame cell">
            <p>${sizeBest}x${sizeBest}</p>
          </div>
          <div class="table__count-move cell">
            <p>${moveBest}</p>
          </div>
          <div class="table__time cell">
            <p>${timeBest}</p>
          </div>
        </div>
      `)
    }
  } else {
    tableContent.innerHTML = `<p>Лучших результатов ещё нет, но ты не расстаривайся! Дорогу осилит идущий!</p>`
  }

  document.querySelector('.popUp').addEventListener('click', (e) => {
    // удаляет popUp при нажатии вне области table
    if (e.target.classList.contains('popUp__result')) {
      e.target.closest('.popUp__result').remove();
      body.classList.remove('lock');
    }
  });
};
