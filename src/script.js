// UI Date

let currentTemp = {
  temp: 0,
  type: "celsium",

  setTemp(temp, type) {
    this.temp = temp;
    this.type = type;
  },
  getTemp() {
    let temp = this.temp;
    let type = this.type;
    return { temp, type };
  },
};

function formatTime(date) {
  let currentHours = date.getHours();
  let currentMinutes = date.getMinutes();

  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }

  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  return `${currentHours}:${currentMinutes}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let date = new Date();
let currentDay = date.getDay();

let dayUI = document.querySelector("#current-day");
let timeUI = document.querySelector("#current-time");

dayUI.innerHTML = `${days[currentDay]}`;
timeUI.innerHTML = formatTime(date);

// Change city

function changeTemperature(temperature) {
  let temperatureUI = document.querySelector("#temperature");

  temperatureUI.innerHTML = temperature;
}

function getWeather(response) {
  let name = response.data.name;
  let countryName = response.data.sys.country;
  let temperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let cloud = response.data.clouds.all;
  changeTemperature(temperature);

  currentTemp.setTemp(temperature, "celsium");

  let cityUI = document.querySelector("#city");
  cityUI.innerHTML = `${name},`;
  let countryUI = document.querySelector("#country");
  countryUI.innerHTML = countryName;
  let descriptionUI = document.querySelector("#description");
  descriptionUI.innerHTML = description;
  let humidityUI = document.querySelector("#humidity");
  humidityUI.innerHTML = `${humidity}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${wind} km/h`;
  let cloudinessUI = document.querySelector("#cloudiness");
  cloudinessUI.innerHTML = `${cloud}%`;
}

function changeCity(event) {
  event.preventDefault();
  let textInput = document.querySelector("#text-input");

  if (!textInput.value.trim()) return;

  let city = textInput.value.trim();

  let apiKey = "0dc40d3d7cda209ca40e77430c74cf57";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);

  textInput.value = "";
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", changeCity);

// Display temperature

function convertToСelsius() {
  let degree = currentTemp.getTemp();
  if (degree.type === "celsium") return;

  let temperature = Math.round((degree.temp - 32) * (5 / 9));
  changeTemperature(temperature);
  currentTemp.setTemp(temperature, "celsium");
}

function convertToFahrenheit() {
  let degree = currentTemp.getTemp();
  if (degree.type === "fahrenheit") return;

  let temperature = Math.round(degree.temp * (9 / 5) + 32);
  changeTemperature(temperature);
  currentTemp.setTemp(temperature, "fahrenheit");
}

let btnCelsius = document.querySelector("#celsius");
btnCelsius.addEventListener("click", convertToСelsius);

let btnFahrenheit = document.querySelector("#fahrenheit");
btnFahrenheit.addEventListener("click", convertToFahrenheit);

// API weather

function getCurrentWeather(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiKey = "0dc40d3d7cda209ca40e77430c74cf57";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentWeather);
}

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", getLocation);

navigator.geolocation.getCurrentPosition(getCurrentWeather);
