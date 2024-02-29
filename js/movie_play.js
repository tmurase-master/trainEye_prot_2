const movie360 = videojs('video', {
    //fill: true,
    fuild: true,
    //responsive: true,
    'preferFullWindow': true,
    'aspectRatio': '16:9',
    autoplay: true, // 自動再生
    loop: false, // ループ再生
    controls: true, // コントロール制御表示
    preload: 'auto', // 読み込み制御
    'playbackRates': [0.1, 0.5, 1, 3]
});
movie360.src({
    type: 'video/mp4',
    src: 'movies/front_side.mp4'
});
movie360.panorama({
    autoMobileOrientation: false,
    initFov: 100,
    clickAndDrag: true
});
movie360.on('playing', function () {
    playtimer = setInterval(function(){
        playback_position.textContent = convertTime(movie360.currentTime());
        fordevtime.textContent = movie360.currentTime();
        console.log(Math.trunc(movie360.currentTime()));
        fordevkilo.textContent = movieGISobj[Math.trunc(movie360.currentTime())].kilo;
    }, 500);
});

const movie360_UI = document.getElementById('video');
const btnStart = document.querySelector("#btn-start");
const btnPause = document.querySelector("#btn-pause");
//const btnNormarl = document.querySelector("#btn-1x");
//const btnNormal5 = document.querySelector("#btn-5x");
// const btnReverse = document.querySelector("#btn--1x");
const btnBack05sec = document.querySelector("#btn-back05sec");
const btnBack1sec = document.querySelector("#btn-back1sec");
const btnJump = document.querySelector("#btn-jump");
const inputTime = document.querySelector("#input-time");
const kiroJump  = document.querySelector("#btn-jump-kiro");
const inputKiro = document.querySelector("#input-kiro");

const playback_position = document.getElementById("playback_position");
const fordevtime = document.getElementById("fordevtime");
const fordevkilo = document.getElementById("fordevkilo");

// movie360.addEventListener('timeupdate', function() {
// 	playback_position.textContent = convertTime(movie360.currentTime);
//     console.log(movie360.currentTime);
//     fordevtime.textContent = movie360.currentTime;
// });



btnStart.addEventListener("click",(e) => {
    movie360.ready(() => {
        movie360.play();
    });
});

btnPause.addEventListener("click",(e) => {
    movie360.ready(() => {
        movie360.pause();
    });
});

// btnNormarl.addEventListener("click",(e) => {
//     movie360.playbackRate = 1.0;
// });

// btnNormal5.addEventListener("click",(e) => {
//     movie360.playbackRate = 5.0;
// });

// btnReverse.addEventListener("click",(e) => {
//     movie.playbackRate = -1.0;
//     console.log("逆再")
// });

btnBack05sec.addEventListener("click",(e) => {
    movie360.ready(() => {
        setTime = movie360.currentTime() - 0.5;
        setTime = Math.floor(setTime * 100000) / 100000;
        console.log(setTime);
        movie360.currentTime(setTime);
    });
})

btnBack1sec.addEventListener("click",(e) => {
    movie360.ready(() => {
        setTime = movie360.currentTime() - 1;
        setTime = Math.floor(setTime * 100000) / 100000;
        console.log(setTime);
        movie360.currentTime(setTime);
    });
})
// btnBack10sec.addEventListener("click",(e) => {
//     movie360.ready(() => {
//         setTime = movie360.currentTime() - 10;
//         setTime = Math.floor(setTime * 100000) / 100000;
//         console.log(setTime);
//         movie360.currentTime(setTime);
//         if(movie360.paused()){
//             // Playerを再生する
//             movie360.play();
//             // Playerを一時停止させる
//             movie360.pause();
//         }
//     });
// })

btnJump.addEventListener("click",(e) => {
    movie360.ready(() => {
        movie360.currentTime(inputTime.value);
    });
})

function jumpMovieTime(movietime){
    movie360.ready(() => {
        movie360.currentTime(movietime);
    });
}

// function kiroTomovieTime(kilo){
//     // var req = new XMLHttpRequest();
//     // req.open("get","movies/キロ程時間変換.csv",true);
//     // req.send(null);
  
//     // req.onload = function(){
//     //     const kiro_time_arr = convertCSVtoArray(req.responseText);
//     //     console.log(kiro_time_arr);
//     //     var kiroResearch = kiro_time_arr.map(x =>x[0]).indexOf(kiro);
//     //     var kiroTime = kiro_time_arr[kiroResearch][1];
//     //     console.log(kiroResearch);
//     //     console.log(kiroTime);
//     //     movie360.currentTime(kiroTime);
//     // }
//     console.log(kilo);
//     movie360.ready(() => {
//         movie360.currentTime();
//     });
// }

kiroJump.addEventListener("click",(e) => {
    jumpMovieTime(kiloGISobj[binarySearch(inputKiro.value)].moviesec);
})

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

// const movietimeToKilo = function(movietime) {
//     for (var i = 1, len = movieGISobj.length; i < len; i++) {
//         if(totalSeconds == time_position){
//             return movieGISarr[i][5];
//         }
//     }
// };

function timeFormat(timeSec) {
    timeSec = timeSec || 0;
    const hh = ("00" + ~~(timeSec / 3600)).slice(-2);
    const mm = ("00" + ~~((timeSec / 60) % 60)).slice(-2);
    const ss = ("00" + ~~(timeSec % 60)).slice(-2);
    return `${hh}:${mm}:${ss}`;
}

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