import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { PlayCircle, Eye, Calendar, X, ArrowRight } from "lucide-react";

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Review Biệt thự Thảo Điền - Không gian sống đẳng cấp ven sông",
      thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "15:20",
      views: "12K",
      date: "20/10/2023",
      category: "Biệt thự",
      youtubeId: "dQw4w9WgXcQ", // Placeholder YouTube ID
      projectId: 1
    },
    {
      id: 2,
      title: "Khám phá Penthouse Landmark 81 với thiết kế nội thất siêu sang",
      thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "12:45",
      views: "8.5K",
      date: "15/10/2023",
      category: "Nội thất",
      youtubeId: "dQw4w9WgXcQ",
      projectId: 3
    },
    {
      id: 3,
      title: "Nhà phố Minimalist 4 tầng tại Quận 7 - Tối ưu ánh sáng tự nhiên",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "10:30",
      views: "5.2K",
      date: "05/10/2023",
      category: "Nhà phố",
      youtubeId: "dQw4w9WgXcQ",
      projectId: 2
    },
    {
      id: 4,
      title: "Cải tạo căn hộ chung cư cũ thành không gian sống hiện đại",
      thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "18:15",
      views: "15K",
      date: "28/09/2023",
      category: "Cải tạo",
      youtubeId: "dQw4w9WgXcQ",
      projectId: 6
    },
    {
      id: 5,
      title: "Villa Đà Lạt phong cách Indochine - Nơi giao thoa kiến trúc",
      thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "22:00",
      views: "20K",
      date: "12/09/2023",
      category: "Nhà vườn",
      youtubeId: "dQw4w9WgXcQ",
      projectId: 4
    },
    {
      id: 6,
      title: "Kinh nghiệm thi công nội thất gỗ óc chó cao cấp",
      thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "08:50",
      views: "3.1K",
      date: "01/09/2023",
      category: "Kinh nghiệm",
      youtubeId: "dQw4w9WgXcQ",
      projectId: 5
    }
  ]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeVideo]);

  return (
    <div className="bg-[var(--color-cream)] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6">Video Review Dự Án</h1>
          <p className="text-lg text-[var(--color-charcoal)]/70 max-w-2xl mx-auto font-light">
            Trải nghiệm không gian sống thực tế qua các video review chi tiết về những dự án đã hoàn thiện của chúng tôi.
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
                  <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
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
                  <span className="flex items-center"><Eye size={14} className="mr-1" /> {video.views} lượt xem</span>
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {video.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#" className="inline-flex items-center px-8 py-4 bg-[#FF0000] text-white font-medium rounded-full hover:bg-[#CC0000] transition-all duration-300 shadow-md hover:shadow-lg">
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
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors"
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
