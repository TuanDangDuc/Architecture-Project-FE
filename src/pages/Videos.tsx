import { API_BASE } from "../config/api.ts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { PlayCircle, Eye, Calendar, X, ArrowRight, Clock, FolderOpen } from "lucide-react";
import { fetchYoutubeViews, formatViews, extractYoutubeId } from "../utils/youtube.ts";

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [projectNames, setProjectNames] = useState<Record<number, string>>({});
  const [ytViewsLoading, setYtViewsLoading] = useState(false);

  // Fetch project names to show on cards/modal
  useEffect(() => {
    fetch(`${API_BASE}/api/project`)
      .then(res => res.json())
      .then((data: any[]) => {
        const map: Record<number, string> = {};
        (Array.isArray(data) ? data : []).forEach(p => {
          map[p.id] = p.name || p.title || `Dự án #${p.id}`;
        });
        setProjectNames(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/video`)
      .then((res) => res.json())
      .then(async (data) => {
        const formattedVideos = data.map((video: any) => ({
          ...video,
          id: video.id,
          title: video.title,
          thumbnail:
            video.thumbnailUrl ||
            `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          duration: video.duration,
          // Use backend views if > 0, otherwise show loading placeholder
          views: video.views || 0,
          viewsDisplay: video.views > 0 ? formatViews(video.views) : null,
          date: video.createdAt
            ? new Date(video.createdAt).toLocaleDateString("vi-VN")
            : "---",
          category:
            typeof video.category === "object"
              ? video.category?.name
              : video.category,
          youtubeId: video.youtubeId,
          projectId: video.projectId,
          // linkUrl: stored link to the project page (set by admin)
          // Fall back to building link from projectId if linkUrl is absent
          linkUrl: video.linkUrl || (video.projectId ? `/projects/${video.projectId}` : ""),
        }));
        setVideos(formattedVideos);

        // Fetch real YouTube view counts (needs YOUTUBE_API_KEY or VITE_YOUTUBE_API_KEY)
        const ids = formattedVideos.map((v: any) => v.youtubeId).filter(Boolean);
        if (ids.length > 0) {
          setYtViewsLoading(true);
          fetchYoutubeViews(ids)
            .then(statsMap => {
              if (Object.keys(statsMap).length > 0) {
                setVideos(prev =>
                  prev.map(v => {
                    const ytId = extractYoutubeId(v.youtubeId);
                    const ytViews = statsMap[ytId];
                    if (ytViews !== undefined) {
                      return { ...v, views: ytViews, viewsDisplay: formatViews(ytViews) };
                    }
                    return { ...v, viewsDisplay: v.viewsDisplay ?? "---" };
                  })
                );
              } else {
                // No YouTube data — finalize with "---" for all
                setVideos(prev => prev.map(v => ({ ...v, viewsDisplay: v.viewsDisplay ?? "---" })));
              }
            })
            .catch(() => {
              setVideos(prev => prev.map(v => ({ ...v, viewsDisplay: v.viewsDisplay ?? "---" })));
            })
            .finally(() => setYtViewsLoading(false));
        }
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [activeVideo]);

  return (
    <div className="bg-[var(--color-cream)] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6">
            Video Review Dự Án
          </h1>
          <p className="text-lg text-[var(--color-charcoal)]/70 max-w-2xl mx-auto font-light">
            Trải nghiệm không gian sống thực tế qua các video review chi tiết về
            những dự án đã hoàn thiện của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--color-beige)] group flex flex-col"
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-video overflow-hidden cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <PlayCircle
                    size={64}
                    className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  />
                </div>
                {video.duration && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
                    <Clock size={10} />
                    {video.duration}
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-[var(--color-gold)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm">
                    {typeof video.category === "object" ? video.category?.name : video.category}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1">
                <h2
                  className="text-xl font-serif font-bold text-[var(--color-charcoal)] group-hover:text-[var(--color-wood)] transition-colors line-clamp-2 mb-3 cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  {video.title}
                </h2>

                <div className="flex items-center justify-between text-xs text-[var(--color-charcoal)]/60 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {video.viewsDisplay !== null
                      ? `${video.viewsDisplay} lượt xem`
                      : ytViewsLoading
                        ? <span className="inline-flex items-center gap-1">Đang tải<span className="animate-pulse">...</span></span>
                        : "--- lượt xem"
                    }
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {video.date}
                  </span>
                </div>

                {/* Project link badge on card — uses linkUrl */}
                {video.linkUrl && (
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link
                      to={video.linkUrl}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-wood)] hover:text-[var(--color-gold)] transition-colors group/link"
                      onClick={e => e.stopPropagation()}
                    >
                      <FolderOpen size={15} className="shrink-0" />
                      <span className="line-clamp-1">
                        {video.projectId && projectNames[video.projectId]
                          ? projectNames[video.projectId]
                          : "Xem chi tiết dự án"}
                      </span>
                      <ArrowRight size={14} className="shrink-0 opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-[#FF0000] text-white font-medium rounded-full hover:bg-[#CC0000] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Đăng ký kênh Youtube <PlayCircle size={20} className="ml-2" />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              onClick={() => setActiveVideo(null)}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl bg-[var(--color-charcoal)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* YouTube embed */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                ></iframe>
              </div>

              {/* Info + project button */}
              <div className="p-6 md:p-8 bg-white">
                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="inline-block px-3 py-1 bg-[var(--color-gold)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm">
                    {activeVideo.category}
                  </span>
                  <span className="text-sm text-[var(--color-charcoal)]/60 flex items-center gap-1">
                    <Eye size={14} /> {activeVideo.viewsDisplay ?? "---"} lượt xem
                  </span>
                  {activeVideo.duration && (
                    <span className="text-sm text-[var(--color-charcoal)]/60 flex items-center gap-1">
                      <Clock size={14} /> {activeVideo.duration}
                    </span>
                  )}
                  <span className="text-sm text-[var(--color-charcoal)]/60 flex items-center gap-1">
                    <Calendar size={14} /> {activeVideo.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif font-bold text-[var(--color-wood)] mb-4">
                  {activeVideo.title}
                </h3>

                {/* Project link button in modal — uses linkUrl */}
                {activeVideo.linkUrl && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">Dự án liên quan</p>
                    <Link
                      to={activeVideo.linkUrl}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--color-wood)] text-white font-medium rounded-full hover:bg-[var(--color-gold)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                      onClick={() => setActiveVideo(null)}
                    >
                      <FolderOpen size={18} />
                      {activeVideo.projectId && projectNames[activeVideo.projectId]
                        ? projectNames[activeVideo.projectId]
                        : "Xem chi tiết dự án"}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
