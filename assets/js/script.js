const form = document.querySelector("#city-form");
const weatherInfoDiv = document.querySelector("#weather-info");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityInput = document.querySelector("#city-input").value;
  getWeather(cityInput);
});

function getWeather(city) {
  const apiKey = 'be0eb2e6fda121848ef36ec4c310577a';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // parse the weather data
      const forecastList = data.list;
      const cityName = data.city.name;
      const forecastData = parseForecastData(forecastList);

      // display the forecast data in the weather info div
      weatherInfoDiv.innerHTML = `
        <h2>${cityName} 5-Day Forecast</h2>
        <ul>
          ${forecastData.map((item) => `
            <li>${item.date}: ${item.temperature} &#8451; - ${item.description}</li>
          `).join('')}
        </ul>
      `;
    })
    .catch((error) => {
      console.log(error);
      weatherInfoDiv.innerHTML = 'Error getting weather information.';
    });
}

function parseForecastData(forecastList) {
  // group the forecast data by date
  const forecastDataByDate = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!forecastDataByDate[date]) {
      forecastDataByDate[date] = [];
    }
    forecastDataByDate[date].push(item);
  });

  // aggregate the forecast data for each day
  const forecastData = [];
  Object.keys(forecastDataByDate).forEach((date) => {
    const forecastList = forecastDataByDate[date];
    const temperatures = forecastList.map((item) => item.main.temp);
    const minTemperature = Math.min(...temperatures);
    const maxTemperature = Math.max(...temperatures);
    const description = forecastList[0].weather[0].description;

    forecastData.push({
      date: date,
      temperature: Math.round((minTemperature + maxTemperature) / 2),
      description: description,
    });
  });

  return forecastData;
}
