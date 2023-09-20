import React, { useState } from "react";
import { Alert, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import welcomeImage from "../assets/images/v2osk-1Z2niiBPg5A-unsplash.jpg"; // Importa l'immagine

function WeatherHome() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundCity, setFoundCity] = useState("");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false); // Per tenere traccia dell'invio del modulo
  const [showWelcomeImage, setShowWelcomeImage] = useState(true); // Mostra l'immagine di benvenuto all'inizio
  const [apiKey] = useState("ec0ea160e0ae5df26aa10523ea3fc83b");

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (city.trim().length >= 2) {
      setLoading(true);
      setCityNotFound(false);
      setShowWelcomeImage(false); // Nasconde l'immagine di benvenuto quando viene inviato il modulo
      setFormSubmitted(true); // Imposta il flag di invio del modulo a true

      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const { lat, lon } = data[0];
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
          } else {
            setCityNotFound(true);
            setLoading(false);
            throw new Error("City not found");
          }
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.name.toLowerCase() === city.toLowerCase()) {
            setWeatherData(data);
            setLoading(false);
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

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Container>
      <h4 className="text-start text-white">WEATHER APP</h4>
      <Row className="my-5 justify-content-center">
        <Col sm={12} md={12} lg={10} className="my-auto">
          <Form onSubmit={handleCitySubmit}>
            <Form.Group controlId="cityInput">
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Insert your city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    background: "#CAD6E0",
                  }}
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
          </Form>
        </Col>
      </Row>
      <Row className="my-5 justify-content-center">
        <Col sm={12} md={12} lg={10}>
          <Link
            to={{
              pathname: `/forecast/${city}`,
              state: { forecastData: weatherData },
            }}
            className="text-decoration-none"
          >
            <Card
              className="mt-3"
              style={{
                background: showWelcomeImage ? `url(${welcomeImage}) no-repeat center center` : "#CAD6E0",
                backgroundSize: "cover",
                borderRadius: "10px",
                padding: "10px",
                minHeight: "400px",
              }}
            >
              <Card.Body>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    {foundCity && weatherData && weatherData.weather ? (
                      <>
                        <Row>
                          <Col xs={6}>
                            <h5 className="text-start">Current weather</h5>
                            <p className="text-start">{currentTime}</p>
                          </Col>
                          <Col xs={6}>
                            <h3 className="display-4 text-end" style={{ fontWeight: "400" }}>
                              {foundCity}, {weatherData.sys.country}
                            </h3>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6} className="d-flex align-self-center">
                            <div className="text-start">
                              <p>
                                Humidity: <strong>{weatherData.main.humidity}</strong>
                              </p>
                              <p>
                                Pressure: <strong>{weatherData.main.pressure}</strong>
                              </p>
                              <p>
                                Visibility: <strong>{weatherData.visibility}</strong>
                              </p>
                            </div>
                            <div className="text-start ms-auto">
                              <p>
                                Speed wind: <strong>{weatherData.wind.speed}</strong>
                              </p>
                              <p>
                                Clouds: <strong>{weatherData.clouds.all}</strong>
                              </p>
                              <p>
                                Deg: <strong>{weatherData.wind.deg}</strong>
                              </p>
                            </div>
                          </Col>
                          <Col xs={6}>
                            {weatherData.main && weatherData.main.temp && (
                              <div className="d-flex justify-content-end">
                                <p style={{ fontSize: "6.5rem" }} className="fw-bold">
                                  {(weatherData.main.temp - 273.15).toFixed(0)}
                                </p>
                                <h6 className="align-self-center pb-5 pb-md-5 pb-lg-5">°C</h6>
                              </div>
                            )}
                            {weatherData.weather[0].description && (
                              <div className="d-flex justify-content-end align-items-center">
                                {iconUrl && <img src={iconUrl} alt="" style={{ width: "70px" }} />}
                                <p className="fs-2 mt-2">
                                  {weatherData.weather[0].description.charAt(0).toUpperCase() +
                                    weatherData.weather[0].description.slice(1)}
                                </p>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </>
                    ) : (
                      formSubmitted &&
                      cityNotFound && (
                        <Alert variant="danger" className="display-4 text-danger fw-bold mt-5">
                          Not existing location!
                        </Alert>
                      )
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default WeatherHome;
