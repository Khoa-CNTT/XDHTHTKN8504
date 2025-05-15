export function formatDateToISO(dateStr: string): string {
  const parts = dateStr.split("/"); // ["15", "5", "2025"]
  if (parts.length !== 3) return ""; // Hoặc xử lý lỗi

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${year}-${month}-${day}`; // "2025-05-15"
}
