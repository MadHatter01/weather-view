async function fetchWeather(location) {
  try {
    const GEOCODING_URL =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      location +
      "&count=1&language=en&format=json";

    const response = await fetch(GEOCODING_URL);
    const data = await response.json();
    const lat = data["results"][0]["latitude"];
    const lon = data["results"][0]["longitude"];
    const WEATHER_URL =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      lat +
      "&longitude=" +
      lon +
      "&hourly=temperature_2m&current_weather=true";
    const query = await fetch(WEATHER_URL);
    if (!query.ok) {
      throw new Error("Weather API request failed");
    }

    const weather_response = await query.json();
    if (!weather_response.current_weather) {
      throw new Error("Weather data not found");
    }

    return [weather_response.current_weather, [lat, lon]];
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// fetchWeather("san+diego").then((info) => console.log(info));

const processorFcn = async () => {
  console.log("clicked");
  const location = document.getElementById("location-input").value;
  try {
    const weatherInfo = await fetchWeather(location);
    const [lat, lon] = weatherInfo[1];
    console.log(weatherInfo);
    const weatherPanel = document.getElementById("weather-results");
    const weatherContents = `
    <h2>Weather Information for ${location}</h2>
    <p> Latitude: ${lat}, Longitude: ${lon} <a href="https://maps.google.com/?q=${lat},${lon}">(Take me there)</a></p>
    <p>Temperature: ${weatherInfo[0].temperature}</p>
    <p>Wind Speed: ${weatherInfo[0].windspeed}
    `;
    weatherPanel.innerHTML = weatherContents;
    console.log(weatherInfo);
  } catch (error) {
    console.error("Error:", error);
  }
};

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", processorFcn);
// document.getElementById("location-input").addEventListener('keydown', function (e) {
//     if (e.key === 'Enter' || e.keyCode === 13) {
//         processorFcn();
//     }
// });
