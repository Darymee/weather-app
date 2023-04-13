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

function formatTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let currentDay = date.getDay();
  let currentHours = date.getHours();
  let currentMinutes = date.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }

  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let time = `${currentHours}:${currentMinutes}`;
  let day = `${days[currentDay]}`;

  return { day, time };
}

function changeTemperature(temperature) {
  let temperatureUI = document.querySelector("#temperature");

  temperatureUI.innerHTML = temperature;
}

function getWeather(response) {
  console.log(response.data);
  let city = response.data.city;
  let countryName = response.data.country;
  let temperature = Math.round(response.data.temperature.current);
  let description = response.data.condition.description;
  let humidity = response.data.temperature.humidity;
  let wind = Math.round(response.data.wind.speed);
  let pressure = response.data.temperature.pressure;
  let date = formatTime(response.data.time);
  let iconUrl = response.data.condition.icon_url;
  changeTemperature(temperature);

  currentTemp.setTemp(temperature, "celsium");
  temperatureTypeControl();

  let cityUI = document.querySelector("#city");
  cityUI.innerHTML = `${city},`;
  let countryUI = document.querySelector("#country");
  countryUI.innerHTML = countryName;
  let descriptionUI = document.querySelector("#description");
  descriptionUI.innerHTML = description;
  let humidityUI = document.querySelector("#humidity");
  humidityUI.innerHTML = `${humidity}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${wind} km/h`;
  let pressureUI = document.querySelector("#pressure");
  pressureUI.innerHTML = `${pressure} Gpa`;
  let dayUI = document.querySelector("#current-day");
  dayUI.innerHTML = date.day;
  let timeUI = document.querySelector("#current-time");
  timeUI.innerHTML = date.time;
  let icon = document.querySelector("#icon");

  icon.setAttribute("src", iconUrl);
  icon.setAttribute("alt", description);
}

function searchCity(city) {
  let apiKey = "ft62c1a34b0c40fe3oc6a889fc79e401";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}

function changeCity(event) {
  event.preventDefault();
  let textInput = document.querySelector("#text-input");

  if (!textInput.value.trim()) return;

  let city = textInput.value.trim();

  searchCity(city);

  textInput.value = "";
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", changeCity);

// Display temperature

function convertToСelsius(event) {
  temperatureTypeControl();
  let btnFahrenheit = document.querySelector("#fahrenheit");
  btnFahrenheit.classList.remove("checked");
  let degree = currentTemp.getTemp();

  if (degree.type === "celsium") return;

  event.target.classList.remove("checked");

  let temperature = Math.round((degree.temp - 32) * (5 / 9));
  changeTemperature(temperature);
  currentTemp.setTemp(temperature, "celsium");
  event.target.classList.add("checked");
  temperatureTypeControl();
}

function convertToFahrenheit(event) {
  temperatureTypeControl();
  let degree = currentTemp.getTemp();
  if (degree.type === "fahrenheit") return;

  event.target.classList.remove("checked");

  let temperature = Math.round(degree.temp * (9 / 5) + 32);
  changeTemperature(temperature);
  currentTemp.setTemp(temperature, "fahrenheit");
  temperatureTypeControl();
}

function temperatureTypeControl() {
  let btnFahrenheit = document.querySelector("#fahrenheit");
  let btnCelsius = document.querySelector("#celsius");
  let temperature = currentTemp.getTemp();

  if (temperature.type === "celsium") {
    btnCelsius.classList.add("checked");
    btnFahrenheit.classList.remove("checked");
  } else {
    btnCelsius.classList.remove("checked");
    btnFahrenheit.classList.add("checked");
  }
}

let btnCelsius = document.querySelector("#celsius");
btnCelsius.addEventListener("click", convertToСelsius);

let btnFahrenheit = document.querySelector("#fahrenheit");
btnFahrenheit.addEventListener("click", convertToFahrenheit);

// API weather

function getCurrentWeather(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiKey = "ft62c1a34b0c40fe3oc6a889fc79e401";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentWeather);
}

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", getLocation);

navigator.geolocation.getCurrentPosition(getCurrentWeather);
