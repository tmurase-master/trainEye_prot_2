// 初期ロード時に実行されるjavascript
// 2023.3.31
var site;
var minZoom = -1, maxNativeZoom = 2, maxZoom = 8;
function siteChange(sitePicureFileName, siteJsonFile) {
    if (site) {
        site.remove();
    }
    var img = new Image();
    img.src = "./map/" + sitePicureFileName;
    img.addEventListener('load', function () {
        console.log(img.src + "を読み込み完了");
        siteSet(img);
        getJsonFileAndSetMarkers("./json/" + siteJsonFile);
    });
}

function siteSet(img) {
    console.log(img.src + "のmap画像を読み込み");
    var image = {
        url: img.src,
        width: img.width,
        height: img.height
    };
    site = L.map('osmsite', {
        crs: L.CRS.Simple,
        minZoom: minZoom,
        maxZoom: maxZoom
    });
    var bounds = L.latLngBounds(
        site.unproject([0, image.height], maxNativeZoom),
        site.unproject([image.width, 0], maxNativeZoom)
    );
    site.fitBounds(bounds);
    site.setMaxBounds(bounds);
    L.imageOverlay(image.url, bounds).addTo(site);
}

function point2latLng(point) {
    if (L.Util.isArray(point[0])) {
        var latLngs = [];
        for (var i = 0, len = point.length; i < len; i++) {
            latLngs[i] = site.unproject(point[i], maxNativeZoom);
        }
        return latLngs;
    }
    return site.unproject(point, maxNativeZoom);
}

function SetMarkers(jsondata, markerNum) {
    var myIcon = L.icon({
        iconUrl: './images/' + jsondata.features[markerNum].properties.markerIcon,
        shadowUrl: './images/marker-shadow.png',
        iconAnchor:[20,40],
        iconSize: [40, 40]
    })
    var str = jsondata.features[markerNum].properties.siteName;
    str = str + "<br>" + jsondata.features[markerNum].properties.pictureInfo.twoORthree
        + "<br>" + "撮影日：" + jsondata.features[markerNum].properties.pictureInfo.picDate;
    L.marker(point2latLng(jsondata.features[markerNum].geometry.coordinates),
        { icon: myIcon })
        .bindTooltip(str).openTooltip()
        .on('click', function () { SiteClickEvent(jsondata, markerNum) })
        .addTo(site)
}

function SiteClickEvent(jsondata, markerNum) {
    console.log(jsondata.features[markerNum].properties.pictureInfo.pictureFile);
    pictureChange(jsondata.features[markerNum].properties.pictureInfo.pictureFile, jsondata.features[markerNum].properties.markerInfo)
}

function Data_OnLoad_byJson(jsondata) {
    for (var i = 0, len = jsondata.features.length; i < len; i++) {
        console.log(jsondata.features[i].properties.pictureInfo.pictureFile)
        console.log(jsondata.features[i].geometry.coordinates)
        SetMarkers(jsondata, i)
    }
    console.log(jsondata);
}

async function getJsonFileAndSetMarkers(jsonFilePath) {
    const response = await fetch(jsonFilePath, { cache: "no-store" });
    const members = await response.json();
    Data_OnLoad_byJson(members);
}