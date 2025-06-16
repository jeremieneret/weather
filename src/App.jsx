// src/App.jsx
import { useEffect, useState } from "react";
import SearchBar       from "./components/SearchBar";
import UnitToggle      from "./components/UnitToggle";
import CurrentWeather  from "./components/CurrentWeather";
import HourlyForecast  from "./components/HourlyForecast";
import DailyForecast   from "./components/DailyForecast";
import CityWeather     from "./components/CityWeather";

/* ---------- Endpoints ---------- */
const WEATHER_URL  = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_URL      = "https://api.openweathermap.org/geo/1.0/direct";

/* ---------- Villes fixes ---------- */
const CITY_LIST = [
  { q: "Paris,FR",  country: "France" },
  { q: "London,GB", country: "United Kingdom" },
  { q: "Milan,IT",  country: "Italy" },
];

const OW_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export default function App() {
  /* ──────── state ──────── */
  const [unit,     setUnit]   = useState("metric");   // "metric" = °C, "imperial" = °F
  const [coords,   setCoords] = useState(null);       // {lat, lon}
  const [weather,  setWeather]= useState(null);       // météo instantanée
  const [hourly,   setHourly] = useState(null);       // 8 pas de 3 h
  const [daily,    setDaily]  = useState(null);       // 5 jours
  const [cities,   setCities] = useState(null);       // Paris/London/Milan

  /* ──────── helpers ──────── */
  const deg = "°";                                    // symbole unique
  const toSpeed = (mps) =>
    unit === "metric"
      ? `${(mps * 3.6).toFixed(0)} km/h`
      : `${(mps * 2.237).toFixed(0)} mph`;

  const toggleUnit = () =>
    setUnit((u) => (u === "metric" ? "imperial" : "metric"));

  /* ──────── géocoder une ville libre ──────── */
  const geocode = async (city) => {
    const r   = await fetch(`${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${OW_KEY}`);
    const arr = await r.json();
    if (!arr.length) throw new Error("Ville introuvable");
    return { lat: arr[0].lat, lon: arr[0].lon };
  };

  const handleCitySearch = async (cityName) => {
    try {
      const c = await geocode(cityName);
      /* on réinitialise les sous-états pour afficher un "Chargement…" propre */
      setCoords(c);
      setWeather(null);
      setHourly(null);
      setDaily(null);
    } catch (err) {
      alert(`Impossible de trouver « ${cityName} »`);
    }
  };

  /* ──────── géolocalisation initiale (facultative) ──────── */
  useEffect(() => {
    if (coords) return;                                // déjà obtenu (via search)
    navigator.geolocation?.getCurrentPosition(
      ({ coords: p }) => setCoords({ lat: p.latitude, lon: p.longitude })
    );
  }, [coords]);

  /* ──────── météo instantanée ──────── */
  useEffect(() => {
    if (!coords) return;

    fetch(
      `${WEATHER_URL}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&lang=fr&appid=${OW_KEY}`
    )
      .then((r) => r.json())
      .then((d) => {
        const time = new Date((d.dt + d.timezone) * 1000).toLocaleTimeString(
          "fr-FR",
          { hour: "2-digit", minute: "2-digit" }
        );
        setWeather({
          city:   d.name,
          temp:   d.main.temp,
          wind:   toSpeed(d.wind.speed),
          status: d.weather[0].description,
          icon:   d.weather[0].icon,
          time,
        });
      });
  }, [coords, unit]);

  /* ──────── forecast : hourly + daily + min/max ──────── */
  useEffect(() => {
    if (!coords) return;

    fetch(
      `${FORECAST_URL}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&lang=fr&appid=${OW_KEY}`
    )
      .then((r) => r.json())
      .then((d) => {
        const tz  = d.city.timezone * 1000;
        const now = Date.now();

        /* ---- prochaines 24 h (8 créneaux) ---- */
        const next8 = d.list
          .filter((i) => i.dt * 1000 > now)
          .slice(0, 8)
          .map((i) => ({
            time: new Date(i.dt * 1000 + tz).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: i.weather[0].description,
            icon:   i.weather[0].icon,
            temp:   i.main.temp,
          }));
        setHourly(next8);

        /* ---- min / max du jour ---- */
        const todayKey = new Date(now + tz).toLocaleDateString("fr-FR");
        const todayTemps = d.list
          .filter(
            (i) =>
              new Date(i.dt * 1000 + tz).toLocaleDateString("fr-FR") ===
              todayKey
          )
          .map((i) => i.main.temp);
        if (weather?.temp !== undefined) todayTemps.push(weather.temp);
        if (todayTemps.length && weather) {
          setWeather((prev) => ({
            ...prev,
            tempMax: Math.max(...todayTemps),
            tempMin: Math.min(...todayTemps),
          }));
        }

        /* ---- prévisions 5 jours ---- */
        const grouped = {};
        d.list.forEach((i) => {
          const key = new Date(i.dt * 1000 + tz).toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          });
          (grouped[key] ??= []).push(i);
        });
        const days = Object.entries(grouped)
          .slice(0, 5)
          .map(([label, arr]) => {
            const temps = arr.map((e) => e.main.temp);
            const mid   = arr[Math.floor(arr.length / 2)];
            return {
              label,
              icon: mid.weather[0].icon,
              low:  Math.min(...temps),
              high: Math.max(...temps),
            };
          });
        setDaily(days);
      });
  }, [coords, unit, weather?.temp]);

  /* ──────── météo des grandes villes (indépendant) ──────── */
  useEffect(() => {
    async function fetchCity({ q, country }) {
      try {
        const r = await fetch(
          `${WEATHER_URL}?q=${q}&units=${unit}&lang=fr&appid=${OW_KEY}`
        );
        if (!r.ok) throw new Error(r.statusText);
        const d = await r.json();
        return {
          country,
          city:   d.name,
          status: d.weather[0].description,
          icon:   d.weather[0].icon,
          temp:   d.main.temp,
        };
      } catch {
        return null; // on ignore l'échec, mais on n'interrompt pas
      }
    }

    Promise.allSettled(CITY_LIST.map(fetchCity)).then((res) =>
      setCities(
        res
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value)
      )
    );
  }, [unit]);

  /* ──────── rendu ──────── */
  return (
    <div className="app-container">
      <SearchBar onSearch={handleCitySearch} />
      <UnitToggle unit={unit} onToggle={toggleUnit} />

      <CurrentWeather  weather={weather} deg={deg} />
      <HourlyForecast  data={hourly}  deg={deg} />
      <DailyForecast   data={daily}   deg={deg} />
      {cities && <CityWeather data={cities} deg={deg} />}
    </div>
  );
}
