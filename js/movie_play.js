const movie360 = document.getElementById('video');
const btnStart = document.querySelector("#btn-start");
const btnPause = document.querySelector("#btn-pause");
const btnNormarl = document.querySelector("#btn-1x");
const btnNormal5 = document.querySelector("#btn-5x");
// const btnReverse = document.querySelector("#btn--1x");
const btnBack1sec = document.querySelector("#btn-back1sec");
const btnBack10sec = document.querySelector("#btn-back10sec");
const btnJump = document.querySelector("#btn-jump");
const inputTime = document.querySelector("#input-time");
const kiroJump  = document.querySelector("#btn-jump-kiro");
const inputKiro = document.querySelector("#input-kiro");

const playback_position = document.getElementById("playback_position");
const fordevtime = document.getElementById("fordevtime");

// movie360.addEventListener('timeupdate', function() {
// 	playback_position.textContent = convertTime(movie360.currentTime);
//     console.log(movie360.currentTime);
//     fordevtime.textContent = movie360.currentTime;
// });

btnStart.addEventListener("click",(e) => {
    movie360.play();
    playtimer = setInterval(function(){
        playback_position.textContent = convertTime(movie360.currentTime);
        fordevtime.textContent = movie360.currentTime;
    }, 100);
});

btnPause.addEventListener("click",(e) => {
    movie360.pause();
});

btnNormarl.addEventListener("click",(e) => {
    movie360.playbackRate = 1.0;
});

btnNormal5.addEventListener("click",(e) => {
    movie360.playbackRate = 5.0;
});

// btnReverse.addEventListener("click",(e) => {
//     movie.playbackRate = -1.0;
//     console.log("逆再")
// });

btnBack1sec.addEventListener("click",(e) => {
    setTime = movie360.currentTime - 1;
    setTime = Math.floor(setTime * 100000) / 100000;
    movie360.currentTime = setTime;
})
btnBack1sec.addEventListener("click",(e) => {
    setTime = movie360.currentTime - 10;
    setTime = Math.floor(setTime * 100000) / 100000;
    movie360.currentTime = setTime;
})

btnJump.addEventListener("click",(e) => {
    movie360.currentTime = inputTime.value;
})

function kiroTomovieTime(kiro){
    var req = new XMLHttpRequest();
    req.open("get","movies/キロ程時間変換.csv",true);
    req.send(null);
  
    req.onload = function(){
        const kiro_time_arr = convertCSVtoArray(req.responseText);
        console.log(kiro_time_arr);
        var kiroResearch = kiro_time_arr.map(x =>x[0]).indexOf(kiro);
        var kiroTime = kiro_time_arr[kiroResearch][1];
        console.log(kiroResearch);
        console.log(kiroTime);
        movie360.currentTime = kiroTime;
    }
}

kiroJump.addEventListener("click",(e) => {
    kiroTomovieTime(inputKiro.value);
})

function convertCSVtoArray(str){
    var result_ = [];
    var tmp = str.split("\n");
    for(var i=0;i<tmp.length;++i){
      result_[i] = tmp[i].split(',');
    }
    return result_;
  }

const convertTime = function(time_position) {
    time_position = Math.floor(time_position);
    let res = null;
    if( 60 <= time_position ) {
        res = Math.floor(time_position / 60);
        res += ":" + Math.floor(time_position % 60).toString().padStart( 2, '0');
    } else {
        res = "0:" + Math.floor(time_position % 60).toString().padStart( 2, '0');
    }
    return res;
  };

//     window.addEventListener('load',function(){
//     var req = new XMLHttpRequest();
//     req.open("get","movies/キロ程時間変換.csv",true);
//     req.send(null);
  
//     req.onload = function(){
//     const kiro_time_arr = convertCSVtoArray(req.responseText);
//     console.log(kiro_time_arr)
//     }
//     function convertCSVtoArray(str){
//       var result_ = [];
//       var tmp = str.split("\n");
//       for(var i=0;i<tmp.length;++i){
//         result_[i] = tmp[i].split(',');
//       }
//       return result_;
//     }
//   }, false);