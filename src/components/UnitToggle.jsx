export default function UnitToggle({ unit, onToggle }) {
  return (
    <button className="unit-toggle" onClick={onToggle}>
      {unit === "metric" ? "°C" : "°F"}
    </button>
  );
}
