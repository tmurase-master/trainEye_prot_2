// 初期ロード時に実行されるjQuery
// 2023.3.31
window.addEventListener('load', function () {
  map = L.map("osmmap",{
    preferCanvas:true
  });
  new L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
  }).addTo(map);
  map.setView([35.145526, 138.641722], 11);
  //loadGPXdataToMap();
  loadInitialEquipment();
  currentPos();
  loadKiloGISFile();
  loadMovieGISFile();
  //createAllarr();
})
