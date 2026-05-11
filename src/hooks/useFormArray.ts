/**
 * Hook for managing array fields in forms (projects, work, education, certifications)
 * Eliminates repetitive update/add/remove logic
 */
import { useState, useCallback } from "react";

export function useFormArray<T>(initialValue: T[]) {
  const [items, setItems] = useState<T[]>(initialValue);

  const update = useCallback((index: number, field: string, value: unknown) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const add = useCallback((newItem: T) => {
    setItems((prev) => [...prev, newItem]);
  }, []);

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  return { items, update, add, remove, setItems };
}
