import { useState, useEffect } from "react";
import { useResults } from "./ResultsProvider";

export const ReportForm = () => {
  const [url, setUrl] = useState("");
  const { fetchReport, loading } = useResults();

  useEffect(() => {
    console.log("API available:", !!window.api);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with URL:", url);
    fetchReport(url);
  };

  // Rest of the component remains the same

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col items-center">
        <label className="text-center text-lg p-8">
          Enter the URL of the website you want to analyze:
        </label>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-gray-300 !w-2/3"
          placeholder="https://example.com"
        />

        <button
          type="submit"
          className=" flex !mr-0 !w-1/3 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Evaluating" : "Evaluate"}
        </button>
      </div>
    </form>
  );
};
