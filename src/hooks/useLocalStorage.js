import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  function setStoredValue(nextValue) {
    setValue(nextValue);
    try {
      localStorage.setItem(key, JSON.stringify(nextValue));
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }

  return [value, setStoredValue];
}