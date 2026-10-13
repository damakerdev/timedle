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

const MAX_GUESS=5;
const clockElem=document.getElementById("clock");
const selectedCountryElem=document.getElementById("selected-country")
const guessBtn= document.getElementById("guess-btn")
const winModal=document.getElementById("win")
const loseModal = document.getElementById("lose")
const playAgainBtns=document.querySelectorAll(".play-again");
const remainingGuess=document.getElementById("remaining-guesses");

let selTime=null;
let marker=null;
let guessCount=0;

remainingGuess.innerText=guessCount;

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
            if(data.countryName===""){
                selectedCountryElem.innerText="none";
                return;
            }
            console.log("country is "+data.countryName);
            selectedCountryElem.innerText=data.countryName
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


const res = await fetch("./timezone-names.json")
const tzArr=await res.json();
// console.log(tzArr[0]);
const choice=tzArr[Math.floor(Math.random()*tzArr.length)]
console.log(choice)
const toBeGuessed=setTimeBasedOnTimeZone(choice)
clockElem.innerText=toBeGuessed

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
    if(guessCount>=MAX_GUESS){
        console.log("its done..")
        guessBtn.disabled=true;
        return 0;
    } else {
        if(guessTime===toBeGuessed){
            console.log("CORRECT!!!");
            // winModal.classList.remove('hidden');
            return 2;
        } else {
            console.log("INCORRECT");
            // loseModal.classList.remove('hidden');
            return 1;
        }
    }
}

guessBtn.addEventListener('click',()=>{
    guessCount++;
    if(onGuess(selTime,guessCount)){
        remainingGuess.innerText=guessCount;
    }
});

playAgainBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
        window.location.reload()
    })
})

