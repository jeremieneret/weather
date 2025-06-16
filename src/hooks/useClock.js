import { useEffect, useState } from "react";

/* offsetSec : décalage en secondes par rapport à UTC.
   S’il vaut null/undefined/NaN, on renvoie "" jusqu’à ce qu’il soit défini. */
export default function useClock(offsetSec) {
  const valid = Number.isFinite(offsetSec);
  const makeDate = () =>
    valid ? new Date(Date.now() + offsetSec * 1000) : null;

  const [dt, setDt] = useState(makeDate);

  useEffect(() => {
    if (!valid) return;           // on attend un offset valable
    const tick = () => setDt(makeDate());
    const id = setInterval(tick, 60_000);
    tick();
    return () => clearInterval(id);
  }, [offsetSec, valid]);

  if (!dt) return "";             // rien à afficher tant que pas prêt

  return dt.toLocaleTimeString("fr-FR", {
    hour:    "2-digit",
    minute:  "2-digit",
    timeZone: "UTC",              // on force UTC puis on applique l'offset
  });
}
