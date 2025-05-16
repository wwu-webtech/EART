// src/components/CodeBlock.jsx
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
    <div className="relative w-full">
      {/* scroll shadows */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-8 rounded-xl bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-8 rounded-xl bg-gradient-to-l from-gray-200 dark:from-gray-800 to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 left-0 w-full h-6 rounded-xl bg-gradient-to-b from-gray-200 dark:from-gray-800 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 rounded-xl bg-gradient-to-t from-gray-200 dark:from-gray-800 to-transparent z-10" />

      {/* scrollable region */}
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="w-full h-72 overflow-y-scroll overflow-x-auto rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-mono text-md p-4"
      >
        <div className="w-full">
          {lines.map((line, idx) => {
            const text = line || "empty line";
            const labelText = `Line ${idx + 1}: ${text}`;
            return (
              <div
                key={idx}
                tabIndex={0}
                aria-label={labelText}
                className="grid grid-cols-[auto_1fr] gap-x-4 focus:outline-none mb-1"
              >
                {/* visible gutter, hidden from SR */}
                <span
                  aria-hidden="true"
                  className="text-gray-500 pr-4 text-right"
                >
                  {idx + 1}
                </span>
                {/* visible code, hidden from SR */}
                <span
                  aria-hidden="true"
                  className={`language-${language} whitespace-pre`}
                >
                  {line || "\u200B"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
