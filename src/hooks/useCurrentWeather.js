import { useEffect, useState } from "react";
import { WEATHER_URL, OW_KEY } from "../utils/api";
import { toSpeed }             from "../utils/convert";

export default function useCurrentWeather(coords, unit) {
  const [data,    setData   ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState(null);

  useEffect(() => {
    if (!coords) return;

    (async () => {
      try {
        setLoading(true);
        const url = `${WEATHER_URL}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&lang=fr&appid=${OW_KEY}`;
        const d   = await (await fetch(url)).json();

        setData({
          city:   d.name,
          temp:   d.main.temp,
          wind:   toSpeed(d.wind.speed, unit),
          status: d.weather[0].description,
          icon:   d.weather[0].icon,
          tzOffset: d.timezone,  
          feels_like: d.main.feels_like,
        });
        setError(null);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        setError("Impossible de charger la météo courante");
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, unit]);

  return { data, loading, error };
}
