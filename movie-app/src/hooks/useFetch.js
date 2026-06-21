import { useEffect, useState, useCallback } from "react";

export default function useFetch(asyncFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (isActive()) setData(result);
    } catch (err) {
      if (isActive()) setError(err);
    } finally {
      if (isActive()) setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    let active = true;
    run(() => active);
    return () => {
      active = false;
    };
  }, [run]);

  return { data, loading, error, refetch: () => run() };
}
