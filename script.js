import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.13.0/dist/maplibre-gl.mjs'

const map = new maplibregl.Map({
    container:'map',
    style: 'https://demotiles.maplibre.org/style.json',
    
    //https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json nice one

    center: [80,30],
    zoom: 2,
    minZoom: 1,
    maxZoom: 5,
    attributionControl: false
})
map.addControl(new maplibregl.AttributionControl(),'top-right')
map.addControl(new maplibregl.NavigationControl(), 'top-right')
map.addControl(new maplibregl.GlobeControl(),'top-right')

const clockElem=document.getElementById("clock");
const selectedCountryElem=document.getElementById("selected-country")
const guessBtn= document.getElementById("guess-btn")
const winModal=document.getElementById("win")
const loseModal = document.getElementById("lose")
const playAgainBtns=document.querySelectorAll(".play-again");

let selTime=null;
let marker=null;

function mapClick(e){
    // console.log('click on map'+e.latlng);
    const lat=e.lngLat.wrap().lat;
    const long=e.lngLat.wrap().lng;
    if(marker){
        marker.remove();
    }
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
        .then(res=>res.json())
        .then(data=>{
            console.log("country is "+data.countryName);
            selectedCountryElem.innerText=data.countryName;
        })
        .catch(error=>console.error("error:"+error))

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=auto&current_weather=true`)
        .then(res=>res.json())
        .then(data=>{
            // console.log("current timezone is "+data.timezone)
            const tzone=data.timezone;
            // console.log(tzone);  
            const localtime=new Intl.DateTimeFormat('en-US',{
                timeZone:tzone,
                hour:'2-digit',
                minute:'2-digit',
                hour12:true
            }).format(new Date())
            console.log(`localtime is: ${localtime}`)
            // clockElem.innerText=localtime;
            selTime=localtime;
        })
        .catch(error=>console.error("error:"+error))
    
    marker= new maplibregl.Marker()
        .setLngLat([long,lat])
        .addTo(map)
}

map.on('click',mapClick)

clockElem.innerText=setTimeBasedOnTimeZone('Asia/Kathmandu')

function setTimeBasedOnTimeZone(tzone){
    let curr_time=new Intl.DateTimeFormat('en-US',{
        timeZone:tzone,
        hour:'2-digit',
        minute:'2-digit',
        hour12:true
    }).format(new Date())
    return curr_time;
    // console.log(curr_time)
}
// setTimeBasedOnTimeZone('Asia/Kathmandu')

function onGuess(guessTime){
    const toBeGuessed=setTimeBasedOnTimeZone('Asia/Kathmandu')
    if(guessTime===toBeGuessed){
        console.log("CORRECT!!!");
        winModal.classList.remove('hidden');
    } else {
        console.log("INCORRECT");
        loseModal.classList.remove('hidden');
    }
}

guessBtn.addEventListener('click',()=>{
    onGuess(selTime)
});

playAgainBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
        window.location.reload()
    })
})