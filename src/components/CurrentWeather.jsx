export default function CurrentWeather({ weather, deg }) {
  if (!weather) return <p className="loading">Chargement…</p>;

  const {
    temp,
    city,
    time,
    wind,
    tempMax,
    tempMin,
    status,
    icon,
  } = weather;

  return (
    <div className="current-weather">
      <p className="temp">{temp.toFixed(1)}{deg}</p>
      <p className="city">{city}</p>
      <p className="time">{time}</p>
      <p className="wind">
        <img src="/assets/wind.png" alt="vent" className="wind-icon" /> Vent : {wind}
      </p>
      {tempMax !== undefined && tempMin !== undefined && (
        <p className="hi-lo">
          Max : {tempMax.toFixed(1)}{deg} | Min : {tempMin.toFixed(1)}{deg}
        </p>
      )}
      <p className="status">
        <img
          src={`/assets/${icon}.png`}
          alt={status}
          onError={(e) =>
            (e.currentTarget.src = `https://openweathermap.org/img/wn/${icon}.png`)
          }
        />{" "}
        {status}
      </p>
    </div>
  );
}
