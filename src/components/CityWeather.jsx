export default function CityWeather({ data, deg }) {
  if (!data) return null;

  return (
    <div className="city-weather">
      <h3>Météo – grandes villes</h3>
      <ul>
        {data.map((c) => (
          <li key={c.city}>
            <span className="country">{c.country}</span> –{" "}
            <img
              src={`/assets/${c.icon}.png`}
              alt={c.status}
              className="wx-icon"
              onError={(e) =>
                (e.currentTarget.src =
                  `https://openweathermap.org/img/wn/${c.icon}.png`)
              }
            />{" "}
            <span className="city">{c.city}</span> –{" "}
            <span className="status">{c.status}</span> –{" "}
            <span className="temp">{c.temp.toFixed(1)}{deg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
