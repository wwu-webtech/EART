// src/components/Report.jsx
import { useResults } from "./ResultsProvider";
import { useState, useMemo } from "react";
import { useRef } from "react";
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
                className="ml-1 dark:text-blue-200 text-[#0062a0] underline text-sm cursor-pointer"
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
              className="ml-1 dark:text-blue-200 text-[#0062a0] underline text-sm cursor-pointer"
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

function VideoCard({ src, title, alt, base }) {
  const fullSrc = /^https?:/.test(src) ? src : base + src;
  const placeholder = "";

  return (
    <div className="flex flex-col items-center">
      <div className="text-center w-full h-48 text-black bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={placeholder}
          alt={`Video thumbnail for ${title || fullSrc}`}
          className="object-cover h-full w-full"
        />
      </div>
      {title && <h3 className="mt-2 text-sm font-medium">{title}</h3>}
      <a
        href={fullSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm mt-1"
      >
        View Video
      </a>
      {alt && <p className="text-xs text-gray-500 mt-1">Alt text: {alt}</p>}
    </div>
  );
}
export function Report() {
  const { results } = useResults();
  const [sortBy, setSortBy] = useState("appearance");
  const [expandedHeadings, setExpandedHeadings] = useState({});
  const toggleButtonRefs = useRef({});

  const toggleHeading = (index) => {
    setExpandedHeadings((prev) => ({ ...prev, [index]: !prev[index] }));
    // if we just closed it, return focus
    if (expandedHeadings[index]) {
      // small delay to let React un-render the panel
      setTimeout(() => {
        toggleButtonRefs.current[index]?.focus();
      }, 0);
    }
  };

  const headings = useMemo(() => results?.headings || [], [results]);
  const headingIssues = useMemo(() => results?.heading_issues || [], [results]);
  const images = useMemo(() => results?.images || [], [results]);
  const imageIssues = useMemo(() => results?.image_issues || [], [results]);
  const base = results?.base_domain || "";
  const videos = useMemo(() => results?.videos || [], [results]);

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
      {/* Heading Structure */}
      <section aria-labelledby="headings-title" className="mb-8">
        <h2 id="headings-title" className="font-medium text-lg mb-2">
          Heading Structure
        </h2>
        {/* Summary */}
        <div
          className="mb-8 p-4 dark:bg-[var(--light-green--lighter--80)] bg-[var(--blue--darker--20)] rounded-lg"
          style={{ backgroundColor: headingIssues.length > 0 && "#fcb1b1" }}
          role="status"
        >
          {headingIssues.length === 0 && imageIssues.length === 0 ? (
            <p className="!m-0 font-bold dark:text-[var(--black)] text-white">
              🎉 No heading issues detected!
            </p>
          ) : (
            <>
              <p className="!m-0 font-bold dark:text-[var(--black)] text-neutral-800">
                Heading Issues Found:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-700">
                {headingIssues.map((issueObj, i) => (
                  <li key={i}>
                    {`Heading #${issueObj.index + 1}: ${issueObj.issue}`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {/* Heading Hierarchy */}
        {headings.map((h, idx, arr) => {
          const prevLevel = idx > 0 ? arr[idx - 1].level : null;
          const isExpanded = !!expandedHeadings[idx];
          const hasIssue = !!h.issue;
          return (
            <div key={idx} className="mb-1">
              <div
                className="flex items-center p-2 bg-[var(--blue--darker--20)] text-white border-4 rounded-lg group"
                style={{
                  marginLeft: `${(h.level - 1) * 1.75}rem`,
                  borderColor: hasIssue
                    ? "#912f2f" /*red*/
                    : "var(--blue--darker--20)",
                  backgroundColor: hasIssue && "#912f2f" /*red*/,
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-12 text-center font-bold mr-2 text-sm"
                >
                  {h.index + 1 + ". h" + h.level}
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
                  role="button"
                  ref={(el) => (toggleButtonRefs.current[idx] = el)}
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-live="polite"
                  onClick={() => toggleHeading(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      toggleHeading(idx);
                    }
                    if (e.key === "Escape" && isExpanded) {
                      e.preventDefault();
                      toggleHeading(idx);
                    }
                  }}
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
                  onKeyDown={(e) => e.key === "Escape" && toggleHeading(idx)}
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
                    className=""
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
      {/* Video Gallery */}
      <section aria-labelledby="videos-title" className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 id="videos-title" className="text-lg font-medium">
            Video Gallery
          </h2>
        </div>
        {videos.length == 0 ? (
          <p>No videos on page.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((vid, idx) => (
              <VideoCard key={idx} {...vid} base={base} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid, idx) => (
            <VideoCard key={idx} {...vid} base={base} />
          ))}
        </div>
      </section>
    </div>
  );
}
