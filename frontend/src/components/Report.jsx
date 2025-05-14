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
    <div className="flex flex-col items-center">
      <div className="w-full h-48 bg-slate-300 rounded-lg flex items-center justify-center drop-shadow-2xl">
        <img
          src={fullSrc}
          alt={
            "Image" + imgnum.toString() + alt ||
            "Image" + imgnum.toString() + "Image with no alt text"
          }
          className="max-h-full object-contain"
          /*
          style={{
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.7";
            const textOverlay = document.createElement("div");
            textOverlay.textContent = "Click to Copy." + fullSrc;
            textOverlay.style.textAlign = "center";
            textOverlay.style.zIndex = "200";
            textOverlay.style.position = "absolute";
            textOverlay.style.bottom = "10px";
            textOverlay.style.left = "10px";
            textOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            textOverlay.style.color = "white";
            textOverlay.style.padding = "5px";
            textOverlay.style.borderRadius = "5px";
            textOverlay.style.pointerEvents = "none";
            textOverlay.className = "image-overlay";
            e.target.parentElement.appendChild(textOverlay);
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
            const overlay =
              e.target.parentElement.querySelector(".image-overlay");
            if (overlay) {
              overlay.remove();
            }
              
          }}*/
          onError={(e) => {
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
            e.target.alt =
              "Image link is broken, alt text is present and says: " + alt;
          }}
        />
      </div>
      <h3 className="font-medium text-sm mt-1" aria-hidden="true">
        Image #{imgnum}
      </h3>
      <p className="text-sm text-center" aria-hidden="true">
        {expanded || !isLong ? (
          <>
            {alt}
            {isLong && (
              <span
                onClick={() => setExpanded(false)}
                className="ml-1 dark:text-blue-200 text-blue-500 underline text-sm cursor-pointer"
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
              className="ml-1 dark:text-blue-200 text-blue-500 underline text-sm cursor-pointer"
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
      <div
        className="mb-8 p-4 dark:bg-yellow-50 bg-slate-700 rounded-lg"
        role="status"
      >
        {headingIssues.length === 0 && imageIssues.length === 0 ? (
          <p className="font-bold dark:text-green-700 text-white">
            🎉 No accessibility issues detected!
          </p>
        ) : (
          <>
            <p className="font-bold text-red-700">
              Accessibility Issues Found:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700">
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
        {headings.map((h, idx, arr) => {
          const prevLevel = idx > 0 ? arr[idx - 1].level : null;
          const isExpanded = expandedHeadings[idx];
          const hasIssue = !!h.issue;
          return (
            <div key={idx} className="mb-1">
              <div
                className="flex items-center p-2 bg-slate-700 text-white border-4 rounded-lg group"
                style={{
                  marginLeft: `${(h.level - 1) * 1.75}rem`,
                  borderColor: hasIssue
                    ? "oklch(80.8% 0.114 19.571)"
                    : "oklch(37.2% 0.044 257.287)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-8 text-center font-bold mr-2 text-sm"
                >
                  {"h" + h.level}
                </span>
                <span className="sr-only">
                  {prevLevel
                    ? `Current level: h${h.level}, previous level: h${prevLevel}`
                    : `Starting level h${h.level}`}
                </span>
                <span className="text-sm max-w-[70%] truncate">
                  <span className="sr-only">Heading Text:</span>
                  {h.text}
                </span>
                <div
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && !isExpanded
                  }
                  onClick={() => toggleHeading(idx)}
                  className="select-none ml-auto text-sm text-white flex items-center gap-1 transition-all duration-300 group-hover:cursor-pointer ease-in-out group-hover:translate-x-[-4px]"
                >
                  <span
                    role="button"
                    className="flex items-end max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out"
                  >
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
                    aria-hidden
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
                <div
                  className="all-unset mt-1 text-xs font-mono max-w-screen"
                  style={{ marginLeft: `${(h.level - 1) * 1.75}rem` }}
                >
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
            className="px-3 !my-0 bg-slate-200 rounded text-sm"
          >
            <option value="appearance">Sort by Order of Appearance</option>
            <option value="length">Sort by Alt Length</option>
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((img, i) => (
            <ImageCard key={i} {...img} base={base} />
          ))}
        </div>
      </section>
    </div>
  );
}
