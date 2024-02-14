const userWeather_btn = document.querySelector("[userWeather]");
const searchWeather_btn = document.querySelector("[searchWeather]");

const grant_access_tab = document.querySelector("[grantAccess]");
const search_tab = document.querySelector("[searchTab]");
const weatherDescTab = document.querySelector("[weatherDescTab_page]");
const loading_page = document.querySelector("[loading_tab]");
const error_tab = document.querySelector("[error_page]");

const API_KEY = "f54126082d12586a34d5fe7f314bb237";

let current_btn = userWeather_btn;
current_btn.classList.add("current_tab");

getFromSession_storage();


function switch_tab(clicked_tab){

    if(current_btn != clicked_tab){

        current_btn.classList.remove("current_tab");
        current_btn = clicked_tab;
        current_btn.classList.add("current_tab");

        if(!search_tab.classList.contains("active")){

            weatherDescTab.classList.remove("active");
            grant_access_tab.classList.remove("active");
            error_tab.classList.remove("active");

            search_tab.classList.add("active");
        }

        else{

            search_tab.classList.remove("active");
            weatherDescTab.classList.remove("active");
            error_tab.classList.remove("active");

            getFromSession_storage();
        }
    }
}



userWeather_btn.addEventListener("click",()=>{

    switch_tab(userWeather_btn);
});

searchWeather_btn.addEventListener("click",()=>{

    switch_tab(searchWeather_btn);
});


function getFromSession_storage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){

        grant_access_tab.classList.add("active");
    }

    else{

        const coordinates = JSON.parse(localCoordinates);

        fetch_coordinates(coordinates);
    }

}

async function fetch_coordinates(coordinates){

    let {lat,lon} = coordinates;

    error_tab.classList.remove("active");
    grant_access_tab.classList.remove("active");
    loading_page.classList.add("active");

    try {
        
        let respose = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        let data = await respose.json();

        
        loading_page.classList.remove("active");
        weatherDescTab.classList.add("active");
        render_weather_info(data);

    } catch (error) {
        
        loading_page.classList.remove("active");
        error_tab.classList.add("active");
    }

}


function render_weather_info(data){

    const cityName = document.querySelector(".city_name");

    const flag = document.querySelector(".flag_icon");
    const weathertype = document.querySelector(".weather_type");
    const weather_type_icon = document.querySelector(".weather_type_icon");
    const temperature = document.querySelector(".city_temp");

    const windspeed_data = document.querySelector(".WindSpeed_data");
    const humidity_data = document.querySelector(".Humidity_data");
    const cloud_data = document.querySelector(".cloud_data");

    cityName.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;

    weathertype.innerText = data?.weather?.[0]?.description;
    weather_type_icon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temperature.innerText = data?.main?.temp;
    windspeed_data.innerText = data?.wind?.speed;
    humidity_data.innerText = data?.main?.humidity;
    cloud_data.innerText = data?.clouds?.all;

}



function getLocation(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        
        alert("navigator is not present give access to your browser or change browser");
    }
}

function showPosition(position){
    
    let userCoordinates = {
        
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    
    fetch_coordinates(userCoordinates);
}

const grantAccess_tab = document.querySelector("[data_grantAccess]");
grantAccess_tab.addEventListener("click",getLocation);


const search_input_name = document.querySelector(".search_tab_input");

search_tab.addEventListener("submit",(e)=>{

    e.preventDefault();
    let cityname = search_input_name.value;

    if(cityname === ""){
       
        return;
    }
    else{

        getCityWeather_data(cityname);
    }
});

async function getCityWeather_data(city){

    // error_tab.classList.remove("active");
    loading_page.classList.add("active");
    grant_access_tab.classList.remove("active");
    weatherDescTab.classList.remove("active");

    try {
        
        const respose = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await respose.json();
        
        loading_page.classList.remove("active");
        weatherDescTab.classList.add("active");

        render_weather_info(data);


    } catch (error) {
        
        loading_page.classList.remove("active");
        error_tab.classList.add("active");
    }
}




















