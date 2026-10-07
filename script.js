import {LeafletMap, TileLayer} from 'leaflet';
const map = new LeafletMap('map').setView([0,0], 1);

const clockElem=document.getElementById("clock");

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    minZoom:2,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function mapClick(e){
    // console.log('click on map'+e.latlng);
    const lat=e.latlng.lat;
    const long=e.latlng.lng;
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
        .then(res=>res.json())
        .then(data=>{
            console.log("country is "+data.countryName);
        })
        .catch(error=>console.error("error:"+error))

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=auto&current_weather=true`)
        .then(res=>res.json())
        .then(data=>{
            // console.log("current timezone is "+data.timezone)
            const tzone=data.timezone;
            const localtime=new Intl.DateTimeFormat('en-US',{
                timeZone:tzone,
                hour:'2-digit',
                minute:'2-digit',
                hour12:true
            }).format(new Date())
            console.log(`localtime is: ${localtime}`)
            clockElem.innerText=localtime;
        })
        .catch(error=>console.error("error:"+error))
}

map.on('click',mapClick)
