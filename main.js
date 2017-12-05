new Vue({
   el: '#gameDiv',
   methods: {
      autoStep: function (obj, where, jamp, transition) {
         // obj - "computer"||"player"
         // where - конечная точка
         // jamp - если нужно скачком
         // tranzition - нужно ли передавать ход
         if (where > 48 || where < 1) return;
         var pathEl = undefined;
         var step = (obj === "player") ? this.stepP : this.stepC;
         if (jamp) {
            pathEl = this.pathArr[where - 1];
            step = where
         }

         step = (step > where) ? step = step - 1 : step = step + 1;
         pathEl = (jamp) ? pathEl : this.pathArr[step - 1];
         (obj === "player") ? this.stepP = step : this.stepC = step;

         if (obj === "player") {
            this.wPlayer = (pathEl.x - 65) + "px";
            this.hPlayer = (pathEl.y - 120) + "px";
         } else {
            this.wComp = (pathEl.x - 50) + "px";
            this.hComp = (pathEl.y - 105) + "px";
         }

         if (step !== where) {
            this.myTimer = setTimeout(function () {
               this.autoStep(obj, where, jamp, transition);
            }.bind(this), 500);
         } else {
            console.log(" ==transition= ", transition)
            if (transition) {
               this.onForAnotherPlayer(obj == "player" ? "computer" : "player");
            } else{
               this.message = "Ваш ход"
            }
         }

      },
      choseImg: function (val) { // css для выделения выбранных героев
         if (val == this.defaultPlayer) {
            return "imgChoisedPlayer"
         }
         if (val == this.defaultComputer) {
            return "imgChoisedComputer"
         }

      },
      onChoiceHero: function (event) { // перевыбираем игроков
         this.defaultPlayer = event.target.name;
         var newArr = this.allTrolles.filter(function (el) {
            return el.name !== event.target.name
         });
         var random = Math.round(Math.random() * 4);
         this.defaultComputer = newArr[random].name
      },
      showHero: function (name) { // выбор героя
         var tx = "";
         if (name == this.defaultPlayer) {
            tx = "Ваш игрок";
         }
         if (name == this.defaultComputer) {
            tx = "Компьютер";
         }
         return tx;
      },
      onStart: function () { //начинаем игру
         this.start = false
      },
      onBone: function (obj) { // бросаем кость
         this.myThrow = (this.myThrow === "") ? "little" : "";
         if (this.myThrow !== "") {
            setTimeout(function () {
               var random = Math.round(Math.random() * 5 + 1);
               this.defaultBone = random;
               this.onBone(obj);
               this.onStepAfterBone(obj);
            }.bind(this), 500)
         }
      },
      onStepAfterBone: function (obj) {
         // ход игрока или компьютера
         setTimeout(function () {
            var nextStep = (obj === "player") ? this.stepP : this.stepC;
            this.autoStep(obj, this.defaultBone + nextStep, null, (obj === "player"));
         }.bind(this), 1000);
      },
      onForAnotherPlayer: function (obj) {
         // переход другому игроку
         if (obj == "computer") {
            this.message = "Ход комьютера"
            this.onBone(obj)
         }
      }

   },
   filters: {
      addPathImg: function (val) {
         return "images/" + val + ".png";
      }
   },
   data: {
      start: false,
      defaultPlayer: "Rose",
      defaultComputer: "Rosepiece",
      defaultBone: 0, // кость
      stepP: 0, // шаги пользователя
      stepC: 0, // шаги компьютера
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
         {id: 4, x: 383, y: 456},
         {id: 5, x: 437, y: 503},
         {id: 6, x: 505, y: 481},
         {id: 7, x: 572, y: 509},
         {id: 8, x: 581, y: 580},
         {id: 9, x: 623, y: 651},
         {id: 10, x: 701, y: 679},
         {id: 11, x: 797, y: 671},
         {id: 12, x: 875, y: 642},
         {id: 13, x: 929, y: 590},
         {id: 14, x: 970, y: 535},
         {id: 15, x: 975, y: 476},
         {id: 16, x: 944, y: 412},
         {id: 17, x: 878, y: 389},
         {id: 18, x: 808, y: 387},
         {id: 19, x: 772, y: 441},
         {id: 20, x: 742, y: 505},
         {id: 21, x: 663, y: 494},
         {id: 22, x: 633, y: 418},
         {id: 23, x: 702, y: 374},
         {id: 24, x: 740, y: 311},
         {id: 25, x: 654, y: 281},
         {id: 26, x: 584, y: 313},
         {id: 27, x: 510, y: 309},
         {id: 28, x: 445, y: 348},
         {id: 29, x: 377, y: 325},
         {id: 30, x: 338, y: 268},
         {id: 31, x: 325, y: 205},
         {id: 32, x: 374, y: 157},
         {id: 33, x: 449, y: 151},
         {id: 34, x: 522, y: 163},
         {id: 35, x: 583, y: 129},
         {id: 36, x: 650, y: 134},
         {id: 37, x: 726, y: 124},
         {id: 38, x: 799, y: 134},
         {id: 39, x: 870, y: 110},
         {id: 40, x: 924, y: 137},
         {id: 41, x: 876, y: 174},
         {id: 42, x: 835, y: 225},
         {id: 43, x: 854, y: 285},
         {id: 44, x: 913, y: 326},
         {id: 45, x: 989, y: 354},
         {id: 46, x: 1049, y: 402},
         {id: 47, x: 1123, y: 434},
         {id: 48, x: 1177, y: 499},
      ],
      myTimer: null,
      message: "Ваш ход. Нажмите кость.",
      questionMind: false,
   },
});