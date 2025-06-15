// Helper function to get today's date in YYYY-MM-DD format
export function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}
