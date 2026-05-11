/**
 * Hook for slug validation with debounced API checking
 */
import { useState, useCallback, useRef, useEffect } from "react";

export type SlugStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/;
const SLUG_DEBOUNCE_MS = 500;

export function useSlugValidation() {
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<SlugStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback(async (value: string) => {
    // Sanitize slug
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(sanitized);

    if (!sanitized) {
      setStatus("idle");
      return;
    }

    const valid = SLUG_REGEX.test(sanitized);
    if (!valid) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/portfolio/check-slug?slug=${sanitized}`);
        const data = await res.json();
        setStatus(data.available ? "available" : "taken");
      } catch {
        setStatus("idle");
      }
    }, SLUG_DEBOUNCE_MS);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { slug, status, checkSlug, setSlug };
}
