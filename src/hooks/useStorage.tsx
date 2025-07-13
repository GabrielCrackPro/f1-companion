import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (raw !== null) {
          setStoredValue(JSON.parse(raw));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`Error loading key "${key}":`, error);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const setValue = useCallback(
    async (value: T | ((prev: T | null) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        await AsyncStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
      } catch (error) {
        console.error(`Error saving key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const remove = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
    }
  }, [key]);

  return { value: storedValue, setValue, remove, loading };
}
