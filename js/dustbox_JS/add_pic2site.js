// 初期ロード時に実行されるjavascript
// 2023.3.31
var site_change;
var site_jsondata_original;
var site_jsonfilename;
var site_markers_def = [];

function siteChange_Change(sitePicureFileName, siteJsonFile) {
    if (site_change) {
        site_change.remove();
    }
    var img = new Image();
    img.src = "./map/" + sitePicureFileName;
    img.addEventListener('load', function () {
        console.log(img.src + "を読み込み完了");
        site_jsonfilename = siteJsonFile;
        siteSet_Change(img);
        getJsonFileAndSetMarkers_Change("./json/" + siteJsonFile);
    });
}

function siteSet_Change(img) {
    console.log(img.src + "のmap画像を読み込み");
    var image = {
        url: img.src,
        width: img.width,
        height: img.height
    };
    site_change = L.map('osmsite_change', {
        crs: L.CRS.Simple,
        minZoom: minZoom,
        maxZoom: maxZoom,
        contextmenu: true,
        contextmenuWidth: 250,
        contextmenuItems: [{
            text: 'ココに「360画像」を配置する',
            callback: function (e) {
                Create3DpicMarker_SITE(e)
            }
        }, {
            text: 'ココに「2D画像」を配置する',
            callback: function (e) {
                Create2DpicMarker_SITE(e)
            }
        }]
    });
    var bounds = L.latLngBounds(
        site_change.unproject([0, image.height], maxNativeZoom),
        site_change.unproject([image.width, 0], maxNativeZoom)
    );
    site_change.fitBounds(bounds);
    site_change.setMaxBounds(bounds);
    L.imageOverlay(image.url, bounds).addTo(site_change);
}

function Create3DpicMarker_SITE(marker) {
    document.getElementById('pictureDateTitle').style.display = 'block';
    document.getElementById('pictureDate').style.display = 'block';
    document.getElementById('add2map').style.display = 'none';
    document.getElementById('add2site').style.display = 'block';
    document.getElementById("modalTitle").textContent = "SITEにVIEW（360）を追加する";
    document.getElementById("siteName").value = '';

    //cgiにて動的にファイルを編集するための事前準備
    savePicFileURLElement.value = 'img';
    savePicFileNameElement.value = '';
    filesElement.value = '';

    const xy = latLng2point_Change(marker.latlng);
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
                xy.x,
                xy.y
            ],
            "type": "Point"
        }
    }
    document.getElementById("LongitudeNum").value = Math.round(xy.x);
    document.getElementById("LatitudeNum").value = Math.round(xy.y);
}

function Create2DpicMarker_SITE(marker) {
    document.getElementById('pictureDateTitle').style.display = 'block';
    document.getElementById('pictureDate').style.display = 'block';
    document.getElementById('add2map').style.display = 'none';
    document.getElementById('add2site').style.display = 'block';
    document.getElementById("modalTitle").textContent = "SITEにVIEW（2D）を追加する";
    document.getElementById("siteName").value = '';

    //cgiにて動的にファイルを編集するための事前準備
    savePicFileURLElement.value = 'img';
    savePicFileNameElement.value = '';
    filesElement.value = '';

    const xy = latLng2point_Change(marker.latlng);
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
                xy.x,
                xy.y
            ],
            "type": "Point"
        }
    }
    document.getElementById("LongitudeNum").value = Math.round(xy.x);
    document.getElementById("LatitudeNum").value = Math.round(xy.y);
}

function point2latLng_Change(point) {
    if (L.Util.isArray(point[0])) {
        var latLngs = [];
        for (var i = 0, len = point.length; i < len; i++) {
            latLngs[i] = site_change.unproject(point[i], maxNativeZoom);
        }
        return latLngs;
    }
    return site_change.unproject(point, maxNativeZoom);
}

function latLng2point_Change(latLng) {
    if (L.Util.isArray(latLng[0])) {
        var point = [];
        for (var i = 0, len = latLng.length; i < len; i++) {
            point[i] = site_change.unproject(latLng[i], maxNativeZoom);
        }
        return point;
    }
    return site_change.project(latLng, maxNativeZoom);
}

function SiteSetMarkers_Change(jsondata, markerNum) {
    var myIcon = L.icon({
        iconUrl: './images/' + jsondata.features[markerNum].properties.markerIcon,
        shadowUrl: './images/marker-shadow.png',
        iconAnchor: [20, 40],
        iconSize: [40, 40]
    })
    var str = jsondata.features[markerNum].properties.siteName;
    str = str + "<br>" + jsondata.features[markerNum].properties.pictureInfo.twoORthree
        + "<br>" + "撮影日：" + jsondata.features[markerNum].properties.pictureInfo.picDate;
    site_markers_def[markerNum] = L.marker(point2latLng_Change(jsondata.features[markerNum].geometry.coordinates),
        {
            draggable: 'true',
            contextmenu: true,
            contextmenuWidth: 180,
            contextmenuItems: [{
                text: 'このアイコンに登録された情報をすべて削除',
                index: 0,
                callback: function () {
                    SiteDeleteMaker(jsondata, markerNum)
                }
            }, {
                separator: true,
                index: 1
            }]
        });
    site_markers_def[markerNum].bindTooltip(str, { direction: 'top', offset: L.point(0, -10) })
    site_markers_def[markerNum].setIcon(myIcon);
    site_markers_def[markerNum].bindTooltip(str, { direction: 'top', offset: L.point(0, -10) })
    site_markers_def[markerNum].on('mouseup', function (e) {
        site_update_coord_references(site_change, this, e.latlng, jsondata, markerNum);
    });
    site_markers_def[markerNum].on('click', function () { SiteClickEvent_Change(jsondata, markerNum) });
    site_markers_def[markerNum].addTo(site_change);

}

function SiteDeleteMaker(jsondata, markerNum) {
    //まず注意喚起。（特にbuildを消すと結構致命的）
    switch (jsondata.features[markerNum].properties.markerInfo) {
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
    SitereplaceALLMarker(jsondata)
    site_jsondata_original = jsondata;
    replaceJsonFile("json", site_jsonfilename, site_jsondata_original);

}

function SitereplaceALLMarker(jsondata) {
    //マップ上のマーカー初期化
    for (var i = 0, len = site_markers_def.length; i < len; i++) {
        site_change.removeLayer(site_markers_def[i]);
    }
    site_markers_def = [];
    for (var i = 0, len = jsondata.features.length; i < len; i++) {
        console.log(jsondata.features[i].properties.pictureInfo.pictureFile)
        console.log(jsondata.features[i].geometry.coordinates)
        SiteSetMarkers_Change(jsondata, i)
    }
    console.log(jsondata);
}

function site_update_coord_references(map, marker, latLng, jsondata, markerNum) {
    const xy = latLng2point_Change(latLng);
    jsondata.features[markerNum].geometry.coordinates = latLng2point_Change(latLng);
    site_jsondata_original = jsondata;
    replaceJsonFile("json", site_jsonfilename, site_jsondata_original);
}

function SiteClickEvent_Change(jsondata, markerNum) {
    console.log(jsondata.features[markerNum].properties.pictureInfo.pictureFile);
    pictureChange(jsondata.features[markerNum].properties.pictureInfo.pictureFile, jsondata.features[markerNum].properties.markerInfo)
}

function SiteData_OnLoad_byJson_Change(jsondata) {
    site_jsondata_original = jsondata;
    for (var i = 0, len = jsondata.features.length; i < len; i++) {
        console.log(jsondata.features[i].properties.pictureInfo.pictureFile)
        console.log(jsondata.features[i].geometry.coordinates)
        SiteSetMarkers_Change(jsondata, i)
    }
    console.log(jsondata);
}

async function getJsonFileAndSetMarkers_Change(jsonFilePath) {
    const response = await fetch(jsonFilePath, { cache: "no-store" });
    const members = await response.json();
    SiteData_OnLoad_byJson_Change(members);
}

document.getElementById('add2site').addEventListener('click', function () {
    if (document.getElementById("validate_msg_LongitudeNum").innerHTML == ""
        && document.getElementById("validate_msg_LatitudeNum").innerHTML == ""
        && document.getElementById("validate_msg_siteName").innerHTML == ""
        && document.getElementById("validate_msg_loadfile").innerHTML == ""
        && filesElement.value != ""
        && document.getElementById('siteName').value != "") {
        console.log("クリック")
        switch (document.getElementById("modalTitle").textContent) {
            case "SITEにVIEW（360）を追加する":
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
                site_jsondata_original.features.push(newjson);
                replaceJsonFile("json", site_jsonfilename, site_jsondata_original);
                SiteSetMarkers_Change(site_jsondata_original, site_jsondata_original.features.length - 1);
                break;
            case "SITEにVIEW（2D）を追加する":
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
                site_jsondata_original.features.push(newjson);
                replaceJsonFile("json", site_jsonfilename, site_jsondata_original);
                SiteSetMarkers_Change(site_jsondata_original, site_jsondata_original.features.length - 1);
                break;
            default:
                alert("エラーです。閉じてください")
        }
        //document.getElementById('create').submit();
        savePicFileProcess();
        modalClose();
    }
})