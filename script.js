import {LeafletMap, TileLayer} from 'leaflet';
const map = new LeafletMap('map').setView([0,0], 1);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    minZoom:2,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function mapClick(e){
    console.log('click on map'+e.latlng);
    const lat=e.latlng.lat;
    const long=e.latlng.lng;
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
        .then(res=>res.json())
        .then(data=>{
            console.log("country is "+data.countryName);
        })
        .catch(error=>console.error("error:"+error))

    fetch(`https://timeapi.io/api/v1/time/current/coordinate?latitude=${lat}&longitude=${long}`)
        .then(res=>res.json())
        .then(data=>{
            console.log("current time is "+data.time)
        })
        .catch(error=>console.error("error:"+error))
}

map.on('click',mapClick)
