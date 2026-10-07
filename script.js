import {LeafletMap, TileLayer} from 'leaflet';
const map = new LeafletMap('map').setView([0,0], 1);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    minZoom:2,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function mapClick(e){
    console.log('click on map'+e.latlng);
}

map.on('click',mapClick)
