const apiKey = "bf6f9184faee456292e141817242804";

function fetchWeatherDataByCity(city) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`;

  fetchWeatherData(apiUrl);
}
function fetchWeatherDataByCityAndDate(city, date) {
  const apiUrl = `https://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${city}&dt=${date}`;

  fetchWeatherData(apiUrl);
}

function fetchWeatherData(apiUrl) {
  fetch(apiUrl)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        const errorMessage = document.getElementById("error-message");
        const city = document.getElementById("city-input").value;
        const date = document.getElementById("date-input").value;

        if (city && date) {
          errorMessage.innerText =
            "Enter a valid city name or enter a date between 14 and 300 days from today";
        } else {
          errorMessage.innerText =
            "City not found. Please enter a valid city name. Previous result is showing by default";
        }

        errorMessage.style.display = "block";
        document.querySelector(".heading").style.display = "none";

        return;
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.log(data);
      } else {
        document.getElementById("error-message").style.display = "none";
        document.getElementById("location").innerText =
          data.location.name + ", " + data.location.country;
        document.getElementById("todayDate").innerText =
          data.forecast.forecastday[0].date;

        //   Temperature
        if (data?.current?.temp_c) {
          document.getElementById("temperature").innerText =
            data?.current?.temp_c + " °C";
        } else if (data?.forecast?.forecastday[0]?.day?.avgtemp_c) {
          document.getElementById("temperature").innerText =
            data?.forecast?.forecastday[0]?.day?.avgtemp_c + " °C avg";
        } else {
          document.getElementById("temperature").innerText = "Not available";
        }

        // Feels Like
        if (data?.current?.feelslike_c) {
          document.getElementById("feeling").innerText =
            data?.current?.feelslike_c + " °C";
        } else {
          document.getElementById("feeling").innerText = "Not available";
        }

        // Condition
        if (data?.current?.condition) {
          document.getElementById("condition").innerText =
            data?.current?.condition?.text;
        } else if (data?.forecast?.forecastday[0]?.day?.condition) {
          document.getElementById("condition").innerText =
            data?.forecast?.forecastday[0]?.day?.condition?.text;
        } else {
          document.getElementById("condition").innerText = "Not available";
        }

        // Wind
        if (data?.current?.wind_kph) {
          document.getElementById("wind-speed").innerText =
            data?.current?.wind_kph + " km/h";
        } else if (data?.forecast?.forecastday[0]?.day?.maxwind_kph) {
          document.getElementById("wind-speed").innerText =
            data?.forecast?.forecastday[0]?.day?.maxwind_kph + " km/h";
        } else {
          document.getElementById("wind-speed").innerText = "Not available";
        }

        // Wind Direction
        if (data?.current?.wind_dir) {
          document.getElementById("wind-direction").innerText =
            ", " + data?.current?.wind_dir;
        } else {
          document.getElementById("wind-direction").innerText = "";
        }

        // Humidity
        if (data?.current?.humidity) {
          document.getElementById("humidity").innerText =
            data?.current?.humidity + "%";
        } else {
          document.getElementById("humidity").innerText = "Not available";
        }

        // Pressure
        if (data?.current?.pressure_mb) {
          document.getElementById("pressure").innerText =
            data?.current?.pressure_mb + " mb";
        } else {
          document.getElementById("pressure").innerText = "Not available";
        }

        const hourlyForecastTableBody = document.querySelector(
          "#hourly-forecast tbody"
        );
        hourlyForecastTableBody.innerHTML = "";
        data.forecast.forecastday[0].hour.forEach((hour) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${hour.time.substr(11, 5)}</td>
                        <td>${hour.temp_c}</td>
                        <td>${hour.condition.text}</td>
                        <td>${hour.wind_kph}</td>
                        <td>${hour.humidity}</td>
                        <td>${hour.pressure_mb}</td>
                    `;
          hourlyForecastTableBody.appendChild(row);
        });
      }
    })
    .catch((error) => {
      return error;
    });
}

document.getElementById("search-btn").addEventListener("click", () => {
  const date = document.getElementById("date-input").value;
  const city = document.getElementById("city-input").value;
  if (city && date) {
    fetchWeatherDataByCityAndDate(city, date);
  } else if (city) {
    fetchWeatherDataByCity(city);
  } else {
    alert("Please enter either city or both date and city");
  }
});

fetchWeatherDataByCity("Dhaka");
