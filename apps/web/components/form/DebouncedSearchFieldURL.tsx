"use client";

import { SearchFieldURL } from "@/components";
import { useEffect, useRef, useState } from "react";

type DebouncedSearchFieldURLProps = {
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
};

export function DebouncedSearchFieldURL({
  value,
  onChange,
  debounceMs = 300,
  placeholder,
}: DebouncedSearchFieldURLProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Sync with external value changes ONLY when not actively typing
  useEffect(() => {
    if (value !== localValue && !isTypingRef.current) {
      setLocalValue(value);
    }
  }, [value, localValue]); // Remove localValue dependency to prevent loops

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLocalChange = (inputValue: string) => {
    // Mark as actively typing
    isTypingRef.current = true;

    // Update local value immediately for smooth UI
    setLocalValue(inputValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced timeout
    timeoutRef.current = setTimeout(() => {
      onChange(inputValue);
      // Mark typing as finished after debounce
      isTypingRef.current = false;
    }, debounceMs);
  };

  return (
    <SearchFieldURL value={localValue} onChange={handleLocalChange} placeholder={placeholder} />
  );
}

// Alternative: Simpler version that just uses SearchFieldURL's built-in debouncing
export function DebouncedSearchFieldURLSimple({
  value,
  onChange,
  debounceMs = 300,
  placeholder,
}: DebouncedSearchFieldURLProps) {
  return (
    <SearchFieldURL
      value={value}
      onChange={onChange}
      debounceMs={debounceMs}
      placeholder={placeholder}
    />
  );
}
