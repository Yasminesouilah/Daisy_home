import { useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" };

export function useScrollReveal(options = DEFAULT_OPTIONS) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { ...DEFAULT_OPTIONS, ...options });

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}