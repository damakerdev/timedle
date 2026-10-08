import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.13.0/dist/maplibre-gl.mjs';

const map = new maplibregl.Map({
    container:'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [0,0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 5,
    attributionControl: false
})

map.addControl(new maplibregl.AttributionControl(),'top-left')
map.addControl(new maplibregl.NavigationControl(), 'top-right')
const clockElem=document.getElementById("clock");

function mapClick(e){
    // console.log('click on map'+e.latlng);
    const lat=e.lngLat.lat;
    const long=e.lngLat.lng;
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
