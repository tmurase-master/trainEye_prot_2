// グローバル変数
var map;
let moviePos = [];
var kiloGISarr;
var kiloGISobj = [];
var movieGISarr;
var movieGISobj = [];
var railroadCrossingGISarr;
var railroadCrossingGISobj = [];
var electrificationPoleGISarr;
var electrificationPoleGISobj = [];
var nowlatlng = {};
let overlayLayerControls = {};


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

function currentPos() {

  //(1)APIに対応していないブラウザを排除
  if (navigator.geolocation === false) {
    alert("位置情報を取得できません。ブラウザが対応していません。");
  }

  //(2)位置情報取得オプションを設定(後述)
  var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  //(3)取得成功時の動作設定
  function success(pos) {
    nowlatlng.lat = pos.coords.latitude;
    nowlatlng.lng = pos.coords.longitude;
  }

  //(4)取得失敗時(タイムアウトなど)の動作設定
  function error(err) {
    alert("位置情報を取得できませんでした。デバイスに位置情報を取得できる装置が無い、または取得に時間がかかっている、またはデバイスやブラウザ設定でブロックされています");
  }

  //(5)コマンドを実行
  navigator.geolocation.getCurrentPosition(success, error, options);
}

function loadInitialEquipment() {
  var req = new XMLHttpRequest();
  req.open("get", "csv/railroad_crossing.csv", true);
  req.overrideMimeType('text/plain; charset=Shift_JIS');
  req.send(null);
  req.onload = function () {
    railroadCrossingGISarr = convertCSVtoArray(req.responseText);
    for (var i = 1, len = railroadCrossingGISarr.length; i < len; i++) {
      if (railroadCrossingGISarr[i][0] == '') break;
      railroadCrossingGISobj.push({
        'kilo': railroadCrossingGISarr[i][2].replace(/[^0-9]/g, ''),
        'kilolat': Number(railroadCrossingGISarr[i][4]),
        'kilolng': Number(railroadCrossingGISarr[i][3]),
        'sitename': railroadCrossingGISarr[i][0],
        'railroadcrossingname': railroadCrossingGISarr[i][1],
      });
    }
    console.log(railroadCrossingGISobj);
    loadRailroadCrossingEquipment();
  }
  var req2 = new XMLHttpRequest();
  req2.open("get", "csv/electrification_pole.csv", true);
  req2.overrideMimeType('text/plain; charset=Shift_JIS');
  req2.send(null);
  req2.onload = function () {
    electrificationPoleGISarr = convertCSVtoArray(req2.responseText);
    for (var i = 1, len = electrificationPoleGISarr.length; i < len; i++) {
      if (electrificationPoleGISarr[i][0] == '') break;
      electrificationPoleGISobj.push({
        'kilo': electrificationPoleGISarr[i][2].replace(/[^0-9]/g, ''),
        'kilolat': Number(electrificationPoleGISarr[i][4]),
        'kilolng': Number(electrificationPoleGISarr[i][3]),
        'sitename': electrificationPoleGISarr[i][0],
        'electrificationpolename': electrificationPoleGISarr[i][1],
      });
    }
    console.log(electrificationPoleGISobj);
    loadElectrificationPoleEquipment();
  }
}
function loadRailroadCrossingEquipment() {
  var layer = L.layerGroup();

  var myIcon = L.icon({
    iconUrl: './images/' + "fumikiri.png",
    iconAnchor: [20, 40],
    iconSize: [30, 40]
  })

  for (var i = 0, ilen = railroadCrossingGISobj.length; i < ilen; i++) {
    var marker = L.marker([
      railroadCrossingGISobj[i].kilolat, railroadCrossingGISobj[i].kilolng
    ]);
    var str = "位置：" + railroadCrossingGISobj[i].sitename + "<br>" + "踏切名：" + railroadCrossingGISobj[i].railroadcrossingname + "踏切" + "<br>" + "キロ程：" + railroadCrossingGISobj[i].kilo + "付近";
    var googleMapStreetURL = "<a href=https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + railroadCrossingGISobj[i].kilolat + "," + railroadCrossingGISobj[i].kilolng + " target='_blank'>" + "ストリートビュー</a>" + "<br>";
    var googleMapRootURL = "<a href=https://www.google.com/maps/dir/?api=1&origin=" + nowlatlng.lat + "," + nowlatlng.lng + "&destination=" + railroadCrossingGISobj[i].kilolat + "," + railroadCrossingGISobj[i].kilolng + "&layer=traffic&travelmode=driving target='_blank'>" + "現在地からの移動経路</a>";
    marker.bindPopup(str + "<br>" + googleMapStreetURL + googleMapRootURL);
    marker.setIcon(myIcon);
    marker.bindTooltip(str, { direction: 'bottom', offset: L.point(0, 0) });
    layer.addLayer(marker)
  }
  overlayLayerControls['踏切'] = layer;
}
function loadElectrificationPoleEquipment() {
  var layer = L.layerGroup();

  var myIcon = L.icon({
    iconUrl: './images/' + "denchu.png",
    iconAnchor: [10, 20],
    iconSize: [15, 20]
  })

  for (var i = 0, ilen = electrificationPoleGISobj.length; i < ilen; i++) {
    var marker = L.marker([
      electrificationPoleGISobj[i].kilolat, electrificationPoleGISobj[i].kilolng
    ]);
    var str = "位置：" + electrificationPoleGISobj[i].sitename + "<br>" + "電柱名：" + electrificationPoleGISobj[i].electrificationpolename + "<br>" + "キロ程：" + electrificationPoleGISobj[i].kilo + "付近";
    marker.setIcon(myIcon);
    marker.bindTooltip(str, { direction: 'bottom', offset: L.point(0, 0) });
    layer.addLayer(marker)
  }
  overlayLayerControls['電柱'] = layer;
  L.control.layers(null, overlayLayerControls, { collapsed: false }).addTo(map);
}



function loadKiloGISFile() {
  var req = new XMLHttpRequest();
  req.open("get", "csv/movieTimeLinkTokiloMeter.csv", true);
  req.send(null);
  req.onload = function () {
    kiloGISarr = convertCSVtoArray(req.responseText);
    for (var i = 1, len = kiloGISarr.length; i < len; i++) {
      if (kiloGISarr[i][0] == '') break;
      kiloGISobj.push({
        'kilo': kiloGISarr[i][6].replace(/[^0-9]/g, ''),
        'kilolat': Number(kiloGISarr[i][5]),
        'kilolng': Number(kiloGISarr[i][4]),
        'moviesec': Number(kiloGISarr[i][3]),
        'movietime': kiloGISarr[i][2],
        'movielat': Number(kiloGISarr[i][1]),
        'movielng': Number(kiloGISarr[i][0])
      });
    }
    console.log(kiloGISobj);
  }
}

function loadMovieGISFile() {
  var req = new XMLHttpRequest();
  req.open("get", "csv/kiloMeterLinkToMovieTime.csv", true);
  req.send(null);
  req.onload = function () {
    movieGISarr = convertCSVtoArray(req.responseText);
    for (var i = 1, len = movieGISarr.length; i < len; i++) {
      if (movieGISarr[i][0] == '') break;
      movieGISobj.push({
        'kilo': movieGISarr[i][6].replace(/[^0-9]/g, ''),
        'kilolat': Number(movieGISarr[i][5]),
        'kilolng': Number(movieGISarr[i][4]),
        'moviesec': Number(movieGISarr[i][3]),
        'movietime': movieGISarr[i][2],
        'movielat': Number(movieGISarr[i][1]),
        'movielng': Number(movieGISarr[i][0])
      });
    }
    console.log(movieGISobj);
    loadMovieToMap();
  }
}

function loadGPXdataToMap() {
  var gpxreq = new XMLHttpRequest();
  gpxreq.open('get', 'gpx/trainRoot.gpx', true);
  gpxreq.send(null);
  gpxreq.onload = function () {
    gpxToMap(gpxreq.responseText);
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

function loadMovieToMap() {
  var routeLatLng = [];
  for (var i = 0, len = movieGISobj.length; i < len; i++) {
    routeLatLng[i] = [movieGISobj[i].movielat, movieGISobj[i].movielng];
    MapSetMoviePoint(movieGISobj[i], i);
  }
  L.polyline(routeLatLng, { color: '#3B83CC', weight: 5 }).addTo(map);
}

function gpxToMap(gpxStr) {
  var parser = new DOMParser();
  var gpx = parser.parseFromString(gpxStr, 'text/xml');
  var elements = gpx.getElementsByTagName('trkpt');
  var routeLatLng = [];
  for (var i = 0; i < (elements.length); i++) {
    moviePos.push(gpxParse(elements.item(i), elements.item(0)));
    MapSetMoviePoint(moviePos, i);
    routeLatLng[i] = [moviePos[i]['lat'], moviePos[i]['lon']];
  }
  L.polyline(routeLatLng, { color: '#3B83CC', weight: 5 }).addTo(map);
}
function gpxParse(trkpt, trkpt0) {
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

function MapSetMoviePoint(rootPoint, num) {
  var myIcon = L.icon({
    iconUrl: './images/' + "point.png",
    iconAnchor: [7, 7],
    iconSize: [15, 15]
  })
  var str = "天球動画:" + rootPoint.movietime + "<br>" + "キロ程：" + rootPoint.kilo + "付近";
  var layer = L.marker([
    rootPoint.movielat, rootPoint.movielng
  ]);
  layer.setIcon(myIcon);
  layer.bindTooltip(str, { direction: 'bottom', offset: L.point(0, 0) });
  var moviesec = rootPoint.moviesec;
  layer.on('click', function () { jumpMovieTime(moviesec) });
  layer.addTo(map);
}

function loadEquipDataToMap() {
  console.log(readEquipData);
  for (var i = 0, ilen = readEquipData.Sheet1.length; i < ilen; i++) {
    for (var j = 0, jlen = kiloGISarr.length; j < jlen; j++) {
      if (Math.abs((Number(readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '')) - Number(kiloGISobj[j].kilo))) <= 5) {
        readEquipData.Sheet1[i].kilo = readEquipData.Sheet1[i].キロ程始.replace(/[^0-9]/g, '');
        readEquipData.Sheet1[i].latitude = kiloGISobj[j].kilolat;
        readEquipData.Sheet1[i].longitude = kiloGISobj[j].kilolng;
        break;
      }
    }
    console.log(readEquipData.Sheet1[i]);
    MapSetMarkers(readEquipData, i, kiloGISobj[binarySearch(readEquipData.Sheet1[i].kilo)].moviesec);
  }
}

function MapSetMarkers(jsondata, markerNum, movietime) {
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
  layer.bindTooltip(str, { direction: 'bottom', offset: L.point(0, 0) });
  var googleMapStreetURL = "<a href=https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + jsondata.Sheet1[markerNum].latitude + "," + jsondata.Sheet1[markerNum].longitude + " target='_blank'>" + "ストリートビュー</a>" + "<br>";
  var googleMapRootURL = "<a href=https://www.google.com/maps/dir/?api=1&origin=" + nowlatlng.lat + "," + nowlatlng.lng + "&destination=" + jsondata.Sheet1[markerNum].latitude + "," + jsondata.Sheet1[markerNum].longitude + "&layer=traffic&travelmode=driving target='_blank'>" + "現在地からの移動経路</a>";
  layer.bindPopup(googleMapStreetURL + googleMapRootURL);
  //layer.bindPopup('<div id="box">' + googleMapURL + movieURL + '</div>');
  layer.on('click', function () { jumpMovieTime(movietime) });
  layer.addTo(map);
}

function binarySearch(searchKilometer) {
  var searchValue = Number(searchKilometer);
  //「調べた値」と「探す値」が一致したとき、indexを保存する変数。
  //初期値はエラー(-1)に設定
  var index = -1;

  //調べる左端を表す添字(index)
  var left = 0;

  //調べる右端を表す添字(index)
  var right = kiloGISobj.length - 1;

  //左端と右端にデータがある間は処理を繰り返す
  var temp = 0;
  while (left <= right) {

    //左右の真ん中を表す添字(index)
    middle = Math.floor((left + right) / 2);
    temp = Number(kiloGISobj[middle].kilo);

    //真ん中の値と探す値を比較する
    if (Math.abs(temp - searchValue) < 5) {
      //条件に合致した場合、変数に入れて処理終了
      index = middle;
      break;
    } else if (temp < searchValue) {
      //探す値より小さい場合、左側にはもっと小さい値しかないので左端の値を真ん中の値の右に移動する
      left = middle + 1;
    } else {
      //探す値より大きい場合、右側にはもっと大きい値しかないので右端の値を真ん中の値の左に移動する
      right = middle - 1;
    }
  }

  //検索結果を表示する。(-1の場合は値がなかった)
  return index;
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