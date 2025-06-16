export const toSpeed = (mps, unit) =>
  unit === "metric"
    ? `${(mps * 3.6).toFixed(0)} km/h`
    : `${(mps * 2.237).toFixed(0)} mph`;
