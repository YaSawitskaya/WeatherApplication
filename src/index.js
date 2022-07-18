const axios = require('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js').default;
let apiKey = "255fecacd03f64ca1a7cf258d739df89";

let temperatureIn = "C";
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
let metric = "metric";
let temp = 0.0;

function dateFill() {
  var dateDisplay = document.querySelector("#date-display");
  let now = new Date();
  var minits = "";
  if (now.getMinutes() < 10) {
    minits = "0" + now.getMinutes();
  } else {
    minits = "" + now.getMinutes();
  }
  var dateString =
    date[now.getDay() - 1] + ", " + now.getHours() + ":" + minits;
  dateDisplay.innerHTML = dateString;
}

function getTemperature(resp) {
  console.log(resp.data);
  temp = resp.data.main.temp;
  console.log(temp);
  city = resp.data.name;
  console.log(resp.data.name);
  console.log(city);
  var currTemp = document.querySelector("#curr-temp");
  currTemp.innerHTML = temp;
  var cityDisplay = document.querySelector("#city-display");
  cityDisplay.innerHTML = `${city} today`;
}

function select(event) {
  event.preventDefault();
  var input = document.querySelector("input");
  city = input.value.toUpperCase();
  var cityDisplay = document.querySelector("#city-display");
  cityDisplay.innerHTML = `${city} today`;
  var weatherQueryStr = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&appid=${apiKey}`;
  if (city) {
    axios.get(weatherQueryStr).then(getTemperature);
    temperatureIn = "C";
  } else {
    alert("Try again to type city name!");
  }
}

dateFill();

let form = document.querySelector("#city-selector-form");
form.addEventListener("submit", select);

function tempConvert(event) {
  event.preventDefault();
  var target = event.target;
  var tempList = document.querySelectorAll(".temperature-display");
  var tVal = 0;
  tempList.forEach((tmp) => {
    tVal = tmp.innerHTML;
    if (temperatureIn === "C" && target.id === "frn") {
      tVal = 32 + (tVal * 9) / 5;
    }
    if (temperatureIn === "F" && target.id === "cls") {
      tVal = ((tVal - 32) * 5) / 9;
    }
    tVal = Math.round(tVal * 10) / 10;
    tmp.innerHTML = tVal;
  });
  if (temperatureIn === "C" && target.id === "frn") {
    temperatureIn = "F";
  }
  if (temperatureIn === "F" && target.id === "cls") {
    temperatureIn = "C";
  }
}

function weatherInLocation(resp) {
  var lon = resp.coords.longitude;
  var lat = resp.coords.latitude;
  alert(`At the current location ${city}/n longitude:${lon}&latitude:${lat}`);
  var weatherQueryStr = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(weatherQueryStr).then(getTemperature);
  temperatureIn = "C";
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
