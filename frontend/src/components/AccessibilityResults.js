// src/components/AccessibilityResults.js
import Chart from "chart.js/auto";

let initialized = false;
const MAX_CHARS = 80;

// 1) Audit headings: returns issues and flagged indices
function auditHeadings(flatHeadings) {
  const issues = [];
  const flagged = new Set();
  let lastLevel = 0;
  let h1Count = 0;

  flatHeadings.forEach(({ tag, text }, idx) => {
    const level = parseInt(tag.slice(1), 10);
    if (level === 1) {
      h1Count++;
      if (h1Count > 1) {
        issues.push(`Multiple <h1> tags found (this one: "${text}").`);
        flagged.add(idx);
      }
    }
    if (lastLevel && level > lastLevel + 1) {
      issues.push(`Level skip: h${lastLevel} → ${tag} ("${text}").`);
      flagged.add(idx);
    }
    lastLevel = level;
  });

  if (h1Count === 0) {
    issues.unshift("No <h1> found on page.");
  }

  return { issues, flagged };
}

// 2) Build nested heading tree with visual cards
function buildHeadingTree(flatHeadings, flaggedSet) {
  const container = document.createElement("div");
  container.className = "space-y-2";

  flatHeadings.forEach((h, idx) => {
    const level = parseInt(h.tag.slice(1), 10);
    // card wrapper
    const card = document.createElement("div");
    card.className = `flex items-center p-2 border w-half rounded ${
      flaggedSet.has(idx)
        ? "bg-red-100 border-red-400"
        : "bg-none border-gray-200"
    }`;
    card.style.marginLeft = `${(level - 1) * 1.5}rem`;

    // badge for tag
    const badge = document.createElement("span");
    badge.textContent = h.tag.toUpperCase();
    badge.className = "inline-block w-8 text-center font-bold mr-2 text-sm";
    card.appendChild(badge);

    // heading text
    const text = document.createElement("span");
    text.textContent = h.text;
    text.className = "flex-1 text-sm";
    card.appendChild(text);

    container.appendChild(card);
  });

  return container;
}

// 3) Audit image alt-texts
function auditImageAlts(imageAltText) {
  const issues = [];
  imageAltText.forEach(([src, alt], i) => {
    const len = (alt || "").trim().length;
    const num = i + 1;
    if (len === 0) issues.push(`Image #${num} missing alt text: ${src}`);
    else if (len < 5)
      issues.push(`Image #${num} alt too short (${len} chars): "${alt}"`);
  });
  return issues;
}

// 4) Render summary of issues
function renderSummary(headingIssues, imageIssues) {
  const ctn = document.getElementById("results");
  const summary = document.createElement("div");
  summary.className = "mb-6 p-4 bg-yellow-50 rounded";
  const all = [...headingIssues, ...imageIssues];
  if (all.length === 0) {
    summary.innerHTML = `<p class='font-bold text-green-700'>🎉 No accessibility issues detected!</p>`;
  } else {
    summary.innerHTML = `<p class='font-bold text-red-700'>Accessibility Issues Found:</p>`;
    const ul = document.createElement("ul");
    ul.className = "list-disc list-inside text-sm text-gray-800";
    all.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      ul.appendChild(li);
    });
    summary.appendChild(ul);
  }
  ctn.appendChild(summary);
}

// 5) Main function: render headings tree & interactive image gallery
function drawCharts(data) {
  if (!data || initialized) return;
  initialized = true;
  const ctn = document.getElementById("results");
  ctn.innerHTML = "";

  // Headings tree audit
  const sections = data.headings_by_section || {};
  const flatHeadings = ["header", "main", "footer"].flatMap((sec) =>
    (sections[sec] || []).map((h) => ({
      tag: h.tag.toLowerCase(),
      text: h.text.trim(),
    }))
  );
  const { issues: hIssues, flagged } = auditHeadings(flatHeadings);
  const imgIssues = auditImageAlts(data.image_alt_text || []);
  renderSummary(hIssues, imgIssues);

  // Visual heading structure
  const treeDiv = document.createElement("div");
  treeDiv.className = "mb-8";
  const hdr = document.createElement("h3");
  hdr.textContent = "Heading Structure";
  hdr.className = "font-medium text-lg mb-2";
  treeDiv.appendChild(hdr);
  treeDiv.appendChild(buildHeadingTree(flatHeadings, flagged));
  ctn.appendChild(treeDiv);

  // Gallery controls
  const ctrl = document.createElement("div");
  ctrl.className = "flex items-center gap-4 mb-8 h-fit";
  const title = document.createElement("h3");
  title.textContent = "Image Gallery";
  title.className = "text-lg font-medium !my-0";
  const btnOrder = document.createElement("button");
  btnOrder.textContent = "Order of Appearance";
  btnOrder.className = "px-3 bg-gray-200 rounded !my-0";
  const btnLen = document.createElement("button");
  btnLen.textContent = "Sort by Alt Length";
  btnLen.className = "px-3 py-1 bg-gray-200 rounded !my-0";
  ctrl.append(title, btnOrder, btnLen);
  ctn.appendChild(ctrl);

  // Prepare images
  const base = data.base_domain || "";
  const images = (data.image_alt_text || []).map(([src, alt], i) => ({
    src: src.match(/^https?:\/\//) ? src : base + src,
    alt: alt || "",
    num: i + 1,
  }));

  // Gallery container
  const gallery = document.createElement("div");
  gallery.className =
    "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8";
  ctn.appendChild(gallery);

  // Render function
  function renderGallery(list) {
    gallery.innerHTML = "";
    list.forEach(({ src, alt, num }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "flex flex-col items-center";
      const imgWr = document.createElement("div");
      imgWr.className =
        "w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center";
      const imgEl = document.createElement("img");
      imgEl.src = src;
      imgEl.alt = alt;
      imgEl.className = "max-h-full object-contain";
      imgEl.onerror = () =>
        (imgEl.src =
          "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg");
      imgWr.appendChild(imgEl);
      const numEl = document.createElement("h4");
      numEl.textContent = `Image #${num}`;
      numEl.className = "font-medium text-sm mb-1";

      const fullText = alt.trim() || "[no alt text]";
      const needs = fullText.length > MAX_CHARS;
      const disp = needs ? fullText.slice(0, MAX_CHARS) : fullText;
      const cap = document.createElement("p");
      cap.className = "mt-2 text-center text-sm";
      if (needs) {
        const tn = document.createTextNode(disp);
        const toggle = document.createElement("span");
        toggle.textContent = "[...]";
        toggle.className = "font-medium text-[#d6e86c] pl-2 cursor-pointer";
        toggle.setAttribute("role", "button");
        toggle.setAttribute("tabindex", "0");
        toggle.setAttribute("aria-expanded", "false");
        toggle.title = "Click to expand/collapse";
        toggle.addEventListener("click", () => {
          const exp = toggle.getAttribute("aria-expanded") === "true";
          cap.textContent = exp ? disp : fullText;
          toggle.textContent = exp ? "[...]" : "[‹]";
          cap.appendChild(toggle);
          toggle.setAttribute("aria-expanded", String(!exp));
        });
        cap.append(tn, toggle);
      } else {
        cap.textContent = disp;
      }

      wrapper.append(imgWr, numEl, cap);
      gallery.appendChild(wrapper);
    });
  }

  // Initial & events
  renderGallery(images);
  btnOrder.addEventListener("click", () => renderGallery(images));
  btnLen.addEventListener("click", () => {
    const sorted = images
      .slice()
      .sort((a, b) => a.alt.trim().length - b.alt.trim().length);
    renderGallery(sorted);
  });
}

window.addEventListener("wwu-data", (e) => drawCharts(e.detail));
