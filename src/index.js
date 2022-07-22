//const axios = require('axios').default;
let apiKey = "255fecacd03f64ca1a7cf258d739df89";

var date = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

let city = "";
let units = "metric";
let temp = 0.0;
let wind = 0.0;

function dateFill(timestamp) {
  var now;
  if (timestamp != null) {
      now = new Date(timestamp * 1000);
  } else {
      now = new Date();
  }
  var dateDisplay = document.querySelector("#date-display");
  var minits = "00";
  var hours = "00";
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
  var dateString = `( updated at ${date[now.getDay() - 1]}, ${hours}:${minits} )`;
  dateDisplay.innerHTML = dateString;
}

function getWeather(resp) {
  temp = resp.data.main.temp;
  city = resp.data.name;
  wind = resp.data.wind.speed;
  var currTemp = document.querySelector("#curr-temp");
  currTemp.innerHTML = temp;
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
        tVal = tmp.innerHTML;  
        tVal = 32 + (tVal * 9) / 5;
        tVal = Math.round(tVal * 10) / 10;
        tmp.innerHTML = tVal;
      });
      wind = 2.236 * wind;
      windElm.innerHTML = Math.round(wind * 100) / 100;
      cLink.classList.remove("active");
      fLink.classList.add("active");
      units = "imperial";
    }
  } else {
    //Convert to metric/Celsius
    if (target.id == "cls") {
      tempList.forEach((tmp) => {
        tVal = tmp.innerHTML;  
        tVal = ((tVal - 32) * 5) / 9;
        tVal = Math.round(tVal * 10) / 10;
        tmp.innerHTML = tVal;
      });
      wind = wind / 2.236;
      windElm.innerHTML = Math.round(wind * 100) / 100;
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