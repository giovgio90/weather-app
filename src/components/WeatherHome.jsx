import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";

function WeatherHome() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "ec0ea160e0ae5df26aa10523ea3fc83b"; // Chiave API OpenWeatherMap

  useEffect(() => {
    if (city) {
      setLoading(true);

      // Chiamata API per ottenere i dati meteo utilizzando il nome della città
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const { lat, lon } = data[0];

            // Ora puoi effettuare una seconda chiamata API utilizzando lat e lon
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
          } else {
            throw new Error("City not found");
          }
        })
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [city, apiKey]);

  const weatherCode = weatherData && weatherData.weather && weatherData.weather[0] ? weatherData.weather[0].icon : null;
  const iconUrl = weatherCode ? `https://openweathermap.org/img/wn/${weatherCode}.png` : null;

  return (
    <Container>
      <h1 className="text-white">WEATHER APP</h1>
      <Row className="my-5">
        <Col sm={6} className="my-auto">
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="cityInput">
              <Form.Label className="text-white fs-3">Your City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insert your city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col sm={6}>
          <Card
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
              padding: "10px",
              minHeight: "80vh",
              minWidth: "80vh",
            }}
          >
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : weatherData && weatherData.weather ? (
                <>
                  <h3 className="display-2 fw-bold">{city}</h3>
                  {weatherData.weather[0].description && (
                    <div className="d-flex justify-content-center align-items-center">
                      <img src={iconUrl} alt="Weather Icon" style={{ width: "70px" }} />

                      <p className="fs-2 mt-2">
                        {weatherData.weather[0].description.charAt(0).toUpperCase() +
                          weatherData.weather[0].description.slice(1)}
                      </p>
                    </div>
                  )}

                  {weatherData.main && weatherData.main.temp && <p className="display-5">{weatherData.main.temp}°C</p>}
                </>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default WeatherHome;
