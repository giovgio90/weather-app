import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CityDetails() {
  const { city } = useParams();
  const [forecastData, setForecastData] = useState([]);
  const apiKey = "ec0ea160e0ae5df26aa10523ea3fc83b";

  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  useEffect(() => {
    if (city) {
      const fetchForecastData = async () => {
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
          const data = await response.json();

          const forecastDataWithCelsius = data.list.slice(1, 5).map((item) => ({
            ...item,
            main: {
              ...item.main,
              temp: kelvinToCelsius(item.main.temp),
            },
          }));

          setForecastData(forecastDataWithCelsius);
        } catch (error) {
          console.error("Error fetching forecast data:", error);
        }
      };

      fetchForecastData();
    }
  }, [city, apiKey]);

  return (
    <div>
      <h1>Weather Forecast for {city}</h1>
      {forecastData.length > 0 ? (
        forecastData.map((item, index) => (
          <div key={index} className="d-flex">
            <h2>Day {index + 2}</h2>
            <p>Temperature: {item.main.temp.toFixed(0)}°C</p>
            <p>Description: {item.weather[0].description}</p>
            <p>Humidity: {item.main.humidity}%</p>
          </div>
        ))
      ) : (
        <div>No forecast data available.</div>
      )}
    </div>
  );
}

export default CityDetails;
