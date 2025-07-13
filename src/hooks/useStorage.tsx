import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadValue = async () => {
      try {
        if (!key || typeof key !== 'string') {
          throw new Error('Invalid storage key provided');
        }

        const raw = await AsyncStorage.getItem(key);
        if (isMounted) {
          if (raw !== null) {
            try {
              const parsed = JSON.parse(raw);
              setStoredValue(parsed);
            } catch (parseError) {
              console.error(`Error parsing stored value for key "${key}":`, parseError);
              setStoredValue(initialValue);
              setError('Failed to parse stored data');
            }
          } else {
            setStoredValue(initialValue);
          }
        }
      } catch (error) {
        console.error(`Error loading key "${key}":`, error);
        if (isMounted) {
          setStoredValue(initialValue);
          setError(error instanceof Error ? error.message : 'Storage error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadValue();

    return () => {
      isMounted = false;
    };
  }, [key, initialValue]);

  const setValue = useCallback(
    async (value: T | ((prev: T | null) => T)) => {
      try {
        if (!key || typeof key !== 'string') {
          throw new Error('Invalid storage key provided');
        }

        const newValue = value instanceof Function ? value(storedValue) : value;
        
        // Validate the value before storing
        if (newValue === undefined) {
          throw new Error('Cannot store undefined value');
        }

        const serialized = JSON.stringify(newValue);
        await AsyncStorage.setItem(key, serialized);
        setStoredValue(newValue);
        setError(null);
      } catch (error) {
        console.error(`Error saving key "${key}":`, error);
        setError(error instanceof Error ? error.message : 'Storage error');
      }
    },
    [key, storedValue]
  );

  const remove = useCallback(async () => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid storage key provided');
      }

      await AsyncStorage.removeItem(key);
      setStoredValue(null);
      setError(null);
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
      setError(error instanceof Error ? error.message : 'Storage error');
    }
  }, [key]);

  const clear = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setStoredValue(null);
      setError(null);
    } catch (error) {
      console.error('Error clearing storage:', error);
      setError(error instanceof Error ? error.message : 'Storage error');
    }
  }, []);

  return { 
    value: storedValue, 
    setValue, 
    remove, 
    clear,
    loading, 
    error 
  };
}
