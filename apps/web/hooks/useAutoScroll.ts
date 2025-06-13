import { useEffect, useRef } from "react";

/**
 * Hook do automatycznego scrollowania w dół przy nowych wiadomościach
 */
export function useAutoScroll<T = HTMLDivElement>(dependencies: unknown[] = []) {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const element = scrollRef.current as unknown as HTMLElement;
      element.scrollTop = element.scrollHeight;
    }
  }, dependencies);

  return scrollRef;
}
