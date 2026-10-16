/**
 * Converts an array of objects or an array of row arrays into properly formatted CSV string.
 * Escapes values containing commas, double quotes, or newlines by enclosing them in quotes
 * and doubling internal double quotes.
 */
export function toCsv(rows) {
  if (!rows || rows.length === 0) return "";

  // If rows is an array of objects
  let dataRows = rows;
  if (!Array.isArray(rows[0])) {
    const headers = Object.keys(rows[0]);
    dataRows = [
      headers,
      ...rows.map((row) => headers.map((header) => row[header] ?? ""))
    ];
  }

  return dataRows
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return "";
          const str = String(cell);
          if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(",")
    )
    .join("\r\n");
}

/**
 * Client-side download helper that builds a Blob, creates an object URL,
 * triggers an anchor click, and revokes the URL.
 */
export function download(text, filename = "export.csv") {
  if (typeof window === "undefined") return;

  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
