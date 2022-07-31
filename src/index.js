//const axios = require('axios').default;
let apiKey = "255fecacd03f64ca1a7cf258d739df89";

let date = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

let city = "";
let units = "metric";
let temp = 0.0;
let wind = 0.0;

function getDayFormated(tStamp) {
  var now;
  if (tStamp != null) {
      now = new Date(tStamp * 1000);
  } else {
      now = new Date();
  }
  return date[now.getDay()];
}

function getTimeFormated(tStamp) {
  var now;
  var minits = "00";
  var hours = "00";
  if (tStamp != null) {
    now = new Date(tStamp * 1000);
  } else {
    now = new Date();
  }
  if (now.getMinutes() < 10) {
      minits = "0" + now.getMinutes();
  } else {
      minits = now.getMinutes();
  }
  if (now.getHours() < 10) {
      hours = "0" + now.getHours();
  } else {
      hours = now.getHours();
  }
  return `${hours}:${minits}`;
}

function dateFill(timestamp) {
  var dateDisplay = document.querySelector("#date-display");
  var dateString = `( updated at ${getDayFormated(timestamp)}, ${getTimeFormated(timestamp)})`;
  dateDisplay.innerHTML = dateString;
}

function getWeather(resp) {
  temp = resp.data.main.temp;
  city = resp.data.name;
  wind = resp.data.wind.speed;
  var currTemp = document.querySelector("#curr-temp");
  currTemp.innerHTML = temp + "°";
  var currWSpeed = document.querySelector("#curr-wind");
  currWSpeed.innerHTML = wind;
  var cityDisplay = document.querySelector("#city-display");
  cityDisplay.innerHTML = `At ${city} today`;
  var wIconId = resp.data.weather[0].icon;
  var wIcon = `http://openweathermap.org/img/wn/${wIconId}@2x.png`;
  var imgElm = document.querySelector("#weather-icon");
  imgElm.setAttribute("src", wIcon);
  imgElm.setAttribute("alt", resp.data.weather[0].main);
  dateFill(resp.data.dt);
  //var coord = resp.data.coord;
  var forecastUrl=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(forecastUrl).then(getForecastWeather);
}

function getForecastWeather(forecastWeather) {
  var elm = new Object();
  var fcElmCont = "";
  let fcHTML = "";
  var fcDay;
  //var fcTempr;
  var fcTmpMax = -1000, fcTmpMin = 1000;
  var fcWthrId = "";
  var fcIconUrl = `http://openweathermap.org/img/wn/$wIconId@2x.png`;
  for (let i = 12; i <= 36; i = i + 8) {
    elm = forecastWeather.data.list[i];
    fcDay = getDayFormated(elm.dt);
    //Serchin min/max forecast temperature
    for (let fcIndx = (i-4); fcIndx <= (i+3); fcIndx++) {
      const fcElm = forecastWeather.data.list[fcIndx];
      if (fcTmpMax < fcElm.main.temp_max) {
        fcTmpMax = fcElm.main.temp_max;
      }
      if (fcTmpMin > fcElm.main.temp_min) {
        fcTmpMin = fcElm.main.temp_min;
      }
    }
    fcTmpMin = Math.round(fcTmpMin);
    fcTmpMax = Math.round(fcTmpMax);
    fcWthrId = elm.weather[0].icon;
    var weatherDesc = elm.weather[0].main;
    fcIconUrl = `http://openweathermap.org/img/wn/${fcWthrId}@2x.png`;
    fcElmCont = 
    `<div class="col weather-box">
       <h2>${fcDay}</h2>
       <h3>
          <img src="http://openweathermap.org/img/wn/${fcWthrId}@2x.png" height="64" alt="${weatherDesc}" title="${weatherDesc}"><br>
          <span class="temperature-display" id="max-temperature">${fcTmpMax}°</span>
          <span class="temperature-display" id="min-temperature">${fcTmpMin}°</span> 
       </h3>
     </div>`;  
    fcHTML += fcElmCont;
    var fcElm = document.querySelector("#forecast-elements");
    fcElm.innerHTML = fcHTML;
  }
}


function select(event) {
  event.preventDefault();
  var input = document.querySelector("input");
  city = input.value;
  var cityDisplay = document.querySelector("#city-display");
  var weatherQueryStr = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  if (city) {
    axios.get(weatherQueryStr).then(getWeather);
  } else {
    alert("Try again to type city name!");
  }
}

let form = document.querySelector("#city-selector-form");
form.addEventListener("submit", select);

function tempConvert(event) {
  event.preventDefault();
  var target = event.target;
  var tempList = document.querySelectorAll(".temperature-display");
  var windElm = document.querySelector("#curr-wind");
  var tVal = 0;
  var fLink = document.querySelector("#frn");
  var cLink = document.querySelector("#cls");
  if (units == "metric") {
    //Convert to imperial/Fahrenheit
    if (target.id == "frn") {
      tempList.forEach((tmp) => {
        tVal = tmp.innerHTML.slice(0,-1);
        tVal = 32 + (tVal * 9) / 5;
        tVal = Math.round(tVal * 10) / 10;
        tmp.innerHTML = (tVal + "°");
      });
      wind = 2.236 * wind;
      windElm.innerHTML = Math.round(wind * 10) / 10;
      cLink.classList.remove("active");
      fLink.classList.add("active");
      units = "imperial";
    }
  } else {
    //Convert to metric/Celsius
    if (target.id == "cls") {
      tempList.forEach((tmp) => {
        tVal = tmp.innerHTML.slice(0,-1);  
        tVal = ((tVal - 32) * 5) / 9;
        tVal = Math.round(tVal * 10) / 10;
        tmp.innerHTML = (tVal + "°");
      });
      wind = wind / 2.236;
      windElm.innerHTML = Math.round(wind * 10) / 10;
      fLink.classList.remove("active");
      cLink.classList.add("active");
      units = "metric";
    }
  }
}

function weatherInLocation(resp) {
  var lon = resp.coords.longitude;
  var lat = resp.coords.latitude;
  var weatherQueryStr = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(weatherQueryStr).then(getWeather);
}

function currLocWeather() {
  navigator.geolocation.getCurrentPosition(weatherInLocation);
}

var cBtn = document.querySelector("#curr-location-button");
cBtn.addEventListener("click", currLocWeather);

var anc = document.querySelector("#cls");
anc.addEventListener("click", tempConvert);
anc = document.querySelector("#frn");
anc.addEventListener("click", tempConvert);

currLocWeather();