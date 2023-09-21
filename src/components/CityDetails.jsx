import { useEffect, useState } from "react";
import { IoIosWater } from "react-icons/io";
import { FiWind } from "react-icons/fi";
import { FaCloudRain } from "react-icons/fa";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function CustomCarousel({ items, itemsPerSlide }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  const convertToKmph = (metersPerSecond) => {
    return (metersPerSecond * 3.6).toFixed(2);
  };

  const slides = [];
  for (let i = 0; i < totalSlides; i++) {
    const startIndex = i * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    const slideItems = items.slice(startIndex, endIndex);

    slides.push(
      <Carousel.Item key={i}>
        <Row className="justify-content-center mt-5">
          {slideItems.map((item, subIndex) => (
            <Col key={subIndex} sm={6} md={6} lg={3} className="d-flex">
              <Card
                className="bg-white bg-opacity-75 rounded p-3 my-2 w-100"
                style={{ boxShadow: "9px 10px 6px -3px rgba(0,0,0,0.1)" }}
              >
                <Card.Body>
                  <div className="text-start d-flex">
                    <div>
                      <h2>
                        {item.dayOfWeek.slice(0, 3)} {item.dt_txt.slice(8, 10)}
                      </h2>
                    </div>
                    <div className="align-self-center ms-auto">
                      <h6>{item.dt_txt.slice(10, 16)}</h6>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <p className="display-4 fw-bold mb-0">{item.main.temp.toFixed(0)}</p>
                    <h6 className="mb-0 align-self-center pb-3 pb-lg-4">°C</h6>
                  </div>
                  <p className="fw-bolder">
                    {" "}
                    {item.weather[0].icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt=""
                        style={{ width: "50px" }}
                      />
                    )}{" "}
                    {item.weather[0].description}
                  </p>
                  <p className="text-start">
                    <FiWind className="me-1" />
                    Wind Speed: <strong>{convertToKmph(item.wind.speed)} km/h</strong>
                  </p>{" "}
                  {/* Conversione da m/s a km/h */}
                  <p className="text-start">
                    <IoIosWater className="text-primary me-1" />
                    Humidity: <strong>{item.main.humidity}%</strong>
                  </p>
                  <p className="text-start">
                    <FaCloudRain className="me-1" />
                    Rain percentage: <strong>{(item.pop * 100).toFixed(0)}%</strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Carousel.Item>
    );
  }

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      indicators={false}
      prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon custom-icon d-none" />}
      nextIcon={<span aria-hidden="true" className="carousel-control-next-icon custom-icon d-none" />}
    >
      {slides}
    </Carousel>
  );
}

function CityDetails() {
  const { city } = useParams();
  const [forecastData, setForecastData] = useState([]);
  const apiKey = "ec0ea160e0ae5df26aa10523ea3fc83b";

  const kelvinToCelsius = (kelvin) => kelvin - 273.15;

  const getDayOfWeek = (timestamp) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(timestamp * 1000);
    return daysOfWeek[date.getDay()];
  };

  useEffect(() => {
    if (city) {
      const fetchForecastData = async () => {
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
          const data = await response.json();

          const forecastDataWithCelsius = data.list.map((item) => ({
            ...item,
            main: {
              ...item.main,
              temp: kelvinToCelsius(item.main.temp),
            },
            dayOfWeek: getDayOfWeek(item.dt),
            dayOfWeekPrecise: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(item.dt * 1000)),
          }));

          setForecastData(forecastDataWithCelsius);
        } catch (error) {
          console.error("Error fetching forecast data:", error);
        }
      };

      fetchForecastData();
    }
  }, [city, apiKey]);

  const currentTimestamp = Date.now() / 1000;

  const futureForecastData = forecastData.filter((item) => item.dt > currentTimestamp);

  return (
    <Container>
      <h4 className="text-white text-start">Weather Forecast for {city}</h4>

      <CustomCarousel items={futureForecastData} itemsPerSlide={4} />
      <Link
        to={{
          pathname: `/`,
        }}
        style={{ textDecoration: "none" }}
      >
        <h3 className="text-white mt-5">Back to search</h3>
      </Link>
    </Container>
  );
}

export default CityDetails;
