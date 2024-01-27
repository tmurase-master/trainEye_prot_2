// グローバル変数
var map;
let moviePos = [];
var GISarr;
var Allarr= [];


//仕様変更によりコメントアウト（キロ程データ読み込みボタン削除）
// function testtest() {
//   for (var i = 0, len = readEquipData.Sheet1.length; i < len; i++) {
//     for (var j = 0, len = readGIS.GIS.length; j < len; j++) {
//       if ((readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '') - readGIS.GIS[j].kilometer.replace(/[^0-9]/g, '')) <= 5) {
//         readEquipData.Sheet1[i].test = readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g,'');
//         readEquipData.Sheet1[i].latitude = readGIS.GIS[j].latitude;
//         readEquipData.Sheet1[i].longitude = readGIS.GIS[j].longitude;
//         break;
//       }
//     }
//     console.log(readEquipData.Sheet1[i]);
//     console.log(readEquipData.Sheet1[i].latitude);
//     MapSetMarkers(readEquipData, i);
//   }

// }

function loadGISFile() {
  var req = new XMLHttpRequest();
  req.open("get", "東海道線GIS.csv", true);
  req.send(null);
  req.onload = function () {
    GISarr = convertCSVtoArray(req.responseText);
  }
}
function convertCSVtoArray(str) {
  var result_ = [];
  var tmp = str.split("\n");
  for (var i = 0; i < tmp.length; ++i) {
    result_[i] = tmp[i].split(',');
  }
  return result_;
}

function loadGPXdataToMap() {
  var gpxreq = new XMLHttpRequest();
  gpxreq.open('get', 'gpx/trainRoot.gpx', true);
  gpxreq.send(null);
  gpxreq.onload = function () {
    gpxToMap(gpxreq.responseText);
  }
}

function gpxToMap(gpxStr) {
  var parser = new DOMParser();
  var gpx = parser.parseFromString(gpxStr, 'text/xml');
  var elements = gpx.getElementsByTagName('trkpt');
  var routeLatLng = [];
  for (var i = 0; i < (elements.length); i++) {
    moviePos.push(gpxParse(elements.item(i),elements.item(0)));
    MapSetRootPoint(moviePos, i);
    routeLatLng[i] = [moviePos[i]['lat'], moviePos[i]['lon']];
  }
  L.polyline(routeLatLng, { color: '#3B83CC', weight: 5 }).addTo(map);
  
}
function gpxParse(trkpt,trkpt0) {
  var timeTxt = trkpt.getElementsByTagName('time')[0].textContent;
  var time = new Date(timeTxt);
  var timeTxt0 = trkpt0.getElementsByTagName('time')[0].textContent;
  var time0 = new Date(timeTxt0);
  let tmpdate1 = new Date(time0.toLocaleDateString() + ' ' + time0.toLocaleTimeString());
  let tmpdate2 = new Date(time.toLocaleDateString() + ' ' + time.toLocaleTimeString());
  let diff = tmpdate2.getTime() - tmpdate1.getTime(); 
  return {
    movietime: Math.abs(diff) / 1000,
    lat: parseFloat(trkpt.getAttribute('lat')),
    lon: parseFloat(trkpt.getAttribute('lon')),
    time: time,
    dateStr: time.toLocaleDateString(),
    timeStr: time.toLocaleTimeString(),
    ele: trkpt.getElementsByTagName('ele')[0].textContent
  };
}

function MapSetRootPoint(rootPoint, num) {
  var myIcon = L.icon({
    iconUrl: './images/' + "point.png",
    iconAnchor: [7, 7],
    iconSize: [15, 15]
  })
  var str = "天球動画；"+rootPoint[num]['movietime'];
  var layer = L.marker([
    rootPoint[num]['lat'],
    rootPoint[num]['lon']
  ]);
  layer.setIcon(myIcon);
  layer.bindTooltip(str, { direction: 'bottom', offset: L.point(0, 0) })

  layer.on('click', function () { jumpMovieTime(rootPoint[num]['movietime'])});
  layer.addTo(map);
}


// function createAllarr(){
//   setTimeout(() => {
//     console.log(GISarr);
//     console.log(moviePos);

//     for (var i = 0; i < (GISarr.length); i++) {
//       var closestPoint = [moviePos[0]['lat'], moviePos[0]['lon']];
//       var closestPointnum = 0;
//       for(var j = 0; j < (moviePos.length); j++) {
        
//       }

//       Allarr.push({
//         kiro: GISarr[i][0],
//         kirolat: GISarr[i][1],
//         kirolog: GISarr[i][2],
//         movietime: "",
//         movielat: "",
//         movielon: "",
//       });
//     }
//     console.log(Allarr);
//   }, 3000);
// }

function testtest_ver2() {
  console.log(readEquipData);
  for (var i = 0, len = readEquipData.Sheet1.length; i < len; i++) {
    for (var j = 0, len = GISarr.length; j < len; j++) {
      if ((readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '') - GISarr[j][0].replace(/[^0-9]/g, '')) <= 5) {
        readEquipData.Sheet1[i].test = readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '');
        readEquipData.Sheet1[i].latitude = GISarr[j][1];
        readEquipData.Sheet1[i].longitude = GISarr[j][2];
        break;
      }
    }
    console.log(readEquipData.Sheet1[i]);

    MapSetMarkers(readEquipData, i);
  }
}

function phoneEquipRead() {
  readEquipData
  for (var i = 0, len = readEquipData.Sheet1.length; i < len; i++) {
    for (var j = 0, len = GISarr.length; j < len; j++) {
      if ((readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '') - GISarr[j][0].replace(/[^0-9]/g, '')) <= 5) {
        readEquipData.Sheet1[i].test = readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '');
        readEquipData.Sheet1[i].latitude = GISarr[j][1];
        readEquipData.Sheet1[i].longitude = GISarr[j][2];
        break;
      }
    }
    console.log(readEquipData.Sheet1[i]);

    MapSetMarkers(readEquipData, i);
  }
}

function MapSetMarkers(jsondata, markerNum) {
  var myIcon = L.icon({
    iconUrl: './images/' + "marker.png",
    iconAnchor: [20, 40],
    iconSize: [40, 40]
  })
  var str = "大分類：" + jsondata.Sheet1[markerNum].大分類;
  str = str + "<br>" + "中分類：" + jsondata.Sheet1[markerNum].中分類;
  str = str + "<br>" + "小分類：" + jsondata.Sheet1[markerNum].小分類;
  str = str + "<br>" + "路線：" + jsondata.Sheet1[markerNum].路線;
  str = str + "<br>" + "設置場所：" + jsondata.Sheet1[markerNum].設置場所;
  str = str + "<br>" + "キロ程：" + jsondata.Sheet1[markerNum].キロ程始;
  str = str + "<br>" + "使用開始年月：" + jsondata.Sheet1[markerNum].使用開始年月;
  var layer = L.marker([
    jsondata.Sheet1[markerNum].latitude,
    jsondata.Sheet1[markerNum].longitude
  ]);
  layer.setIcon(myIcon);
  layer.bindTooltip(str, { direction: 'bottom', offset: L.point(0, 0) })

  var googleMapURL = "<a href=https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + jsondata.Sheet1[markerNum].latitude + "," + jsondata.Sheet1[markerNum].longitude + " target='_blank'>" + "ストリートビュー</a>";
  //var movieURL = "<div id='movieURL'>"+"列車視点360度動画</div>";
  layer.bindPopup(googleMapURL);
  //layer.bindPopup('<div id="box">' + googleMapURL + movieURL + '</div>');
  layer.on('click', function () { kiroTomovieTimeEvent(jsondata.Sheet1[markerNum].キロ程始) });
  layer.addTo(map);
}

function kiroTomovieTimeEvent(kiro) {
  kiroTomovieTime(kiro.replace(".", ""));
}


// var form = document.forms.myform;
// form.myfile.addEventListener( 'change', function(e) {

//   var result = e.target.files[0];

//   //FileReaderのインスタンスを作成する
//   var reader = new FileReader();

//   //読み込んだファイルの中身を取得する
//   reader.readAsText( result );

//   //ファイルの中身を取得後に処理を行う
//   reader.addEventListener( 'load', function() {

//       //ファイルの中身をtextarea内に表示する
//       form.output.textContent = reader.result;
//   })

// })

// function getCSV(){
//   var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
//   req.open("get", "test.csv", true); // アクセスするファイルを指定
//   req.send(null); // HTTPリクエストの発行

//   // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
//   req.onload = function(){
//     convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ

//   }
// }
// // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
// function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
//   var result = []; // 最終的な二次元配列を入れるための配列
//   var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

//   // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
//   for(var i=0;i<tmp.length;++i){
//       result[i] = tmp[i].split(',');
//   }

//   alert(result[1][2]); // 300yen
// }
// async function changeFile(e) {
//   const [file] = e.target.files;
//   if (file) {
//     const reader = new FileReader();
//     reader.readAsText(file);
//     await new Promise((resolve) => (reader.onload = () => resolve()));
//     console.log(reader.result)
//     if (reader.result) {
//       const lineList = reader.result.split("\n");
//       const keyList = lineList[0].split(",");
//       const resultObj = lineList
//         .filter((_, index) => index !== 0)
//         .map((line) => {
//           const valueList = line.split(",");
//           const tmpObj = {};
//           keyList.map((key, index) => (tmpObj[key] = valueList[index]));
//           return tmpObj;
//         });
//       outputList.value = resultObj;
//     }
//   }
// };

// async function getJsonFile(jsonFilePath) {
//   const response = await fetch(jsonFilePath, { cache: "no-store" });
//   const members = await response.json();
//   MapData_OnLoad_byJson(members);
// }

// function MapData_OnLoad_byJson(jsondata) {
//   for (var i = 0, len = jsondata.features.length; i < len; i++) {
//     MapSetMarkers(jsondata, i)
//   }
// }

// function MapSetMarkers(jsondata, markerNum) {
//   var myIcon = L.icon({
//     iconUrl: './images/' + jsondata.features[markerNum].properties.markerIcon,
//     shadowUrl: './images/marker-shadow.png',
//     iconAnchor: [20, 40],
//     iconSize: [40, 40]
//   })
//   var str = jsondata.features[markerNum].properties.siteName;
//   if (jsondata.features[markerNum].properties.pictureInfo) {
//     str = str + "<br>" + jsondata.features[markerNum].properties.pictureInfo.twoORthree
//       + "<br>" + "撮影日：" + jsondata.features[markerNum].properties.pictureInfo.picDate;
//   }
//   var layer = L.marker([
//     jsondata.features[markerNum].geometry.coordinates[1],
//     jsondata.features[markerNum].geometry.coordinates[0]
//   ]);
//   layer.setIcon(myIcon);
//   layer.bindTooltip(str, { direction: 'top', offset: L.point(0, -10) })
//   layer.on('click', function () { ClickMarkerEvent(jsondata.features[markerNum]) });
//   layer.addTo(map);
// }

// function ClickMarkerEvent(feature) {
//   if (feature.properties.markerInfo == "build") {
//     console.log(feature.properties.sitePicureFile);
//     siteChange(feature.properties.sitePicureFile, feature.properties.siteJsonFile)
//   }
//   else {
//     console.log(feature.properties.pictureInfo.pictureFile);
//     pictureChange(feature.properties.pictureInfo.pictureFile, feature.properties.markerInfo)
//   }
// }


// $(function () {
//   // remove form validation
//   $('form').find('textarea').removeAttr('required max min maxlength pattern');
//   $('form').find('input').removeAttr('required max min maxlength pattern');
// });