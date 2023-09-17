import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import WeatherHome from "./components/WeatherHome";
import CityDetails from "./components/CityDetails";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WeatherHome />} />
          <Route path="/forecast/:city" element={<CityDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
