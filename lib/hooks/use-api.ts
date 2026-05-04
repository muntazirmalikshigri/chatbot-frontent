"use client";

import { useState } from "react";

export function useApiAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (...args: TArgs) => {
    setLoading(true);
    setError(null);
    try {
      return await action(...args);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error, setError };
}
