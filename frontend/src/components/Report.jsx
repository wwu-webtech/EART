// src/components/Report.jsx
import { useResults } from "./ResultsProvider";
import { useState, useMemo } from "react";
import CodeBlock from "./CodeBlock";

function ImageCard({ src, alt, imgnum, base }) {
  const MAX_CHARS = 120;
  const [expanded, setExpanded] = useState(false);
  const words = alt.split(" ");
  let preview = "";

  if (alt.length > MAX_CHARS) {
    for (let word of words) {
      if (preview.length + word.length + 1 > MAX_CHARS) break;
      preview += (preview ? " " : "") + word;
    }
  }

  const isLong = alt.length > MAX_CHARS;
  const fullSrc = src.match(/^https?:/) ? src : base + src;

  return (
    <div
      className="flex flex-col items-center"
      role="group"
      aria-label={`Image ${imgnum}`}
    >
      <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center drop-shadow-2xl">
        <img
          src={fullSrc}
          alt={alt || "Image with no alt text"}
          className="max-h-full object-contain"
          onError={(e) => {
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
          }}
        />
      </div>
      <h3 className="font-medium text-sm mt-1">Image #{imgnum}</h3>
      <p className="text-sm text-center" aria-hidden="true">
        {expanded || !isLong ? (
          <>
            {alt}
            {isLong && (
              <span
                onClick={() => setExpanded(false)}
                className="ml-1 text-blue-200 underline text-sm cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setExpanded(false)
                }
                aria-label="Collapse alt text"
                aria-expanded="true"
              >
                ...
              </span>
            )}
          </>
        ) : (
          <>
            {preview}
            <span
              onClick={() => setExpanded(true)}
              className="ml-1 text-blue-200 underline text-sm cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setExpanded(true)
              }
              aria-label="Expand full alt text"
              aria-expanded="false"
            >
              ...
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export function Report() {
  const { results } = useResults();
  const [sortBy, setSortBy] = useState("appearance");
  const [expandedHeadings, setExpandedHeadings] = useState({});

  const toggleHeading = (index) => {
    setExpandedHeadings((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const headings = useMemo(() => results?.headings || [], [results]);
  const headingIssues = useMemo(() => results?.heading_issues || [], [results]);
  const images = useMemo(() => results?.images || [], [results]);
  const imageIssues = useMemo(() => results?.image_issues || [], [results]);
  const base = results?.base_domain || "";

  const sortedImages = useMemo(() => {
    if (sortBy === "length") {
      return [...images].sort(
        (a, b) => a.alt.trim().length - b.alt.trim().length
      );
    }
    return images;
  }, [sortBy, images]);

  if (!results) return null;

  return (
    <div className="p-4" aria-live="polite">
      {/* Summary */}
      <div className="mb-8 p-4 bg-yellow-50 rounded-lg" role="status">
        {headingIssues.length === 0 && imageIssues.length === 0 ? (
          <p className="font-bold text-green-700">
            🎉 No accessibility issues detected!
          </p>
        ) : (
          <>
            <p className="font-bold text-red-700">
              Accessibility Issues Found:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {[...headingIssues, ...imageIssues].map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Heading Structure */}
      <section aria-labelledby="headings-title" className="mb-8">
        <h2 id="headings-title" className="font-medium text-lg mb-2">
          Heading Structure
        </h2>
        {headings.map((h, idx) => {
          const isExpanded = expandedHeadings[idx];
          const hasIssue = !!h.issue;
          return (
            <div key={idx} className="mb-1">
              <div
                className="flex items-center p-2 bg-gray-800 text-white border-4 rounded-lg group"
                style={{
                  borderColor: hasIssue
                    ? "oklch(80.8% 0.114 19.571)"
                    : "oklch(27.9% 0.041 260.031)",
                }}
              >
                <span className="w-8 text-center font-bold mr-2 text-sm">
                  h{h.level}
                </span>
                <span className="text-sm max-w-[70%] truncate">{h.text}</span>
                <div
                  onClick={() => toggleHeading(idx)}
                  className="select-none ml-auto text-sm text-white flex items-center gap-1 transition-all duration-300 group-hover:cursor-pointer ease-in-out group-hover:translate-x-[-4px]"
                >
                  <span className="flex items-end max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out">
                    {hasIssue ? (
                      <>
                        <span className="text-[oklch(80.8%_0.114_19.571)] font-bold">
                          !{" "}
                        </span>
                        Show Issue Details
                      </>
                    ) : (
                      "Show Parent HTML"
                    )}
                  </span>
                  <span
                    className="transition-all duration-300 text-lg"
                    style={
                      isExpanded
                        ? { transform: "rotate(180deg)" }
                        : { transform: "rotate(0deg)" }
                    }
                  >
                    ▾
                  </span>
                </div>
              </div>
              {isExpanded && (
                <div className="all-unset mt-1 text-xs font-mono max-w-screen">
                  {hasIssue && (
                    <p className="text-red-600 font-bold mb-2">{h.issue}</p>
                  )}
                  <CodeBlock
                    language="html"
                    label="Parent HTML code block"
                    code={h.parent_html}
                  />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Image Gallery */}
      <section aria-labelledby="images-title" className="mb-8">
        <div className="flex items-center gap-4 mb-8">
          <h2 id="images-title" className="text-lg !my-0 font-medium">
            Image Gallery
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 !my-0 bg-gray-200 rounded text-sm"
          >
            <option value="appearance">Sort by Order of Appearance</option>
            <option value="length">Sort by Alt Length</option>
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((img, i) => (
            <ImageCard key={i} {...img} imgnum={i + 1} base={base} />
          ))}
        </div>
      </section>
    </div>
  );
}
