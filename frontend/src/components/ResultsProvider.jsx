import { useState, useContext, createContext } from "react";

const ResultsContext = createContext();

export const useResults = () => {
  return useContext(ResultsContext);
};

//wraps children components to feed them report data from context
export default function ResultsProvider({ children }) {
  const [results, setResults] = useState(null); //init state for report data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to fetch report");

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ResultsContext.Provider value={{ results, fetchReport, error, loading }}>
      {children}
    </ResultsContext.Provider>
  );
}
