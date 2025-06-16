export default function HourlyForecast({ data, deg }) {
  if (!data) return null;

  return (
    <div className="hourly-forecast">
      <h3>Prochaines 24 h</h3>
      <ul>
        {data.map((slot) => (
          <li key={slot.time}>
            <span className="hour">{slot.time}</span> –{" "}
            <img
              src={`/assets/${slot.icon}.png`}
              alt={slot.status}
              className="wx-icon"
              onError={(e) =>
                (e.currentTarget.src =
                  `https://openweathermap.org/img/wn/${slot.icon}.png`)
              }
            />{" "}
            <span className="status">{slot.status}</span> –{" "}
            <span className="temp">{slot.temp.toFixed(1)}{deg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
