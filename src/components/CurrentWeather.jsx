import useClock from "../hooks/useClock";

export default function CurrentWeather({ weather, deg }) {
  /* hook toujours appelé, même au tout premier rendu */
  const time = useClock(weather?.tzOffset);

  if (!weather) return <p className="loading">Chargement…</p>;

  const {
    temp,
    city,
    wind,
    tempMax,
    tempMin,
    status,
    icon,
    feels_like,
  } = weather;

  return (
    <div className="current-weather">
      <div className="temp-city-time-container">
        <p className="temp">{temp.toFixed(1)}{deg}</p>
        <div className="city-and-time-container">
          <p className="city">{city}</p>
          <p className="time">{time || "…"}</p>
        </div>
      </div>

      <div className="status-wind-container">
        <p className="status">
          <img
            src={`/assets/${icon}.png`}
            alt={status}
            onError={(e) =>
            (e.currentTarget.src =
              `https://openweathermap.org/img/wn/${icon}.png`)
            }
          />{" "}
          {status}
        </p>

        <p className="wind">
          <img src="/assets/wind.png" alt="vent" className="wind-icon" />{wind}
        </p>

      </div>
      <div className="hi-lo-feels-like-container">
        {feels_like !== undefined && (
          <p className="feels-like">
            Ressenti : {feels_like.toFixed(1)}{deg}
          </p>
        )}

        {tempMax !== undefined && tempMin !== undefined && (
          <p className="hi-lo">
            {tempMin.toFixed(1)}{deg} à {tempMax.toFixed(1)}{deg}
          </p>
        )}
      </div>

    </div>
  );
}
