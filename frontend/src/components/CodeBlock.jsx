import React from "react";

export default function CodeBlock({
  code = "",
  language = "html",
  label = "Code block",
}) {
  // fallback for empty
  if (!code.trim()) {
    return (
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="w-full h-24 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-800 text-gray-400 text-base font-mono italic"
      >
        No code provided.
      </div>
    );
  }

  const lines = code.trimEnd().split("\n");

  return (
    <div className="relative w-full group">
      {/* scroll shadows (unchanged) */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-8 z-10 bg-gradient-to-r from-[rgba(10,14,25,0.35)] dark:from-[rgba(20,25,35,0.35)] to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-8 z-10 bg-gradient-to-l from-[rgba(10,14,25,0.35)] dark:from-[rgba(20,25,35,0.35)] to-transparent" />
      <div className="pointer-events-none absolute top-0 left-0 w-full h-6 z-10 bg-gradient-to-b from-[rgba(10,14,25,0.35)] dark:from-[rgba(20,25,35,0.35)] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 z-10 bg-gradient-to-t from-[rgba(10,14,25,0.35)] dark:from-[rgba(20,25,35,0.35)] to-transparent" />

      {/* scrollable region */}
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="w-full h-72 overflow-y-scroll overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-base font-mono p-4"
      >
        <div
          className="min-w-full grid gap-x-4"
          style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}
        >
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              {/* gutter */}
              <span
                aria-hidden="true"
                className="text-gray-500 select-none pr-4 text-right"
              >
                {idx + 1}
              </span>

              {/* now a DIV, not PRE */}
              <div
                tabIndex={0}
                aria-roledescription="line"
                aria-label={`Line ${idx + 1}: ${line || "empty line"}`}
                className={`language-${language} block whitespace-pre focus:outline-none`}
              >
                {line || "\u200B"}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
