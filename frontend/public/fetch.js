export async function getData(url) {
  // normalize URL
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const resp = await fetch("http://127.0.0.1:5000/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!resp.ok) {
    throw new Error(`Server error: ${resp.status}`);
  }
  return resp.json();
}
