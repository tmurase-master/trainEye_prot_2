window.addEventListener('load', function () {
    var img = new Image();
    img.src = './map/site_sample_00001.jpg';
    img.addEventListener('load', function () {
        console.log(img.src + "を読み込み完了");
        siteSet(img);
        getJsonFileAndSetMarkers("./json/" + 'site_sample_00001.json');
    });
})