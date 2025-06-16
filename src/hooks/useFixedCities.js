import { useEffect, useState } from "react";
import { WEATHER_URL, OW_KEY } from "../utils/api";

const CITY_LIST = [
  { q: "Paris,FR",  country: "France" },
  { q: "London,GB", country: "United Kingdom" },
  { q: "Milan,IT",  country: "Italy" },
];

export default function useFixedCities(unit) {
  const [cities,  setCities ] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCity({ q, country }) {
      try {
        const url = `${WEATHER_URL}?q=${q}&units=${unit}&lang=fr&appid=${OW_KEY}`;
        const d   = await (await fetch(url)).json();
        return {
          country,
          city:   d.name,
          status: d.weather[0].description,
          icon:   d.weather[0].icon,
          temp:   d.main.temp,
        };
      } catch {
        return null;
      }
    }

    (async () => {
      setLoading(true);
      const res = await Promise.all(CITY_LIST.map(fetchCity));
      setCities(res.filter(Boolean));
      setLoading(false);
    })();
  }, [unit]);

  return { cities, loading };
}
