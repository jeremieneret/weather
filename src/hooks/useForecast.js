import { useEffect, useState } from "react";
import { FORECAST_URL, OW_KEY } from "../utils/api";

/* Renvoie : hourly (8×3 h), daily (5 jours), min/max du jour */
export default function useForecast(coords, unit, currentTemp) {
  const [hourly,   setHourly  ] = useState(null);
  const [daily,    setDaily   ] = useState(null);
  const [minMax,   setMinMax  ] = useState(null);
  const [loading,  setLoading ] = useState(false);
  const [error,    setError   ] = useState(null);

  useEffect(() => {
    if (!coords) return;
    (async () => {
      try {
        setLoading(true);
        const url = `${FORECAST_URL}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&lang=fr&appid=${OW_KEY}`;
        const d   = await (await fetch(url)).json();

        const tz  = d.city.timezone * 1000;
        const now = Date.now();

        /* 8 créneaux sur 24 h */
        setHourly(
          d.list
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
            }))
        );

        /* min/max du jour (patch avec temp courante) */
        const todayKey = new Date(now + tz).toLocaleDateString("fr-FR");
        const todayTemps = d.list
          .filter(
            (i) =>
              new Date(i.dt * 1000 + tz).toLocaleDateString("fr-FR") ===
              todayKey
          )
          .map((i) => i.main.temp);
        if (currentTemp !== undefined) todayTemps.push(currentTemp);
        if (todayTemps.length)
          setMinMax({
            low:  Math.min(...todayTemps),
            high: Math.max(...todayTemps),
          });

        /* prévisions 5 jours */
        const grouped = {};
        d.list.forEach((i) => {
          const key = new Date(i.dt * 1000 + tz).toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          });
          (grouped[key] ??= []).push(i);
        });

        setDaily(
          Object.entries(grouped)
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
            })
        );

        setError(null);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        setError("Impossible de charger les prévisions");
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, unit, currentTemp]);

  return { hourly, daily, minMax, loading, error };
}
