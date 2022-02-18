var window_start = document.querySelector('.window-start');
var btn_start_game = document.querySelector('.btn-start-game');
var btn_start_new = document.querySelector('.btn-start-new');
var game = document.querySelector('.window-game');
var currentPlayer = document.getElementById('curPlyr');
var field = document.querySelector('.field');

var modal = document.querySelector('.modal');
var modalWndw = document.querySelector('.modalWind');
var btnReset = document.querySelector('.btn-reset');

var gamers = ['X', 'O'];
var gamerNum = 0;

var stat = {
   'X': 0,
   'O': 0
}
btn_start_game.addEventListener('click', () => {
   var numbCells = document.querySelector('.numbCells-start').value;
   startGame(numbCells)
   let tl = gsap.timeline();
   tl.to(window_start, { y: '-100vh', duration: 1 });
   tl.to(game, { y: '-100vh', duration: 1 }, "-=0.7");
});
btn_start_new.addEventListener('click', () => {
   var numbCells = document.querySelector('.numbCells').value;
   startGame(numbCells)
});
function startGame(numbCells) {
   resetField();
   var rows = fillField(numbCells);
   var cols = getColumns(rows);
   var diag1 = getFirstDiags(rows);
   var diag2 = getSecondDiags(rows);
   var lines = rows.concat(cols, diag1, diag2);

   // постройка поля
   function fillField(numbCells) {
      var rows = [];
      for (var i = 0; i < numbCells; i++) {
         // var tr = document.createElement('tr');
         var row = document.createElement('div');
         row.className = "row";
         rows[i] = [];

         for (var j = 0; j < numbCells; j++) {
            // var td = document.createElement('td');
            var col = document.createElement('div');
            col.className = "col";
            row.appendChild(col);

            col.addEventListener('click', cellClickHandler);
            rows[i][j] = col;
         }
         field.appendChild(row);
      }
      return rows;
   }
   //проверка поля
   function checkWin(gamer, lines) {
      for (var i = 0; i < lines.length; i++) {
         for (var j = 4; j < lines[i].length; j++) {
            if (
               lines[i][j - 4].innerHTML == gamer &&
               lines[i][j - 3].innerHTML == gamer &&
               lines[i][j - 2].innerHTML == gamer &&
               lines[i][j - 1].innerHTML == gamer &&
               lines[i][j].innerHTML == gamer
            ) {
               return true;
            }
         }
      }
      return false;
   }
   //обработка нажатия на ячейку
   function cellClickHandler() {
      // this.classList.add(gamers[gamerNum]);
      this.innerHTML = gamers[gamerNum];
      this.removeEventListener('click', cellClickHandler);

      isWin(gamers, lines);

      gamerNum++;
      if (gamerNum == gamers.length) {
         gamerNum = 0;
      }
      currentPlayer.innerHTML = gamers[gamerNum];
   }
   //проверка столбцов и вертикалей
   function getColumns(arr) {
      var result = [];
      for (var i = 0; i < arr.length; i++) {
         for (var j = 0; j < arr[i].length; j++) {
            if (result[j] === undefined) {
               result[j] = [];
            }
            result[j][i] = arr[i][j];
         }
      }
      return result;
   }
   function getFirstDiags(arr) {
      var result = [];

      for (var i = 0; i < arr.length; i++) {
         for (var j = 0; j < arr[i].length; j++) {
            if (result[i + j] === undefined) {
               result[i + j] = [];
            }
            result[i + j].push(arr[i][j]);
         }
      }
      return result;
   }
   function getSecondDiags(arr) {
      return getFirstDiags(reverseSubArrs(arr));
   }
   function reverseSubArrs(arr) {
      var result = [];

      for (var i = 0; i < arr.length; i++) {
         for (var j = arr[i].length - 1; j >= 0; j--) {
            if (result[i] === undefined) {
               result[i] = [];
            }
            result[i].push(arr[i][j]);
         }
      }
      return result;
   }
   //кто выиграл
   function isWin(gamers, lines) {
      for (var i = 0; i < gamers.length; i++) {
         if (checkWin(gamers[i], lines)) {
            stat[gamers[i]] += 1;
            endGame(gamers[i]);
            break;
         }
      }
   }
   //конец игры
   function endGame(gamer) {
      if (gamer == 'X') {
         gamer = 'Крестик';
      } else gamer = 'Нолик';
      modalWindow(gamer);
      document.getElementById('sX').innerHTML = stat.X;
      document.getElementById('sO').innerHTML = stat.O;
   }
   //модальное окно с надписью победившего
   function modalWindow(gamer) {
      modal.classList.add('active');
      modalWndw.innerHTML = "Победил " + gamer;
      modal.addEventListener('click', function () {
         modal.classList.remove('active');
         reset();
      })
   }
   //сброс поля от Х и 0, и добавление прослушки
   function reset() {
      var cells = field.querySelectorAll('.col');
      for (var i = 0; i < cells.length; i++) {
         cells[i].innerHTML = '';
         cells[i].addEventListener('click', cellClickHandler);
      }
   }
   //кнопка очистки поля от Х и 0
   btnReset.onclick = function () {
      reset();
   }
};
// кнопка удаления ячеек
function resetField() {
   field.innerHTML = '';
}