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
const historyDiv = document.getElementById('guess-history')

let selTime=null;
let marker=null;
let guessCount=0;
let gameOver=null;
let gameWon=null;
let targetInterval=null;
let selTz=null;

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
            selTz=tzone;
            console.log(selTz)
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
let toBeGuessed=setTimeBasedOnTimeZone(choice)
clockElem.innerText=toBeGuessed;

targetInterval = setInterval(() => {
    toBeGuessed=setTimeBasedOnTimeZone(choice)
    clockElem.innerText=toBeGuessed
}, 1000);

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

const popupContainer=document.createElement('div')
popupContainer.className='popup-container';
document.body.appendChild(popupContainer);

function showPopup(msg,clr){
    const popup=document.createElement('div')
    popup.className='popup';
    popup.innerText=msg;
    popupContainer.appendChild(popup);
    popup.classList.remove('hidden')
    switch(clr){
        case 'red':
            popup.style.backgroundColor='#e02619';
            break;
        case 'green':
            popup.style.backgroundColor='#19e062'
            break;
        case 'blue':
            popup.style.backgroundColor='#194ee0'
            break;
        default:
            break;
    }
    requestAnimationFrame(()=>{
        popup.classList.add('fade')
    })
    setTimeout(() => {
        popup.classList.remove('fade')
        popup.addEventListener('transitionend',()=>{
            popup.classList.add('hidden')
            popup.remove()
        },{once:true})
    }, 1500);
}

//target tzone ra utc diff in mins
function findTimezoneOffset(tz,date=new Date()){
    const utc=new Date(date.toLocaleString('en-US',{timeZone: 'UTC'}))
    const tzDate = new Date(date.toLocaleString('en-US',{ timeZone: tz}))
    console.log((tzDate-utc)/60000)
    return (tzDate-utc)/60000;
}


function directionHint(targetTz, guessTz){
    const targetOffset= findTimezoneOffset(targetTz)
    const guessedOffset = findTimezoneOffset(guessTz)

    const minDiff= targetOffset-guessedOffset;
    console.log(minDiff);
    let hrDiff=Math.abs(Math.floor(minDiff/60));
    let finalminDiff=Math.abs(minDiff%60);
    if(minDiff===0){
        return "Spot on!!! "
    } else if(minDiff>0){
        return `${hrDiff}h ${finalminDiff}min East ➡️`
    } else {
        return `${hrDiff}h ${finalminDiff}min West ⬅️`
    }
}

function onGuess(guessTime,count,guessedCountry,hintDirn){
    if(historyDiv){

        if(historyDiv.querySelector('p')){
            historyDiv.querySelector('p').remove();
        }

        const card=document.createElement('div')
        card.className='guess-history-card'
        card.innerHTML=`
            <span class="country-name">${guessCount}. ${guessedCountry}</span>
            <span class="hint">${hintDirn}</span>
        `;
        historyDiv.prepend(card)
    }
    if(guessTime===toBeGuessed){
        console.log("CORRECT!!!");
        winModal.classList.remove('hidden');
        showPopup('Correct','green');
        gameOver=true;
        gameWon=true;
        return 1;
    } else {
        console.log("INCORRECT");
        if(count>=MAX_GUESS){
            showPopup(`Incorrect. No tries remaining`,'red');
        } else {
            showPopup(`Incorrect. You have ${MAX_GUESS-guessCount} tries remaining`,'red');
        }
        gameOver=false;
        return 2;
    }
    
}

guessBtn.addEventListener('click',()=>{
    if(gameOver) return;
    guessCount++;
    remainingGuess.innerText=guessCount;

    if(!selTz || !selTime){
        showPopup('Please try again!',"blue");
        return;
    }

    const currCountry = selectedCountryElem.innerText||'none';
    const hintTxt = directionHint(choice,selTz)

    onGuess(selTime,guessCount,currCountry,hintTxt)

    if(guessCount>=MAX_GUESS){
        guessBtn.disabled=true;
        console.log("its done..")
        if(gameWon===null){
            loseModal.classList.remove('hidden');
        }
        gameOver=true;
        return 0;
    }
    console.log(guessCount)
});

playAgainBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
        window.location.reload()
    })
})

