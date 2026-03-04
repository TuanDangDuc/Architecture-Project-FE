import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { PlayCircle, Eye, Calendar, X, ArrowRight } from "lucide-react";

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/video")
      .then((res) => res.json())
      .then((data) => {
        // Format data to match UI requirements
        const formattedVideos = data.map((video: any) => ({
          ...video,
          id: video.id,
          title: video.title,
          thumbnail:
            video.thumbnail ||
            `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`,
          duration: video.duration,
          views: formatViews(video.views),
          date: new Date(video.created_at).toLocaleDateString("vi-VN"),
          category: video.category,
          youtubeId: video.youtube_id,
          projectId: video.project_id,
        }));
        setVideos(formattedVideos);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  const formatViews = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
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
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--color-beige)] group"
            >
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
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                  {video.duration}
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-[var(--color-gold)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm">
                    {video.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2
                  className="text-xl font-serif font-bold text-[var(--color-charcoal)] group-hover:text-[var(--color-wood)] transition-colors line-clamp-2 mb-4 cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  {video.title}
                </h2>
                <div className="flex items-center justify-between text-xs text-[var(--color-charcoal)]/60">
                  <span className="flex items-center">
                    <Eye size={14} className="mr-1" /> {video.views} lượt xem
                  </span>
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" /> {video.date}
                  </span>
                </div>
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
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors cursor-pointer"
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
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                ></iframe>
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 bg-[var(--color-gold)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm">
                      {activeVideo.category}
                    </span>
                    <span className="text-sm text-[var(--color-charcoal)]/60 flex items-center">
                      <Eye size={14} className="mr-1" /> {activeVideo.views}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-wood)]">
                    {activeVideo.title}
                  </h3>
                </div>

                {activeVideo.projectId && (
                  <Link
                    to={`/projects/${activeVideo.projectId}`}
                    className="shrink-0 inline-flex items-center justify-center px-6 py-3 bg-[var(--color-wood)] text-white font-medium rounded-full hover:bg-[var(--color-gold)] transition-colors shadow-md"
                    onClick={() => setActiveVideo(null)}
                  >
                    Xem chi tiết dự án <ArrowRight size={18} className="ml-2" />
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
