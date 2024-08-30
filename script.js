intro = document.getElementById("intro");

currentWindNum = document.getElementById("wind");
currentPrecipNum = document.getElementById("precip");
currentHumidityNum = document.getElementById("humidity");
currentTempNum = document.getElementById("current-temp");
currentMinMaxTemp = document.getElementById("current-maxminTemp");
currentWeatherIMG = document.getElementById("current-weatherImg");
mainTag = document.getElementsByTagName("main");

headerContent = document.getElementById("header-content");
currentWeather = document.getElementById("today-info");
weeksInfo = document.getElementById("weeks-info");
searchInput = document.getElementById("location-input");

headerInfo = document.getElementById("header-info");
errorWarning = document.getElementById("input-warning");

loadingContainer = document.getElementById("loader-container");
const loader = document.createElement("span");
loader.className = "loader";

cards = document.getElementsByClassName("card");
icons = document.getElementsByClassName("fa-solid");

searchInput.addEventListener("change", (event) => {
  const location = event.target.value;
  if (location === "") {
    errorWarning.textContent = "Please enter location!";
  } else {
    getWeather(location);
  }
});

const getLocation = async (location) => {
  try {
    let fetchLocation = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`
    );
    let respLocation = await fetchLocation.json();
    console.log(respLocation.results);
    return respLocation.results;
  } catch (err) {
    console.error("Error fetching location data:", err);
  }
};

const getData = async (location) => {
  loadingContainer.appendChild(loader);

  let locationList = await getLocation(location);

  if (!locationList || locationList.length === 0) {
    console.error("No location data found for the given input.");
    return null;
  }
  let latitude = locationList[0].latitude;
  let longitude = locationList[0].longitude;
  let locationUsed = locationList[0].name;
  try {
    let fetchLocationData = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min`
    );
    let respLocationData = await fetchLocationData.json();
    console.log(respLocationData);

    loadingContainer.removeChild(loader);

    return {
      weatherData: respLocationData,
      locationUsed: locationUsed,
    };
  } catch (err) {
    console.error("Error fetching weather data:", err);
    loadingContainer.removeChild(loader);
    return null;
  }
};

function getDailyWeatherIcon(weatherCode, isDay) {
  let weatherIcon = "";
  let shortDesc = "";
  if (isDay) {
    switch (weatherCode) {
      // Clear sky
      case 0:
        weatherIcon = "images/day/clear-sky.png";
        shortDesc = "Clear and sunny—enjoy the bright blue sky!";
        break;

      // Mainly clear, partly cloudy, and overcast
      case 1:
        weatherIcon = "images/day/mainly-clear.png";
        shortDesc = "Mostly clear skies with a few clouds.";
        break;
      case 2:
        weatherIcon = "images/day/partly-cloudy.png";
        shortDesc = "The sun peeks through scattered clouds.";
        break;
      case 3:
        weatherIcon = "images/day/overcast.png";
        shortDesc = "A full sky of gray clouds.";
        break;

      // Fog and depositing rime fog
      case 45:
        weatherIcon = "images/extra-weather/foggy.png";
        shortDesc = "Misty fog envelops everything.";
        break;
      case 48:
        weatherIcon = "images/extra-weather/foggy.png";
        shortDesc = "Icy fog coats surfaces.";
        break;

      // Drizzle: Light, moderate, and dense intensity
      case 51:
        weatherIcon = "images/extra-weather/light-drizzle.png";
        shortDesc = "Light drizzle sprinkles down.";
        break;
      case 53:
        weatherIcon = "images/extra-weather/moderate-drizzle.png";
        shortDesc = "A steady, moderate drizzle.";
        break;
      case 55:
        weatherIcon = "images/extra-weather/moderate-drizzle.png";
        shortDesc = "Dense drizzle soaking the day.";
        break;

      // Freezing Drizzle: Light and dense intensity
      case 56:
        weatherIcon = "images/extra-weather/light-freezing-rain.png";
        shortDesc = "Light icy drizzle falling.";
        break;
      case 57:
        weatherIcon = "images/extra-weather/dense-freezing-rain.png";
        shortDesc = "Thick icy drizzle covers all.";
        break;

      // Rain: Slight, moderate and heavy intensity
      case 61:
        weatherIcon = "images/extra-weather/light-rain.png";
        shortDesc = "Light rain, refreshing and soft.";
        break;
      case 63:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Steady, moderate rain.";
        break;
      case 65:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Heavy rain pouring down.";
        break;

      // Freezing Rain: Light and heavy intensity
      case 66:
        weatherIcon = "images/extra-weather/light-freezing-rain.png";
        shortDesc = "Light ice rain glazing surfaces.";
        break;
      case 67:
        weatherIcon = "images/extra-weather/dense-freezing-rain.png";
        shortDesc = "Heavy ice rain, slick and cold.";
        break;

      // Snow fall: Slight, moderate, and heavy intensity
      case 71:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Light snowflakes gently falling.";
        break;
      case 73:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Moderate snow steadily falling.";
        break;
      case 75:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Heavy snow blanketing everything.";
        break;

      //Snow grains
      case 77:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Tiny snow grains lightly dusting.";
        break;

      // Rain showers: Slight, moderate, and violent
      case 80:
        weatherIcon = "images/extra-weather/light-rain.png";
        shortDesc = "Brief, light rain showers.";
        break;
      case 81:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Moderate showers refreshing the day.";
        break;
      case 82:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Intense rain showers drenching all.";
        break;

      // Snow showers slight and heavy
      case 85:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Light snow flurries.";
        break;
      case 86:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Heavy snow showers sweeping through.";
        break;

      // Thunderstorm: Slight or moderate
      case 95:
        weatherIcon = "images/extra-weather/thunderstorm.png";
        shortDesc = "A thunderstorm rumbles nearby.";
        break;

      // Thunderstorm with slight and heavy hail
      case 96:
        weatherIcon = "images/extra-weather/thunderstorm.png";
        shortDesc = "Thunderstorm with some hail.";
        break;
      case 99:
        weatherIcon = "images/extra-weather/thunderstorm.png";
        shortDesc = "A fierce storm with heavy hail.";
        break;
    }
  } else {
    switch (weatherCode) {
      // Clear sky
      case 0:
        weatherIcon = "images/night/clear-night.png";
        shortDesc = "Clear night sky—stars twinkle brightly.";
        break;

      // Mainly clear, partly cloudy, and overcast
      case 1:
        weatherIcon = "images/night/mainly-clear-night.png";
        shortDesc = "Mostly clear with a few night clouds.";
        break;
      case 2:
        weatherIcon = "images/day/partly-cloudy.png";
        shortDesc = "Stars peek through scattered clouds.";
        break;
      case 3:
        weatherIcon = "images/night/overcast-night.png";
        shortDesc = "The night sky is fully clouded.";
        break;

      // Fog and depositing rime fog
      case 45:
        weatherIcon = "images/extra-weather/foggy.png";
        shortDesc = "Misty fog cloaks the night.";
        break;

      case 48:
        weatherIcon = "images/extra-weather/foggy.png";
        shortDesc = "Icy fog glistens in the night.";
        break;

      // Drizzle: Light, moderate, and dense intensity
      case 51:
        weatherIcon = "images/extra-weather/light-drizzle.png";
        shortDesc = "Light drizzle in the night air.";
        break;
      case 53:
        weatherIcon = "images/extra-weather/moderate-drizzle.png";
        shortDesc = "A steady drizzle in the quiet night.";
        break;
      case 55:
        weatherIcon = "images/extra-weather/moderate-drizzle.png";
        shortDesc = "Dense drizzle soaking the night.";
        break;

      // Freezing Drizzle: Light and dense intensity
      case 56:
        weatherIcon = "images/extra-weather/light-freezing-rain.png";
        shortDesc = "Light freezing drizzle under the night sky.";
        break;
      case 57:
        weatherIcon = "images/extra-weather/dense-freezing-rain.png";
        shortDesc = "Thick freezing drizzle covers the night.";
        break;

      // Rain: Slight, moderate, and heavy intensity
      case 61:
        weatherIcon = "images/extra-weather/light-rain.png";
        shortDesc = "Light rain softly falls in the night.";
        break;
      case 63:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Moderate rain in the calm night.";
        break;
      case 65:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Heavy rain pours through the dark.";
        break;

      // Freezing Rain: Light and heavy intensity
      case 66:
        weatherIcon = "images/extra-weather/light-freezing-rain.png";
        shortDesc = "Light freezing rain coats the night.";
        break;
      case 67:
        weatherIcon = "images/extra-weather/dense-freezing-rain.png";
        shortDesc = "Heavy freezing rain chills the night.";
        break;

      // Snow fall: Slight, moderate, and heavy intensity
      case 71:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Light snowflakes drift in the night.";
        break;
      case 73:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Moderate snow falls steadily at night.";
        break;
      case 75:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Heavy snow blankets the quiet night.";
        break;

      // Snow grains
      case 77:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Tiny snow grains fall gently in the night.";
        break;

      // Rain showers: Slight, moderate, and violent
      case 80:
        weatherIcon = "images/extra-weather/light-rain.png";
        shortDesc = "Brief, light showers in the night.";
        break;
      case 81:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Moderate night showers refresh the air.";
        break;
      case 82:
        weatherIcon = "images/extra-weather/moderate-rain.png";
        shortDesc = "Intense rain showers drench the night.";
        break;

      // Snow showers slight and heavy
      case 85:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Light snow flurries in the night.";
        break;
      case 86:
        weatherIcon = "images/extra-weather/snow.png";
        shortDesc = "Heavy snow showers sweep through the night.";
        break;

      // Thunderstorm: Slight or moderate
      case 95:
        weatherIcon = "images/extra-weather/thunderstorm.png";
        shortDesc = "Thunder rumbles in the night sky.";
        break;

      // Thunderstorm with slight and heavy hail
      case 96:
        weatherIcon = "images/extra-weather/thunderstorm.png";
        shortDesc = "Thunderstorm with some hail at night.";
        break;
      case 99:
        weatherIcon = "images/extra-weather/thunderstorm.png";
        shortDesc = "A fierce storm with heavy hail in the night.";
        break;
    }
  }

  return { weatherIcon, shortDesc };
}

function listCard(date, minTemp, maxTemp, weatherImg, isToday) {
  const card = document.createElement("article");
  card.className = "card";

  const formattedDate = new Date(date)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();

  card.innerHTML = `
    <p>${isToday ? "TODAY" : formattedDate}</p>
    <img src="${weatherImg}" alt="Weather Icon" />
    <figcaption>${minTemp}°/${maxTemp}°</figcaption>
  `;
  return card;
}

function currentLocationInfo(currentLocation, currentDate, desc) {
  const currentInfo = document.createElement("article");
  currentInfo.className = "current-info";

  currentInfo.innerHTML = `
  <h3>${currentLocation}</h3>
  <span class="desc-weather">${desc}</span>
  <p>${currentDate}</p>
  `;

  return currentInfo;
}

const getWeather = async (location) => {
  intro.remove();
  errorWarning.textContent = "";
  currentWeather.innerHTML = "";
  headerInfo.innerHTML = "";
  weeksInfo.innerHTML = "";

  let datas = await getData(location);

  if (!datas || !datas.weatherData) {
    loadingContainer.removeChild(loader);
    errorWarning.textContent = "Please enter valid location!";
    currentWeather.innerHTML = `
      <div class="no-data-content">
        <img src='images/no-data.png' class='no-data-img'>
        <p>No data available.</p>
      </div>
    `;
    console.error("No weather data available for the given location.");
    return;
  }

  const currentLocation = datas.locationUsed;
  const currentDate = new Date(
    datas.weatherData.current.time
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const { weatherIcon, shortDesc } = getDailyWeatherIcon(
    datas.weatherData.current.weather_code,
    datas.weatherData.current.is_day
  );

  let currentInfo = currentLocationInfo(
    currentLocation,
    currentDate,
    shortDesc
  );

  headerInfo.appendChild(currentInfo);

  currentWeather.innerHTML = `
    <div class="left-info">
      <h1 id="current-temp">${Math.round(
        datas.weatherData.current.temperature_2m
      )}</h1>
      <h2 id="current-maxminTemp">L:${Math.floor(
        datas.weatherData.daily.temperature_2m_min[0]
      )}° H:${Math.floor(datas.weatherData.daily.temperature_2m_max[0])}°</h2>
    </div>
    <img id="current-weatherImg" class="main-img" src="${weatherIcon}" alt="Weather Icon" />
    <div class="right-info">
      <div class="info">
        <i class="fa-solid fa-wind"></i>
        <p><span id="wind">${
          datas.weatherData.current.wind_speed_10m
        }</span> km/h</p>
      </div>
      <div class="info">
        <i class="fa-solid fa-umbrella"></i>
        <p><span id="precip">${
          datas.weatherData.current.precipitation
        }</span> mm</p>
      </div>
      <div class="info">
        <i class="fa-solid fa-droplet"></i>
        <p><span id="humidity">${
          datas.weatherData.current.relative_humidity_2m
        }</span>%</p>
      </div>
    </div>`;

  const today = new Date().toLocaleDateString("en-US");

  datas.weatherData.daily.time.forEach((date, i) => {
    const minTemp = Math.floor(datas.weatherData.daily.temperature_2m_min[i]);
    const maxTemp = Math.floor(datas.weatherData.daily.temperature_2m_max[i]);
    const weatherCode = datas.weatherData.daily.weather_code[i];
    const { weatherIcon } = getDailyWeatherIcon(weatherCode, true);

    const isToday = new Date(date).toLocaleDateString("en-US") === today;

    const card = listCard(date, minTemp, maxTemp, weatherIcon, isToday);
    weeksInfo.appendChild(card);
  });

  if (!datas.weatherData.current.is_day) {
    mainTag[0].style.backgroundColor = "#0d1523";
    mainTag[0].style.color = "white";
    searchInput.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    searchInput.style.color = "white";
    Array.from(cards).forEach(
      (card) => (card.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
    );
    Array.from(icons).forEach((icon) => (icon.style.color = "#263e66"));
  } else {
    mainTag[0].style.backgroundColor = "#b5e7ff";
    mainTag[0].style.color = "black";
    searchInput.style.backgroundColor = "rgb(0, 0, 0, 0.1)";
    searchInput.style.color = "black";
    Array.from(cards).forEach(
      (card) => (card.style.backgroundColor = "rgb(0, 0, 0, 0.1)")
    );
    Array.from(icons).forEach((icon) => (icon.style.color = "#759aac"));
  }
};
