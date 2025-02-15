const useLocalStorage = () => {
  const setItem = (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const getItem = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  };

  const removeItem = (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  };

  return { setItem, getItem, removeItem };
};

export default useLocalStorage;
