import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the generated index.html
const indexPath = path.join(__dirname, "dist", "index.html");

try {
  // Read the file
  const data = await fs.readFile(indexPath, "utf8");

  // Remove leading slashes in asset references, including component URLs
  const fixedContent = data
    .replace(/href="\/\./g, 'href=".')
    .replace(/src="\/\./g, 'src=".')
    // Fix astro-island component-url and renderer-url attributes
    .replace(/component-url="\/\./g, 'component-url=".')
    .replace(/renderer-url="\/\./g, 'renderer-url=".')
    // Fix any file:/// protocol references
    .replace(/file:\/\/\/ReportApp\.js/g, "./ReportApp.js")
    .replace(/file:\/\/\/client\.js/g, "./client.js");

  // Write the fixed content back
  await fs.writeFile(indexPath, fixedContent, "utf8");
  console.log("Fixed asset paths in index.html");
} catch (err) {
  console.error("Error processing index.html:", err);
}
