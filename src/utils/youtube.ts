/**
 * Lấy số lượt xem YouTube thực tế cho một hoặc nhiều video IDs.
 *
 * Thử hai cách:
 * 1. Qua proxy backend /api/youtube/views (API key ở server, an toàn hơn)
 * 2. Gọi trực tiếp YouTube Data API v3 nếu có VITE_YOUTUBE_API_KEY
 *
 * @param youtubeIds Mảng YouTube video IDs (11 ký tự mỗi ID)
 * @returns Object map { youtubeId: viewCount }
 */
export function extractYoutubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.length === 11) return urlOrId;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
}

export async function fetchYoutubeViews(youtubeIds: string[]): Promise<Record<string, number>> {
  // Extract proper 11-char IDs even if full URLs were passed from DB
  const ids = youtubeIds
    .map(id => extractYoutubeId(id))
    .filter(id => id && id.length === 11);
    
  if (ids.length === 0) return {};

  const idsParam = ids.join(",");

  // Thử proxy backend trước (giấu key ở server)
  try {
    const res = await fetch(`/api/youtube/views?ids=${idsParam}`);
    if (res.ok) {
      const data = await res.json();
      if (Object.keys(data).length > 0) return data;
    }
  } catch {
    // Proxy không khả dụng → thử direct call
  }

  // Fallback: gọi trực tiếp YouTube API từ client
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) return {};

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${idsParam}&key=${apiKey}`
    );
    if (!res.ok) return {};
    const data = await res.json();
    const result: Record<string, number> = {};
    (data.items || []).forEach((item: any) => {
      result[item.id] = parseInt(item.statistics?.viewCount || "0");
    });
    return result;
  } catch {
    return {};
  }
}

/**
 * Format số lượt xem thành dạng ngắn gọn.
 * Trả về "---" khi chưa có dữ liệu (0 hoặc null).
 */
export function formatViews(num: number | undefined | null): string {
  if (num == null || isNaN(num) || num === 0) return "---";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString("vi-VN");
}
