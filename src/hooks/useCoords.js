import { useEffect, useState } from "react";
import { geocode } from "../utils/api";

/* Renvoie les coordonnées courantes.
   – si searchQuery === ""  → géolocalisation navigateur
   – sinon                  → géocodage du nom de ville                        */
export default function useCoords(searchQuery) {
  const [coords, setCoords]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* 1️⃣ géoloc par défaut ------------------------------------------------ */
  useEffect(() => {
    if (searchQuery) return;               // on ne géolocalise plus après recherche
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setCoords({ lat: coords.latitude, lon: coords.longitude });
        setLoading(false);
      },
      () => {
        setError("Géolocalisation refusée");
        setLoading(false);
      }
    );
  }, [searchQuery]);

  /* 2️⃣ géocodage quand l’utilisateur tape une ville -------------------- */
  useEffect(() => {
    if (!searchQuery) return;
    (async () => {
      try {
        setLoading(true);
        const c = await geocode(searchQuery);
        setCoords(c);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchQuery]);

  return { coords, loading, error };
}
