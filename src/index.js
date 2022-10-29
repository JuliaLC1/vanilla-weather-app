function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
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
  let day = days[date.getDay()];
  return `${day} ${hour}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return day;
}

function displayForecast(response) {
  let dailyForecast = response.data.daily;

  let forecast = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class = "row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
         <div class="forecast-day">${formatDay(forecastDay.time)}</div>
            <img
                src= "http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png"
                alt="icon"
                width="42"
            />
         <div class="forecast-temp">
            <span class="forecast-high-temp">${Math.round(
              forecastDay.temperature.maximum
            )}°</span>
            <span class="forecast-low-temp">${Math.round(
              forecastDay.temperature.minimum
            )}°</span>
         </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "f4e71a2fe0d4993tbef26be3ofa63512";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temp = document.querySelector("#temp-number");
  celsiusTemperature = response.data.temperature.current;
  temp.innerHTML = Math.round(celsiusTemperature);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.city;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.condition.description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.temperature.humidity;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = formatDate(response.data.time * 1000);
  let weatherIcon = document.querySelector("#icon");
  weatherIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  weatherIcon.setAttribute("alt", response.data.condition.icon);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "f4e71a2fe0d4993tbef26be3ofa63512";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

function displayFerenheit(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp-number");
  celsiusLink.classList.remove("active");
  ferenheitLink.classList.add("active");
  let ferenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temp.innerHTML = Math.round(ferenheitTemperature);
}
function displayCelsius(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp-number");
  celsiusLink.classList.add("active");
  ferenheitLink.classList.remove("active");
  temp.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let ferenheitLink = document.querySelector("#ferenheit-link");
ferenheitLink.addEventListener("click", displayFerenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

search("New York");
