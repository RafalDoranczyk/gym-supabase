import { useCallback } from "react";

export function useBenchmark() {
  const benchmark = useCallback((name: string, iterations: number, fn: () => unknown) => {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      times.push(end - start);
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.log(`${name}:`, {
      average: `${avg.toFixed(4)}ms`,
      min: `${min.toFixed(4)}ms`,
      max: `${max.toFixed(4)}ms`,
      iterations,
    });
  }, []);

  return { benchmark };
}
