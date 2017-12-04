new Vue({
    el:'#gameDiv',
    methods:{
        onClick: function(a, b){
            // var pathEl = this.pathArr[this.id++];
            // this.leftRosa = (pathEl.x-60)+"px";
            // this.topRosa = (pathEl.y-120)+"px";
            clearTimeout(this.myTimer);
            this.id=0;
            this.autoStep();

        },
        onMDown: function(a){
            // this.id++;
            // console.log(" == "+this.id);
            // this.pathArr+="{id:"+this.id+",x:"+a.offsetX+", y:"+a.offsetY+"},";
            //
            // console.log(" pathArr = ", this.pathArr);
        },
        autoStep: function(){
            console.log(" val = ");
            if(this.id<48){
                var pathEl = this.pathArr[this.id++];
                this.leftRosa = (pathEl.x-60)+"px";
                this.topRosa = (pathEl.y-120)+"px";
                this.myTimer = setTimeout(function(){
                    this.autoStep();
                }.bind(this),500);
            }else{
                this.id=0;
            }
        },
       choseImg:function(val){
           if(val == this.defaultPlayer){
              return "imgChoisedPlayer"
           }
          if(val == this.defaultComputer){
             return "imgChoisedComputer"
          }

       },
       onChoiceHero: function(event){ // перевыбираем игроков
          this.defaultPlayer = event.target.name;
          var newArr = this.allTrolles.filter(function (el) {
             return el.name!== event.target.name
          });
          var random = Math.round(Math.random()*4);
          this.defaultComputer = newArr[random].name
       },
       showHero: function(name){
          var tx="";
          if(name==this.defaultPlayer) {
             tx="Ваш игрок"
          }
          if(name==this.defaultComputer){
             tx="Компьютер";
          }
          return tx;

       },
       onStart: function(){
          alert()
       }

    },
   filters:{
      addPuthImage: function(val){
         return "images/"+val+".png";
      }
   },
   data:{
      text: "2323232",
      start: true,
      defaultPlayer:"Rose",
      defaultComputer:"Rosepiece",
      topRosa: "0px",
      leftRosa: "0px",
      allTrolles:[
         {name:"Almaz", xl:60, yl:120},
         {name:"Flower", xl:60, yl:120},
         {name:"Humorist", xl:60, yl:120},
         {name:"Rose", xl:60, yl:120},
         {name:"Roseking", xl:60, yl:120},
         {name:"Rosepiece", xl:60, yl:120},
      ],
      pathArr:[
         {id:1,x:197, y:400},
         {id:2,x:273, y:385},
         {id:3,x:343, y:399},
         {id:4,x:383, y:456},
         {id:5,x:437, y:503},
         {id:6,x:505, y:481},
         {id:7,x:572, y:509},
         {id:8,x:581, y:580},
         {id:9,x:623, y:651},
         {id:10,x:701, y:679},
         {id:11,x:797, y:671},
         {id:12,x:875, y:642},
         {id:13,x:929, y:590},
         {id:14,x:970, y:535},
         {id:15,x:975, y:476},
         {id:16,x:944, y:412},
         {id:17,x:878, y:389},
         {id:18,x:808, y:387},
         {id:19,x:772, y:441},
         {id:20,x:742, y:505},
         {id:21,x:663, y:494},
         {id:22,x:633, y:418},
         {id:23,x:702, y:374},
         {id:24,x:740, y:311},
         {id:25,x:654, y:281},
         {id:26,x:584, y:313},
         {id:27,x:510, y:309},
         {id:28,x:445, y:348},
         {id:29,x:377, y:325},
         {id:30,x:338, y:268},
         {id:31,x:325, y:205},
         {id:32,x:374, y:157},
         {id:33,x:449, y:151},
         {id:34,x:522, y:163},
         {id:35,x:583, y:129},
         {id:36,x:650, y:134},
         {id:37,x:726, y:124},
         {id:38,x:799, y:134},
         {id:39,x:870, y:110},
         {id:40,x:924, y:137},
         {id:41,x:876, y:174},
         {id:42,x:835, y:225},
         {id:43,x:854, y:285},
         {id:44,x:913, y:326},
         {id:45,x:989, y:354},
         {id:46,x:1049, y:402},
         {id:47,x:1123, y:434},
         {id:48,x:1177, y:499},
      ],
      myTimer:null,
      id:0
   },
});