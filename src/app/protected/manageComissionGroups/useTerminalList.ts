import { useState, useEffect } from "react";
import { Terminal } from "@/app/types/common";
import { getTerminalsByRetailerAction } from "./actions";

const useTerminalList = (retailerId: string) => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getTerminalsByRetailerAction(retailerId);

        if (result.error) {
          setError(result.error);
          setTerminals([]);
        } else {
          setTerminals(result.terminals || []);
        }
      } catch (err) {
        setError("Failed to fetch terminals");
        setTerminals([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (retailerId) {
      fetchTerminals();
    }
  }, [retailerId]);

  return {
    terminals,
    isLoading,
    error,
  };
};

export default useTerminalList;
