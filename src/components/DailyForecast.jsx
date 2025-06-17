/* eslint-disable no-irregular-whitespace */
export default function DailyForecast({ data, deg }) {
  if (!data) return null;

  return (
    <div className="daily-forecast">
      <h3>Prévisions 5 jours</h3>
      <ul>
        {data.map((d) => (
          <li key={d.label}>
            <span className="date">{d.label}</span>{" "}
            <img
              src={`/assets/${d.icon}.png`}
              alt={d.label}
              className="wx-icon"
              onError={(e) =>
              (e.currentTarget.src =
                `https://openweathermap.org/img/wn/${d.icon}.png`)
              }
            />{" "}
            <span className="temp">
              {d.low.toFixed(1)}{deg} -  {d.high.toFixed(1)}{deg}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
