import { useEffect, useState } from "react";
import { WEATHER_URL, OW_KEY } from "../utils/api";
import { toSpeed } from "../utils/convert";

/* Donne la météo “now” */
export default function useCurrentWeather(coords, unit) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords) return;
    (async () => {
      try {
        setLoading(true);
        const url = `${WEATHER_URL}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&lang=fr&appid=${OW_KEY}`;
        const d = await (await fetch(url)).json();

        const time = new Date((d.dt + d.timezone) * 1000).toLocaleTimeString(
          "fr-FR",
          { hour: "2-digit", minute: "2-digit" }
        );

        setData({
          city: d.name,
          temp: d.main.temp,
          wind: toSpeed(d.wind.speed, unit),
          status: d.weather[0].description,
          icon: d.weather[0].icon,
          time,
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
