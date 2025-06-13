import { useState, useContext, createContext } from "react";

const ResultsContext = createContext();

export const useResults = () => {
  return useContext(ResultsContext);
};

//wraps children components to feed them report data from context
export default function ResultsProvider({ children }) {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (url) => {
    console.log(
      `[Renderer Process] Calling window.api.fetchReport for URL: ${url}`
    ); // Calling IPC
    setLoading(true);
    setError(null);
    setResults(null); // Clear previous results
    try {
      if (!window.api || typeof window.api.fetchReport !== "function") {
        console.error(
          "[Renderer Process] window.api.fetchReport is not available!"
        );
        setError("Electron API bridge is not available. Cannot fetch report.");
        setLoading(false);
        return;
      }
      const data = await window.api.fetchReport(url);
      console.log("[Renderer Process] Data received from IPC:", data); // Data from IPC

      if (data && data.error) {
        console.error(
          "[Renderer Process] Error from backend via IPC:",
          data.error
        );
        setError(data.error);
        setResults(null);
      } else if (data) {
        setResults(data);
        setError(null);
      } else {
        console.error(
          "[Renderer Process] Received undefined or null data from IPC"
        );
        setError("Received no data from backend.");
        setResults(null);
      }
    } catch (err) {
      console.error(
        "[Renderer Process] Error calling window.api.fetchReport or processing its result:",
        err.message,
        err.stack
      ); // Error in IPC call
      setError(err.message || "An unexpected error occurred.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResultsContext.Provider value={{ results, error, loading, fetchReport }}>
      {children}
    </ResultsContext.Provider>
  );
}
