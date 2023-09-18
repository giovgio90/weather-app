import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Clock from "react-live-clock";
import { Link } from "react-router-dom";

function WeatherHome() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [foundCity, setFoundCity] = useState("");
  const [cityNotFound, setCityNotFound] = useState(false);
  const apiKey = "ec0ea160e0ae5df26aa10523ea3fc83b";

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (city.trim().length >= 2) {
      setLoading(true);
      setCityNotFound(false);

      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const { lat, lon } = data[0];
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
          } else {
            setCityNotFound(true);
            throw new Error("City not found");
          }
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.name.toLowerCase() === city.toLowerCase()) {
            setWeatherData(data);
            setLoading(false);
            setShowCity(true);
            setFoundCity(data.name);
          } else {
            setCityNotFound(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      console.log("La città è troppo corta");
    }
  };

  const weatherCode = weatherData && weatherData.weather && weatherData.weather[0] ? weatherData.weather[0].icon : null;
  const iconUrl = weatherCode ? `https://openweathermap.org/img/wn/${weatherCode}.png` : null;

  return (
    <Container>
      <h4 className="text-start text-white">WEATHER APP</h4>
      <Row className="my-5">
        <Col sm={6} className="my-auto">
          <Form onSubmit={handleCitySubmit}>
            <Form.Group controlId="cityInput">
              <Form.Label className="text-white fs-5 ">Search location</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Insert your city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ border: "none", backgroundColor: "transparent" }}
                >
                  <i className="fas fa-search fs-4"></i>
                </button>
              </div>
            </Form.Group>
            {cityNotFound && <p className="text-danger">This city does not exist</p>}
          </Form>
        </Col>
      </Row>
      <Row className="my-5">
        <Col sm={6}>
          <Link
            to={{
              pathname: `/forecast/${city}`,
              state: { forecastData: weatherData },
            }}
            className="text-decoration-none"
          >
            <Card
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                padding: "10px",
                minHeight: "50vh",
                minWidth: "100vh",
              }}
            >
              <Card.Body>
                {loading ? (
                  <p>Loading...</p>
                ) : showCity && weatherData && weatherData.weather ? (
                  <>
                    <div className="current-time text-start">
                      <p>Current weather</p>
                      <Clock format="HH:mm" interval={1000} ticking={true} />
                    </div>
                    <h3 className="display-2 fw-bold">
                      {foundCity}, {weatherData.sys.country}
                    </h3>
                    {weatherData.weather[0].description && (
                      <div className="d-flex justify-content-center align-items-center">
                        <img src={iconUrl} alt="Weather Icon" style={{ width: "70px" }} />
                        <p className="fs-2 mt-2">
                          {weatherData.weather[0].description.charAt(0).toUpperCase() +
                            weatherData.weather[0].description.slice(1)}
                        </p>
                      </div>
                    )}

                    {weatherData.main && weatherData.main.temp && (
                      <p className="display-5">{(weatherData.main.temp - 273.15).toFixed(0)}°C</p>
                    )}
                  </>
                ) : null}
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default WeatherHome;
