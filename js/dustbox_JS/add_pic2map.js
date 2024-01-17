// 初期ロード時に実行されるjavascript
// 2023.3.31
var map_change;
var target_marker;
var markers_def = [];
var jsondata_original;
var jsonIDs;
var mapIDs;
var imgIDs;
//var jsondata_replace;
var newjson;
var saveJsonFileURLElement = document.getElementsByName('saveJsonFileURL')[0];
var saveGloablJsonFileNameElement = document.getElementsByName('saveGloablJsonFileName')[0];
var saveJsonFileNameElement = document.getElementsByName('saveJsonFileName')[0];
var savePicFileURLElement = document.getElementsByName('savePicFileURL')[0];
var savePicFileNameElement = document.getElementsByName('savePicFileName')[0];
var savePicFileOriginalNameElement = document.getElementsByName('savePicFileOriginalName')[0];
var globalJsonTofileElement = document.getElementsByName('globalJsonTofile')[0];
var jsonTofileElement = document.getElementsByName('jsonTofile')[0];
var filesElement = document.getElementById('loadfile');

var saveRenewJsonFileURLElement = document.getElementsByName('saveRenewJsonFileURL')[0];
var saveRenewJsonFileNameElement = document.getElementsByName('saveRenewJsonFileName')[0];
var renewJsonTofileElement = document.getElementsByName('renewJsonTofile')[0];

function CreateBuildMarker(marker) {
    document.getElementById('pictureDateTitle').style.display = 'none';
    document.getElementById('pictureDate').style.display = 'none';
    document.getElementById('add2map').style.display = 'block';
    document.getElementById('add2site').style.display = 'none';
    document.getElementById("modalTitle").textContent = "MAPにSITE（場所）を追加する";
    document.getElementById("siteName").value = '';

    //cgiにて動的にファイルを編集するための事前準備
    savePicFileURLElement.value = 'map';
    savePicFileNameElement.value = '';
    filesElement.value = '';

    modalOpen();
    newjson = null;
    newjson = {
        "type": "Feature",
        "properties": {
            "markerInfo": "build",
            "markerIcon": "buildingIcon.png",
            "siteName": "",
            "sitePicureFile": "",
            "siteJsonFile": "",
            "pictureInfo": ""
        },
        "geometry": {
            "coordinates": [
                marker.latlng.lng,
                marker.latlng.lat
            ],
            "type": "Point"
        }
    }
    document.getElementById("LongitudeNum").value = marker.latlng.lng;
    document.getElementById("LatitudeNum").value = marker.latlng.lat;
}

function Create3DpicMarker(marker) {
    document.getElementById('pictureDateTitle').style.display = 'block';
    document.getElementById('pictureDate').style.display = 'block';
    document.getElementById('add2map').style.display = 'block';
    document.getElementById('add2site').style.display = 'none';
    document.getElementById("modalTitle").textContent = "MAPにVIEW（360）を追加する";
    document.getElementById("siteName").value = '';

    //cgiにて動的にファイルを編集するための事前準備    
    savePicFileURLElement.value = 'img';
    savePicFileNameElement.value = '';
    filesElement.value = '';

    modalOpen();
    newjson = null;
    newjson = {
        "type": "Feature",
        "properties": {
            "markerInfo": "3Dpic",
            "markerIcon": "3DpictureIcon.png",
            "siteName": "",
            "sitePicureFile": "",
            "siteJsonFile": "",
            "pictureInfo": {
                "twoORthree": "3D画像",
                "pictureFile": "",
                "picDate": ""
            }
        },
        "geometry": {
            "coordinates": [
                marker.latlng.lng,
                marker.latlng.lat
            ],
            "type": "Point"
        }
    }
    document.getElementById("LongitudeNum").value = marker.latlng.lng;
    document.getElementById("LatitudeNum").value = marker.latlng.lat;
}

function Create2DpicMarker(marker) {
    document.getElementById('pictureDateTitle').style.display = 'block';
    document.getElementById('pictureDate').style.display = 'block';
    document.getElementById('add2map').style.display = 'block';
    document.getElementById('add2site').style.display = 'none';
    document.getElementById("modalTitle").textContent = "MAPにVIEW（2D）を追加する";
    document.getElementById("siteName").value = '';

    //cgiにて動的にファイルを編集するための事前準備
    savePicFileURLElement.value = 'img';
    savePicFileNameElement.value = '';
    filesElement.value = '';

    modalOpen();
    newjson = null;
    newjson = {
        "type": "Feature",
        "properties": {
            "markerInfo": "2Dpic",
            "markerIcon": "2DpictureIcon.png",
            "siteName": "",
            "sitePicureFile": "",
            "siteJsonFile": "",
            "pictureInfo": {
                "twoORthree": "2D画像",
                "pictureFile": "",
                "picDate": ""
            }
        },
        "geometry": {
            "coordinates": [
                marker.latlng.lng,
                marker.latlng.lat
            ],
            "type": "Point"
        }
    }
    document.getElementById("LongitudeNum").value = marker.latlng.lng;
    document.getElementById("LatitudeNum").value = marker.latlng.lat;
}

async function getJsonFile_Change(jsonFilePath) {
    const response = await fetch(jsonFilePath, { cache: "no-store" });
    const members = await response.json();
    MapData_OnLoad_byJson_Change(members);
}

function MapData_OnLoad_byJson_Change(jsondata) {
    jsondata_original = jsondata;
    for (var i = 0, len = jsondata.features.length; i < len; i++) {
        console.log(jsondata.features[i].properties.pictureInfo.pictureFile)
        console.log(jsondata.features[i].geometry.coordinates)
        MapSetMarkers_Change(jsondata, i)
    }
    console.log(jsondata);
}

function MapSetMarkers_Change(jsondata, markerNum) {
    var myIcon = L.icon({
        iconUrl: './images/' + jsondata.features[markerNum].properties.markerIcon,
        shadowUrl: './images/marker-shadow.png',
        iconAnchor: [20, 40],
        iconSize: [40, 40]
    })
    var str = jsondata.features[markerNum].properties.siteName;
    if (jsondata.features[markerNum].properties.pictureInfo) {
        str = str + "<br>" + jsondata.features[markerNum].properties.pictureInfo.twoORthree
            + "<br>" + "撮影日：" + jsondata.features[markerNum].properties.pictureInfo.picDate;
    }
    markers_def[markerNum] = L.marker([
        jsondata.features[markerNum].geometry.coordinates[1],
        jsondata.features[markerNum].geometry.coordinates[0]
    ], {
        draggable: 'true',
        contextmenu: true,
        contextmenuWidth: 180,
        contextmenuItems: [{
            text: 'このアイコンに登録された情報をすべて削除',
            index: 0,
            callback: function () {
                DeleteMaker(jsondata, markerNum)
            }
        }, {
            separator: true,
            index: 1
        }]
    });
    markers_def[markerNum].setIcon(myIcon);
    markers_def[markerNum].bindTooltip(str, { direction: 'top', offset: L.point(0, -10) })
    markers_def[markerNum].on('mouseup', function (e) {
        update_coord_references(map_change, this, e.latlng, jsondata, markerNum);
    });
    markers_def[markerNum].on('click', function () { ClickMarkerEvent_Change(jsondata.features[markerNum]) });
    markers_def[markerNum].addTo(map_change);
}

function DeleteMaker(jsondata, markerNum) {
    //まず注意喚起。（特にbuildを消すと結構致命的）
    switch (jsondata.features[markerNum].properties.markerInfo) {
        case "build":
            mapIDs.splice(selectINDEXfromIDsbyFilename(mapIDs, jsondata.features[markerNum].properties.sitePicureFile), 1);
            deleteFileProcess("map", jsondata.features[markerNum].properties.sitePicureFile);
            jsonIDs.splice(selectINDEXfromIDsbyFilename(jsonIDs, jsondata.features[markerNum].properties.siteJsonFile), 1);
            deleteFileProcess("json", jsondata.features[markerNum].properties.siteJsonFile);
            replaceJsonFile("map", "ID.json", mapIDs);
            replaceJsonFile("json", "ID.json", jsonIDs);
            break;
        case "3Dpic":
            imgIDs.splice(selectINDEXfromIDsbyFilename(imgIDs, jsondata.features[markerNum].properties.pictureInfo.pictureFile), 1);
            deleteFileProcess("img", jsondata.features[markerNum].properties.pictureInfo.pictureFile);
            replaceJsonFile("img", "ID.json", imgIDs);
            break;
        case "2Dpic":
            imgIDs.splice(selectINDEXfromIDsbyFilename(imgIDs, jsondata.features[markerNum].properties.pictureInfo.pictureFile), 1);
            deleteFileProcess("img", jsondata.features[markerNum].properties.pictureInfo.pictureFile);
            replaceJsonFile("img", "ID.json", imgIDs);
            break;
        default:
            alert("エラーです。閉じてください");
    }
    jsondata.features.splice(markerNum, 1);
    replaceALLMarker(jsondata)
    jsondata_original = jsondata;
    replaceJsonFile("json", "globalmap.geojson", jsondata_original);

}

function selectINDEXfromIDsbyFilename(IDs, filename) {
    var index_number = 0;
    for (var i = 0; i < Object.keys(IDs).length; i++) {
        if (IDs[i].filename == filename) {
            index_number = i
            break;
        }
    }
    return index_number;
}

function replaceALLMarker(jsondata) {
    //マップ上のマーカー初期化
    for (var i = 0, len = markers_def.length; i < len; i++) {
        map_change.removeLayer(markers_def[i]);
    }
    markers_def = [];
    for (var i = 0, len = jsondata.features.length; i < len; i++) {
        console.log(jsondata.features[i].properties.pictureInfo.pictureFile)
        console.log(jsondata.features[i].geometry.coordinates)
        MapSetMarkers_Change(jsondata, i)
    }
    console.log(jsondata);
}

function update_coord_references(map, marker, latLng, jsondata, markerNum) {
    jsondata.features[markerNum].geometry.coordinates[1] = latLng.lat;
    jsondata.features[markerNum].geometry.coordinates[0] = latLng.lng;
    jsondata_original = jsondata;
    replaceJsonFile("json", "globalmap.geojson", jsondata_original);
}

function ClickMarkerEvent_Change(feature) {
    if (feature.properties.markerInfo == "build") {
        console.log(feature.properties.sitePicureFile);
        siteChange_Change(feature.properties.sitePicureFile, feature.properties.siteJsonFile)
    }
    else {
        console.log(feature.properties.pictureInfo.pictureFile);
        pictureChange(feature.properties.pictureInfo.pictureFile, feature.properties.markerInfo)
    }
}

//モーダル関連の処理
function modalOpen() {
    document.getElementById("validate_msg_LongitudeNum").innerHTML = "";
    document.getElementById("validate_msg_LatitudeNum").innerHTML = "";
    document.getElementById("validate_msg_siteName").innerHTML = "";
    document.getElementById("validate_msg_loadfile").innerHTML = "";
    document.getElementById('validate_msg_LongitudeNum').style.backgroundColor = '#ffffff';
    document.getElementById('validate_msg_LatitudeNum').style.backgroundColor = '#ffffff';
    document.getElementById('validate_msg_siteName').style.backgroundColor = '#ffffff';
    document.getElementById('easyModal').style.display = 'block';
}

const buttonClose = document.getElementById('modalClose');
buttonClose.addEventListener('click', modalClose);
function modalClose() {
    document.getElementById('easyModal').style.display = 'none';
}

document.getElementById('add2map').addEventListener('click', function () {

    if (document.getElementById("validate_msg_LongitudeNum").innerHTML == ""
        && document.getElementById("validate_msg_LatitudeNum").innerHTML == ""
        && document.getElementById("validate_msg_siteName").innerHTML == ""
        && document.getElementById("validate_msg_loadfile").innerHTML == ""
        && filesElement.value != ""
        && document.getElementById('siteName').value != "") {
        console.log("クリック")
        switch (document.getElementById("modalTitle").textContent) {
            case "MAPにSITE（場所）を追加する":
                //CGIに渡す値の準備
                var index5map = getINDEXfromIDs(mapIDs);
                var index5json = getINDEXfromIDs(jsonIDs);
                filename = filesElement.files[0].name;
                savePicFileOriginalNameElement.value = filesElement.files[0].name;
                savePicFileNameElement.value = filename.split('.').slice(0, -1).join('.') + "_" + index5map + "." + filename.split('.').pop();
                var newsite_jsonfilename = filename.split('.').slice(0, -1).join('.') + "_" + index5json + ".json";
                renewIDProcess("map", "ID.json", mapIDs, index5map, savePicFileNameElement.value);
                renewIDProcess("json", "ID.json", jsonIDs, index5json, newsite_jsonfilename);
                //global.geojsonに追加する値の準備
                newjson.properties.siteName = document.getElementById("siteName").value;
                newjson.properties.sitePicureFile = savePicFileNameElement.value;
                newjson.properties.siteJsonFile = newsite_jsonfilename;
                console.log(newjson);
                jsondata_original.features.push(newjson);
                replaceJsonFile("json", "globalmap.geojson", jsondata_original);
                var newsite_json = {
                    "type": "FeatureCollection",
                    "features": []
                }
                replaceJsonFile("json", newsite_jsonfilename, newsite_json);
                MapSetMarkers_Change(jsondata_original, jsondata_original.features.length - 1);
                break;
            case "MAPにVIEW（360）を追加する":
                //CGIに渡す値の準備
                var index5img = getINDEXfromIDs(imgIDs);
                filename = filesElement.files[0].name;
                savePicFileOriginalNameElement.value = filesElement.files[0].name;
                savePicFileNameElement.value = filename.split('.').slice(0, -1).join('.') + "_" + index5img + "." + filename.split('.').pop();
                renewIDProcess("img", "ID.json", imgIDs, index5img, savePicFileNameElement.value);
                //jsonに追加する値の準備
                newjson.properties.siteName = document.getElementById("siteName").value;
                newjson.properties.pictureInfo.pictureFile = savePicFileNameElement.value;
                newjson.properties.pictureInfo.picDate = document.getElementById("pictureDate").value;
                console.log(newjson);
                jsondata_original.features.push(newjson);
                replaceJsonFile("json", "globalmap.geojson", jsondata_original);
                MapSetMarkers_Change(jsondata_original, jsondata_original.features.length - 1);
                break;
            case "MAPにVIEW（2D）を追加する":
                //CGIに渡す値の準備
                var index5img = getINDEXfromIDs(imgIDs);
                filename = filesElement.files[0].name;
                savePicFileOriginalNameElement.value = filesElement.files[0].name;
                savePicFileNameElement.value = filename.split('.').slice(0, -1).join('.') + "_" + index5img + "." + filename.split('.').pop();
                renewIDProcess("img", "ID.json", imgIDs, index5img, savePicFileNameElement.value);
                //jsonに追加する値の準備
                newjson.properties.siteName = document.getElementById("siteName").value;
                newjson.properties.pictureInfo.pictureFile = savePicFileNameElement.value;
                newjson.properties.pictureInfo.picDate = document.getElementById("pictureDate").value;
                console.log(newjson);
                jsondata_original.features.push(newjson);
                replaceJsonFile("json", "globalmap.geojson", jsondata_original);
                MapSetMarkers_Change(jsondata_original, jsondata_original.features.length - 1);
                break;
            default:
                alert("エラーです。閉じてください")
        }
        //document.getElementById('create').submit();
        savePicFileProcess();
        modalClose();
    }
})


document.getElementById('LongitudeNum').addEventListener('input', function () {
    if (isNaN(document.getElementById('LongitudeNum').value)) {
        document.getElementById("validate_msg_LongitudeNum").innerHTML = "緯度・経度には数字のみを入力してください。";
        document.getElementById('LongitudeNum').style.backgroundColor = '#ff9f3d';
    } else {
        document.getElementById("validate_msg_LongitudeNum").innerHTML = "";
        document.getElementById('LongitudeNum').style.backgroundColor = '#ffffff';
    }
})

document.getElementById('LatitudeNum').addEventListener('input', function () {
    if (isNaN(document.getElementById('LatitudeNum').value)) {
        document.getElementById("validate_msg_LatitudeNum").innerHTML = "緯度・経度には数字のみを入力してください。";
        document.getElementById('LatitudeNum').style.backgroundColor = '#ff9f3d';
    } else {
        document.getElementById("validate_msg_LatitudeNum").innerHTML = "";
        document.getElementById('LatitudeNum').style.backgroundColor = '#ffffff';
    }
})

document.getElementById('siteName').addEventListener('change', function () {
    if (document.getElementById('siteName').value == "") {
        document.getElementById("validate_msg_siteName").innerHTML = "場所名を入力してください。（日本語可）";
        document.getElementById('siteName').style.backgroundColor = '#ff9f3d';
    } else {
        document.getElementById("validate_msg_siteName").innerHTML = "";
        document.getElementById('siteName').style.backgroundColor = '#ffffff';
    }
})

filesElement.addEventListener('change', function () {
    if (!filesElement.value.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/)) {
        document.getElementById("validate_msg_loadfile").innerHTML = "半角：英数記号で入力してください。（日本語不可）";
    } else {
        document.getElementById("validate_msg_loadfile").innerHTML = "";
    }
})



//最も若番の番号をIDファイルから取得する
async function getMapIDjson(IDfileURL) {
    const response = await fetch("./" + IDfileURL + '/ID.json', { cache: "no-store" });
    const IDs = await response.json();
    mapIDs = IDs;
}
async function getjsonIDjson(IDfileURL) {
    const response = await fetch("./" + IDfileURL + '/ID.json', { cache: "no-store" });
    const IDs = await response.json();
    jsonIDs = IDs;
}
async function getimgIDjson(IDfileURL) {
    const response = await fetch("./" + IDfileURL + '/ID.json', { cache: "no-store" });
    const IDs = await response.json();
    imgIDs = IDs;
}
function getINDEXfromIDs(IDs) {
    var checker = 0;
    var index_number = 0;
    while (checker == 0) {
        var flag = 0;
        index_number = index_number + 1;
        for (var i = 0; i < Object.keys(IDs).length; i++) {
            if (IDs[i].index == index_number) {
                flag = 1;
                break;
            }
        }
        if (flag == 0) {
            checker = 1;
        }
    }
    return index_number.toString().padStart(5, '0');
}

function renewIDProcess(saveIDJsonFileURL, saveIDJsonFileName, IDs, index, filename) {
    var saveIDJsonFileURLElement = document.getElementsByName('saveIDJsonFileURL')[0];
    var saveIDJsonFileNameElement = document.getElementsByName('saveIDJsonFileName')[0];
    var IDjsonTofileElement = document.getElementsByName('IDjsonTofile')[0];

    saveIDJsonFileURLElement.value = saveIDJsonFileURL;
    saveIDJsonFileNameElement.value = saveIDJsonFileName;
    var newID = {
        "index": Number(index),
        "filename": filename
    }
    IDs.push(newID);
    IDjsonTofileElement.value = JSON.stringify(IDs);

    const form = document.getElementById("renewID");
    const formData = new FormData(form);
    const action = form.getAttribute("action");
    const options = {
        method: 'POST',
        body: formData,
        cache: "no-store"
    };
    fetch(action, options).then((e) => {
        if (e.status === 200) {
            return
        }
    });
}

function replaceJsonFile(replaceJsonFileURL, replaceJsonFileName, replaceJsonTofile) {
    var replaceJsonFileURLElement = document.getElementsByName('replaceJsonFileURL')[0];
    var replaceJsonFileNameElement = document.getElementsByName('replaceJsonFileName')[0];
    var replaceJsonTofileElement = document.getElementsByName('replaceJsonTofile')[0];

    replaceJsonFileURLElement.value = replaceJsonFileURL;
    replaceJsonFileNameElement.value = replaceJsonFileName;
    replaceJsonTofileElement.value = JSON.stringify(replaceJsonTofile);

    const form = document.getElementById("replaceJson");
    const formData = new FormData(form);
    const action = form.getAttribute("action");
    const options = {
        method: 'POST',
        body: formData,
        cache: "no-store"
    };
    fetch(action, options).then((e) => {
        if (e.status === 200) {
            return
        }
    });
}

function deleteFileProcess(deleteFileURL, deleteFileName) {
    var deleteFileURLElement = document.getElementsByName('deleteFileURL')[0];
    var deleteFileNameElement = document.getElementsByName('deleteFileName')[0];

    deleteFileURLElement.value = deleteFileURL;
    deleteFileNameElement.value = deleteFileName;

    const form = document.getElementById("deletefile");
    const formData = new FormData(form);
    const action = form.getAttribute("action");
    const options = {
        method: 'POST',
        body: formData,
        cache: "no-store"
    };
    fetch(action, options).then((e) => {
        if (e.status === 200) {
            return
        }
    });
}

function savePicFileProcess() {
    const form = document.getElementById("create");
    const formData = new FormData(form);
    const action = form.getAttribute("action");
    const options = {
        method: 'POST',
        body: formData,
        cache: "no-store"
    };
    fetch(action, options).then((e) => {
        if (e.status === 200) {
            return
        }
    });
}