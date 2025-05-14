import ResultsProvider from "./ResultsProvider";
import { ReportForm } from "./ReportForm";
import { Report } from "./Report";

export default function ReportApp() {
  return (
    <ResultsProvider>
      <div className="flex flex-col w-full">
        <ReportForm />
        <Report />
      </div>
    </ResultsProvider>
  );
}
