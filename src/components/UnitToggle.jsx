// src/components/UnitToggle.jsx
export default function UnitToggle({ unit, onToggle }) {
  const isMetric = unit === "metric";   // true  → °C sélectionné

  return (
    <label className="unit-toggle" aria-label="Basculer °C/°F">
      <input
        type="checkbox"
        checked={!isMetric}              /* coché  → °F sélectionné   */
        onChange={onToggle}
      />

      {/* piste + pastille + libellés */}
      <span className="slider round">
        <span className="label label-c">°C</span>
        <span className="label label-f">°F</span>
      </span>
    </label>
  );
}
