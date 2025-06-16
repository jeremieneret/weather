import { useEffect, useState } from "react";
import { FORECAST_URL, OW_KEY } from "../utils/api";

export default function useForecast(coords, unit, currentTemp) {
  const [hourly,  setHourly ] = useState(null);
  const [daily,   setDaily  ] = useState(null);
  const [minMax,  setMinMax ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState(null);

  useEffect(() => {
    if (!coords) return;

    (async () => {
      try {
        setLoading(true);
        const url = `${FORECAST_URL}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&lang=fr&appid=${OW_KEY}`;
        const d   = await (await fetch(url)).json();

        const tz  = d.city.timezone * 1000;
        const now = Date.now();

        /* 1️⃣  prochaines 24 h (8 pas de 3 h) */
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

        /* 2️⃣  min/max sur **la même fenêtre** */
        const temps24 = next8.map((i) => i.temp);
        if (currentTemp !== undefined) temps24.push(currentTemp);

        if (temps24.length) {
          setMinMax({
            low:  Math.min(...temps24),
            high: Math.max(...temps24),
          });
        }

        /* 3️⃣  prévisions 5 jours (inchangé) */
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
      } catch {
        setError("Impossible de charger les prévisions");
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, unit, currentTemp]);

  return { hourly, daily, minMax, loading, error };
}
