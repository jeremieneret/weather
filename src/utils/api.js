export const OW_KEY        = import.meta.env.VITE_OPENWEATHER_API_KEY;
export const WEATHER_URL   = "https://api.openweathermap.org/data/2.5/weather";
export const FORECAST_URL  = "https://api.openweathermap.org/data/2.5/forecast";
export const GEO_URL       = "https://api.openweathermap.org/geo/1.0/direct";

export const fetchJson = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
};

export const geocode = async (city) => {
  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${OW_KEY}`;
  const [place] = await fetchJson(url);
  if (!place) throw new Error("Ville introuvable");
  return { lat: place.lat, lon: place.lon };
};
