import { useState } from "react";

export default function useSessionStorage() {
  const [value, setValue] = useState(null);

  const setItem = (key, value) => {
    // Check if the value is an object, and convert it to a JSON string
    const jsonValue = typeof value === "object" ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, jsonValue);
    setValue(value);
  };

  const getItem = (key) => {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        // Parse the value only if it is a valid JSON string
        return value;
      } catch (error) {
        // Handle parsing errors, if any
        console.error("Error parsing JSON:", error);
      }
    }
    return null;
  };

  const removeItem = (key) => {
    sessionStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
}
