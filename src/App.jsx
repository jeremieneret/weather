import { useState } from "react";
import SearchBar from "./components/SearchBar";
import UnitToggle from "./components/UnitToggle";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import CityWeather from "./components/CityWeather";

import useCoords from "./hooks/useCoords";
import useCurrentWeather from "./hooks/useCurrentWeather";
import useForecast from "./hooks/useForecast";
import useFixedCities from "./hooks/useFixedCities";

import Search from '/assets/Search.svg'

import './style/CSS/style.css'

export default function App() {
  /* état global UI */
  const [unit, setUnit] = useState("metric");
  const [search, setSearch] = useState("");           // ville tapée

  const { coords } = useCoords(search);
  const { data: now } = useCurrentWeather(coords, unit);
  const { hourly, daily, minMax } = useForecast(coords, unit, now?.temp);
  const { cities } = useFixedCities(unit);

  /* fusion min/max dans l’objet courant pour reuse UI */
  const current = now && minMax ? { ...now, tempMin: minMax.low, tempMax: minMax.high } : now;

  return (
    <div className="app-container">

      <div className="search-bar-and-unit-toggle-container">
        <div className="search-bar-container">
          <img src={Search} alt="search" />
          <SearchBar onSearch={setSearch} />
        </div>
        <UnitToggle unit={unit} onToggle={() => setUnit((u) => (u === "metric" ? "imperial" : "metric"))} />
      </div>

      <div className="current-weather-and-daily-forecast-container">
        <CurrentWeather weather={current} deg="°" />
        <HourlyForecast data={hourly} deg="°" />
      </div>

      <div className="daily-forecast-and-city-weather-container">
        {cities && <CityWeather data={cities} deg="°" />}
        <DailyForecast data={daily} deg="°" />
      </div>
    </div>
  );
}
