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
map.addControl(new maplibregl.AttributionControl(),'bottom-left')
map.addControl(new maplibregl.NavigationControl(), 'top-right')
map.addControl(new maplibregl.GlobeControl(),'top-right')

const clockElem=document.getElementById("clock");
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
    
    marker= new maplibregl.Marker()
        .setLngLat([long,lat])
        .addTo(map)
}

map.on('click',mapClick)

