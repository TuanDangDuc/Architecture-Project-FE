export function formatDate(dateVal: any): string {
  if (!dateVal) return "---";
  
  try {
    // If Spring Boot returns an array like [2024, 11, 20, 15, 30]
    if (Array.isArray(dateVal)) {
      if (dateVal.length >= 3) {
        return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]).toLocaleDateString("vi-VN");
      }
      return "---";
    }

    // Try parsing as normal date
    const d = new Date(dateVal);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("vi-VN");
    }

    // Attempt replacing space with T for "YYYY-MM-DD HH:mm:ss"
    if (typeof dateVal === "string") {
      const fixedD = new Date(dateVal.replace(" ", "T"));
      if (!Number.isNaN(fixedD.getTime())) {
        return fixedD.toLocaleDateString("vi-VN");
      }
    }

    return "---";
  } catch (e) {
    return "---";
  }
}
