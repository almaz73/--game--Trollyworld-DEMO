new Vue({
   el: '#gameDiv',
   methods: {
      /**
       * Метод перемещения фигур. дополнительно обрабатывает какую фигуру двигать, заперащть двигать, если в ловушке,
       * движение прыжки через несколько точек, проверка условия дошли ли до конца, проверка условия, передать ли ход
       *
       * @param obj {string} "computer"||"player"
       * @param where {number} в какую точку нужно переместиться
       * @param jamp {boolean} если нужно передвигаться через несколько точек сразу
       * @param transition {boolean} передать ли ход другому игроку. Это нужно потому что приходится двигаться самому
       * несколько раз
       */
      autoStep: function (obj, where, jamp, transition) {
         if (where < 1) return;
         if (where > 48) where = 48;
         let pathEl = undefined;
         let step = (obj === "player") ? this.stepP : this.stepC;
         step = (step > where) ? step - 1 : step + 1;
         if (jamp) {
            pathEl = this.pathArr[where - 1];
            step = where
         }

         pathEl = (jamp) ? pathEl : this.pathArr[step - 1];
         (obj === "player") ? this.stepP = step : this.stepC = step;

         if (obj === "player") {
            if ((this.waiterP && this.defaultBone > 3) || !this.waiterP) {
               this.wPlayer = (pathEl.x - 65) + "px";
               this.hPlayer = (pathEl.y - 120) + "px";
               this.waiterP = false;
            } else {
               step = where
            }
         } else {
            if ((this.waiterС && this.defaultBone > 3) || !this.waiterС) {
               this.wComp = (pathEl.x - 50) + "px";
               this.hComp = (pathEl.y - 105) + "px";
               this.waiterС = false;
            } else {
               step = where
            }
         }

         if (step == 48) {
            this.winner = (obj == "player") ? "В Ы" : "К О М П Ь Ю Т Е Р";
            this.finish = true;
            this.message = "Игра окончена.";
            return;
         }

         if (step !== where) {
            this.myTimer = setTimeout(function () {
               this.autoStep(obj, where, jamp, transition);
            }.bind(this), 500);
         } else {
            var point = this.pathArr[where - 1].point;
            if (point) {
               this.message = this.surprise[point];
            }
            setTimeout(function () {
               this.middleware(obj, where, transition)
            }.bind(this), (point) ? 2000 : 500);
         }

      },
      /**
       *  Обработка достигнутых точек
       *  Либо передаем ход, либо обрабатываем сюрпризы
       */
      middleware: function (obj, where, transition) {
         var point = this.pathArr[where - 1].point;

         // Если уже в ловушке
         if (obj == "player" && this.waiterP) point = null;
         if (obj == "computer" && this.waiterС) point = null;

         // обработка точек с условиями
         switch (point) {
            case "forward":
               return this.autoStep(obj, where + 1, null, transition);
            case "backward":
               return this.autoStep(obj, where - 1, null, transition);
            case "wait":
               if (obj === "player") {
                  this.waiterP = true;
               } else {
                  this.waiterС = true;
               }
               return this.trans(obj, transition);
            case "teleport":
               var where = +this.pathArr[where - 1].jump;
               return this.autoStep(obj, where, true, transition);
         }
         this.trans(obj, transition);
      },
      /**
       * Передача хода. Автоматически обрабатываем ход компьютера
       */
      trans: function (obj, transition) { // передача хода
         if (transition) {
            this.onForAnotherPlayer(obj == "player" ? "computer" : "player");
         } else {
            setTimeout(function () {
               this.message = "Ваш ход. Бросайте кость."
               this.boneDisabled = false;
            }.bind(this), 1000);
         }
      },
      /**
       * На стартовой панели для выделения выбранных героев
       *
       * @param val {string} имя тролля
       * @return {string} имя класса с рамкой выделенного тролля
       */
      getClassChosenHero: function (val) {
         if (val == this.defaultPlayer) {
            return "imgChoisedPlayer"
         }
         if (val == this.defaultComputer) {
            return "imgChoisedComputer"
         }

      },
      /**
       * На стартовой панели есть возможность выбрать троллей
       *
       * @param event
       */
      onChoiceHero: function (event) {
         this.defaultPlayer = event.target.name;
         var newArr = this.allTrolles.filter(function (el) {
            return el.name !== event.target.name
         });
         var random = Math.round(Math.random() * 4);
         this.defaultComputer = newArr[random].name
      },
      /**
       * Отметить выбранного героя, для стартовой панели
       *
       * @param name
       * @return {string}
       */
      markHero: function (name) {
         var tx = "";
         if (name == this.defaultPlayer) {
            tx = "Ваш игрок";
         }
         if (name == this.defaultComputer) {
            tx = "Компьютер";
         }
         return tx;
      },
      /**
       * Начинаем игру
       */
      onStart: function () {
         this.start = false;
         this.message = "Ваш ход. Бросайте кость.";
      },
      /**
       * Бросаем кость
       *
       * @param obj {string} игрок
       */
      onBone: function (obj) {
         if (this.boneDisabled && this.myThrow == "") return;
         this.myThrow = (this.myThrow === "") ? "little" : "";
         if (this.myThrow !== "") {
            setTimeout(function () {
               var random = Math.round(Math.random() * 5 + 1);
               this.defaultBone = random;
               this.boneDisabled = true;
               this.onBone(obj);
               this.onStepAfterBone(obj);
            }.bind(this), 500)
         }
      },
      /**
       * Ход игрока или компьютер
       */
      onStepAfterBone: function (obj) {
         setTimeout(function () {
            var nextStep = (obj === "player") ? this.stepP : this.stepC;
            this.autoStep(obj, this.defaultBone + nextStep, null, (obj === "player"));
         }.bind(this), 1000);
      },
      /**
       * Переход другому игроку
       */
      onForAnotherPlayer: function (obj) {
         if (obj == "computer") {
            setTimeout(function () {
               this.message = "Ход комьютера";
               this.boneDisabled = false;
               this.onBone(obj)
            }.bind(this), 1000);
         }
      },
      /**
       * Заново играть
       */
      onRepeatGame: function () {
         this.finish = false;
         this.start = true;
         this.stepC = 0;
         this.stepP = 0;
         this.wPlayer = "0px";
         this.hPlayer = "310px";
         this.wComp = "0px";
         this.hComp = "380px";
         this.boneDisabled = false;
      }

   },
   filters: {
      /**
       *
       * @param val {string} имя тролля
       * @return {string} ссылка для отображения героя
       */
      getPathImg: function (val) {
         return "images/" + val + ".png";
      }
   },
   data: {
      winner: "",
      boneDisabled: false,
      finish: false,
      start: true,
      defaultPlayer: "Rose",
      defaultComputer: "Humorist",
      defaultBone: 0, // кость
      stepP: 0, // шаги пользователя
      stepC: 0, // шаги компьютера

      waiterP: false, // если попали в точку wait (ждут когда выпадет больше 4)
      waiterC: false,

      hPlayer: "310px",
      wPlayer: "0px",
      hComp: "380px",
      wComp: "0px",
      myThrow: "",

      allTrolles: [
         {name: "Almaz"},
         {name: "Flower"},
         {name: "Humorist"},
         {name: "Rose"},
         {name: "Roseking"},
         {name: "Rosepiece"},
      ],
      pathArr: [
         {id: 1, x: 197, y: 400},
         {id: 2, x: 273, y: 385},
         {id: 3, x: 343, y: 399},
         {id: 4, x: 383, y: 456, point: "forward"},
         {id: 5, x: 437, y: 503},
         {id: 6, x: 505, y: 481},
         {id: 7, x: 572, y: 509},
         {id: 8, x: 581, y: 580, point: "backward"},
         {id: 9, x: 623, y: 651, point: "wait"},
         {id: 10, x: 701, y: 679},
         {id: 11, x: 797, y: 671},
         {id: 12, x: 875, y: 642},
         {id: 13, x: 929, y: 590, point: "teleport", jump: "18"},
         {id: 14, x: 970, y: 535},
         {id: 15, x: 975, y: 476, point: "forward"},
         {id: 16, x: 944, y: 412},
         {id: 17, x: 878, y: 389},
         {id: 18, x: 808, y: 387},
         {id: 19, x: 772, y: 441},
         {id: 20, x: 742, y: 505, point: "wait"},
         {id: 21, x: 663, y: 494},
         {id: 22, x: 633, y: 418, point: "backward"},
         {id: 23, x: 702, y: 374},
         {id: 24, x: 740, y: 311},
         {id: 25, x: 654, y: 281, point: "wait"},
         {id: 26, x: 584, y: 313, point: "teleport", jump: "33"},
         {id: 27, x: 510, y: 309},
         {id: 28, x: 445, y: 348},
         {id: 29, x: 377, y: 325, point: "forward"},
         {id: 30, x: 338, y: 268},
         {id: 31, x: 325, y: 205, point: "backward"},
         {id: 32, x: 374, y: 157, point: "wait"},
         {id: 33, x: 449, y: 151},
         {id: 34, x: 522, y: 163},
         {id: 35, x: 583, y: 129},
         {id: 36, x: 650, y: 134, point: "backward"},
         {id: 37, x: 726, y: 124},
         {id: 38, x: 799, y: 134, point: "forward"},
         {id: 39, x: 870, y: 110},
         {id: 40, x: 924, y: 137, point: "teleport", jump: "45"},
         {id: 41, x: 876, y: 174},
         {id: 42, x: 835, y: 225},
         {id: 43, x: 854, y: 285, point: "wait"},
         {id: 44, x: 913, y: 326, point: "backward"},
         {id: 45, x: 989, y: 354},
         {id: 46, x: 1049, y: 402},
         {id: 47, x: 1123, y: 434},
         {id: 48, x: 1177, y: 499},
      ],
      myTimer: null,
      message: "Ваш ход. Бросайте кость.",
      questionMind: false,
      surprise: {
         wait: " Ловушка. Тролль ходит только когда на кубике выпадает больше 3-x",
         forward: " Повезло! Тролль может сделать дополнительный ход",
         backward: " Троллю нужно сделать шаг назад",
         teleport: " Тролль может срезать путь по белым стрелочкам"
      },

   },
});