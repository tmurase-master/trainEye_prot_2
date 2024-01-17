// 初期ロード時に実行される
// 2023.3.31
window.addEventListener('load', function () {
    map_change = L.map('osmmap_change', {
        contextmenu: true,
        contextmenuWidth: 250,
        contextmenuItems: [{
            text: 'ココに「建物」を配置する',
            callback: function (e) {
                CreateBuildMarker(e)
            }
        }, {
            text: 'ココに「360画像」を配置する',
            callback: function (e) {
                Create3DpicMarker(e)
            }
        }, {
            text: 'ココに「2D画像」を配置する',
            callback: function (e) {
                Create2DpicMarker(e)
            }
        }]
    });
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
    }).addTo(map_change);
    map_change.setView([34.9724, 138.3893], 11);
    getJsonFile_Change("./json/" + 'globalmap.geojson');
    getMapIDjson("map");
    getjsonIDjson("json");
    getimgIDjson("img");

    //今日の日時を表示
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var toTwoDigits = function (num, digit) {
        num += ''
        if (num.length < digit) {
            num = '0' + num
        }
        return num
    }

    var yyyy = toTwoDigits(year, 4)
    var mm = toTwoDigits(month, 2)
    var dd = toTwoDigits(day, 2)
    var ymd = yyyy + "-" + mm + "-" + dd;

    document.getElementById("pictureDate").value = ymd;
    document.getElementById('easyModal').style.display = 'none';


})