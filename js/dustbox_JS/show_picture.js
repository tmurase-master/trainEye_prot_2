// グローバル変数
var picture2D;
var picture2DminZoom = -1, picture2DmaxNativeZoom = 2, picture2DmaxZoom = 8;

window.addEventListener('load', function () {
  document.getElementById("3Dimg").style.display = 'block'
  document.getElementById("2Dimg").style.display = 'none'

  var img = new Image();
  img.src = './img/home2D_00001.jpg';
  img.addEventListener('load', function () {
    console.log(img.src + "を読み込み完了");
    pictureSet(img);
  });
})

function pictureChange(PicureFileName, markerInfo) {
  var pictureURL = "./img/" + PicureFileName;
  if (markerInfo == "3Dpic") {
    document.getElementById('3Dpicture').setAttribute('src', pictureURL);
    document.getElementById("3Dimg").style.display = 'block';
    document.getElementById("2Dimg").style.display = 'none';
  } else {
    document.getElementById('pictureSource').setAttribute('src', pictureURL);
    document.getElementById("3Dimg").style.display = 'none';
    document.getElementById("2Dimg").style.display = 'block';
    pictureChange2D(PicureFileName);
  }
}

function pictureChange2D(PicureFileName) {
  if (picture2D) {
    picture2D.remove();
  }
  var img = new Image();
  img.src = "./img/" + PicureFileName;
  img.addEventListener('load', function () {
      console.log(img.src + "を読み込み完了");
      pictureSet(img);
  });
}

function pictureSet(img) {
  var image = {
    url: img.src,
    width: img.width,
    height: img.height
  };
  picture2D = L.map('pictureSource', {
    crs: L.CRS.Simple,
    minZoom: picture2DminZoom,
    maxZoom: picture2DmaxZoom
  });
  var bounds = L.latLngBounds(
    picture2D.unproject([0, image.height], picture2DmaxNativeZoom),
    picture2D.unproject([image.width, 0], picture2DmaxNativeZoom)
  );
  picture2D.fitBounds(bounds);
  picture2D.setMaxBounds(bounds);
  L.imageOverlay(image.url, bounds).addTo(picture2D);
}