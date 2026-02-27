import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, PlayCircle, MapPin, Ruler, DollarSign, Tag, Layers, Calendar, Phone, X } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<{url: string, type: string} | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      });
  }, [id]);

  const getVideoInfo = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1].split('?')[0];
      }
      return {
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
        type: 'youtube'
      };
    } else if (url.includes('tiktok.com')) {
      let videoId = '';
      const match = url.match(/video\/(\d+)/);
      if (match) {
        videoId = match[1];
      } else if (url.includes('/embed/v2/')) {
        videoId = url.split('/embed/v2/')[1].split('?')[0];
      }
      return {
        url: `https://www.tiktok.com/embed/v2/${videoId}`,
        type: 'tiktok'
      };
    } else {
      // Assume it's an uploaded video or direct video link
      return { url, type: 'video' };
    }
  };

  const videos = project?.video ? [project.video] : [];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
      <div className="w-12 h-12 border-4 border-[var(--color-beige)] border-t-[var(--color-gold)] rounded-full animate-spin"></div>
    </div>;
  }

  if (!project || project.error) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-wood)] font-serif text-2xl">Dự án không tồn tại</div>;
  }

  const galleryImages = project.gallery && project.gallery.length > 0 
    ? [project.thumbnail, ...project.gallery] 
    : [
        project.thumbnail || `https://loremflickr.com/1920/1080/architecture?lock=${project.id}`,
        `https://loremflickr.com/1920/1080/interior?lock=${project.id}1`,
        `https://loremflickr.com/1920/1080/interior?lock=${project.id}2`,
        `https://loremflickr.com/1920/1080/interior?lock=${project.id}3`,
        `https://loremflickr.com/1920/1080/interior?lock=${project.id}4`,
      ];

  const nextImage = () => setActiveImage((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div className="bg-[var(--color-cream)] min-h-screen pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center mb-8 text-sm font-medium text-[var(--color-charcoal)]/60">
          <Link to="/projects" className="hover:text-[var(--color-gold)] transition-colors flex items-center">
            <ArrowLeft size={16} className="mr-2" /> Trở về danh sách
          </Link>
          <span className="mx-3">/</span>
          <span className="text-[var(--color-wood)]">{project.title}</span>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-gold)] text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-4 shadow-sm">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--color-wood)] mb-4 leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-[var(--color-charcoal)]/70 font-medium">
            <div className="flex items-center"><Ruler size={18} className="mr-2 text-[var(--color-gold)]" /> {project.area} m²</div>
            <div className="flex items-center"><DollarSign size={18} className="mr-2 text-[var(--color-gold)]" /> {project.cost || "Liên hệ"}</div>
            <div className="flex items-center"><Tag size={18} className="mr-2 text-[var(--color-gold)]" /> {project.style}</div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-16">
          {/* Main Image */}
          <div className="lg:w-3/4 relative aspect-video rounded-2xl overflow-hidden bg-[var(--color-beige)] shadow-md group">
            <img 
              src={galleryImages[activeImage]} 
              alt={project.title} 
              className="w-full h-full object-cover transition-opacity duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-10">
              <span className="text-white font-serif font-black text-4xl md:text-6xl tracking-widest uppercase drop-shadow-lg rotate-[-30deg]">MAI HUONG ARC</span>
            </div>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-[var(--color-charcoal)] opacity-0 group-hover:opacity-100 transition-all shadow-md">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-[var(--color-charcoal)] opacity-0 group-hover:opacity-100 transition-all shadow-md">
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="lg:w-1/4 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(75vw*9/16)] xl:max-h-[600px] pb-2 lg:pb-0 scrollbar-hide">
            {galleryImages.map((img: string, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx)} 
                className={`cursor-pointer rounded-xl overflow-hidden border-2 shrink-0 lg:shrink w-32 lg:w-full aspect-video transition-all ${activeImage === idx ? 'border-[var(--color-gold)] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-beige)]">
                <h2 className="text-2xl font-serif font-bold text-[var(--color-wood)] mb-6">Chi tiết dự án</h2>
                
                {project.description && (
                  <p className="text-lg text-[var(--color-charcoal)]/90 font-medium mb-8 leading-relaxed border-l-4 border-[var(--color-gold)] pl-6 py-2 bg-[var(--color-beige)]/30 rounded-r-xl">
                    {project.description}
                  </p>
                )}

                {project.content ? (
                  // Render GrapesJS content directly without prose wrapper to preserve its own styling
                  <div className="grapesjs-content-wrapper" dangerouslySetInnerHTML={{ __html: project.content }} />
                ) : project.description && project.description.includes('<style>') ? (
                  // Fallback for old projects where HTML was saved in description
                  <div className="grapesjs-content-wrapper" dangerouslySetInnerHTML={{ __html: project.description }} />
                ) : (
                  <div className="prose prose-lg max-w-none text-[var(--color-charcoal)]/80 font-light leading-relaxed">
                    <p className="mb-6">
                      Dự án <strong>{project.title}</strong> là một tuyệt tác kiến trúc mang đậm dấu ấn cá nhân, kết hợp hài hòa giữa công năng sử dụng và thẩm mỹ tinh tế. Không gian được thiết kế mở, đón trọn ánh sáng tự nhiên, tạo cảm giác thoáng đãng và gần gũi với thiên nhiên.
                    </p>
                    <img src={`https://loremflickr.com/800/500/interior?lock=${project.id}5`} alt="Interior detail" className="w-full rounded-2xl my-8 object-cover aspect-[16/9]" referrerPolicy="no-referrer" />
                    <h3 className="text-xl font-serif font-bold text-[var(--color-wood)] mt-8 mb-4">Ý tưởng thiết kế</h3>
                    <p className="mb-6">
                      Lấy cảm hứng từ phong cách {project.style}, đội ngũ kiến trúc sư đã khéo léo sử dụng các vật liệu tự nhiên như gỗ, đá kết hợp với kim loại hiện đại. Từng đường nét kiến trúc đều được tính toán kỹ lưỡng để tối ưu hóa không gian sống, đồng thời thể hiện đẳng cấp của gia chủ.
                    </p>
                    <img src={`https://loremflickr.com/800/500/architecture?lock=${project.id}6`} alt="Exterior detail" className="w-full rounded-2xl my-8 object-cover aspect-[16/9]" referrerPolicy="no-referrer" />
                    <h3 className="text-xl font-serif font-bold text-[var(--color-wood)] mt-8 mb-4">Giải pháp không gian</h3>
                    <p>
                      Mặt bằng công năng được bố trí khoa học, phân khu rõ ràng nhưng vẫn đảm bảo sự kết nối xuyên suốt. Hệ thống cửa kính lớn không chỉ giúp mở rộng tầm nhìn mà còn mang lại nguồn năng lượng tích cực cho ngôi nhà mỗi ngày.
                    </p>
                  </div>
                )}
            </div>

            {/* Video Review Section */}
            {videos.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-bold text-[var(--color-wood)]">Video Review Dự Án</h2>
                  <div className="h-[1px] flex-1 bg-[var(--color-beige)] mx-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {videos.map((v, idx) => {
                    const videoInfo = getVideoInfo(v);
                    if (!videoInfo) return null;
                    
                    return (
                    <div key={idx} className="group cursor-pointer" onClick={() => videoInfo && setSelectedVideo(videoInfo)}>
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm mb-4 bg-gray-100">
                        <img 
                          src={`https://loremflickr.com/800/450/house?lock=${project.id}${idx}`} 
                          alt={`Video ${idx + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle size={32} className="text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[var(--color-charcoal)] group-hover:text-[var(--color-gold)] transition-colors">
                        Khám phá không gian thực tế {project.title} {videos.length > 1 ? `- Phần ${idx + 1}` : ''}
                      </h4>
                      <p className="text-sm text-[var(--color-charcoal)]/60 mt-1 flex items-center">
                        <Calendar size={14} className="mr-1" /> {new Date().toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )})}
                </div>
              </div>
            )}

            {/* Additional Content Section */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-beige)] mt-12 relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-wood)]"></div>
                
                <div className="prose prose-lg max-w-none text-[var(--color-charcoal)]/80 font-light leading-relaxed">
                  <h3 className="text-3xl font-serif font-bold text-[var(--color-wood)] mb-8">Vật liệu & Thi công</h3>
                  <p className="mb-6 text-xl leading-relaxed">
                    <span className="float-left text-6xl font-serif font-bold text-[var(--color-gold)] leading-none mr-3 mt-1">Đ</span>
                    ể hiện thực hóa bản vẽ thiết kế một cách hoàn hảo nhất, chúng tôi đặc biệt chú trọng vào việc lựa chọn vật liệu và quy trình thi công. Mọi chi tiết từ sàn nhà, ốp tường, đến hệ thống ánh sáng đều được tuyển chọn từ những thương hiệu uy tín, đảm bảo độ bền và tính thẩm mỹ cao nhất.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="relative group overflow-hidden rounded-2xl">
                      <img src={`https://loremflickr.com/600/400/interior?lock=${project.id}7`} alt="Material detail 1" className="w-full object-cover aspect-[4/3] m-0 transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                    <div className="relative group overflow-hidden rounded-2xl">
                      <img src={`https://loremflickr.com/600/400/interior?lock=${project.id}8`} alt="Material detail 2" className="w-full object-cover aspect-[4/3] m-0 transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                  </div>
                  
                  <div className="my-12 flex items-center justify-center">
                    <div className="h-[1px] w-24 bg-[var(--color-gold)]/50"></div>
                    <div className="mx-4 text-[var(--color-gold)]">✦</div>
                    <div className="h-[1px] w-24 bg-[var(--color-gold)]/50"></div>
                  </div>

                  <h3 className="text-3xl font-serif font-bold text-[var(--color-wood)] mt-8 mb-6">Đánh giá từ gia chủ</h3>
                  <blockquote className="border-l-4 border-[var(--color-gold)] pl-8 italic bg-[var(--color-cream)]/50 p-8 rounded-r-2xl my-8 relative">
                    <span className="absolute top-4 left-4 text-6xl text-[var(--color-gold)]/20 font-serif leading-none">"</span>
                    <p className="relative z-10 text-xl text-[var(--color-charcoal)]/90 leading-relaxed">
                      Tôi thực sự ấn tượng với sự chuyên nghiệp và tận tâm của đội ngũ MAI HUONG ARC. Họ không chỉ lắng nghe mong muốn của tôi mà còn đưa ra những giải pháp thiết kế vượt ngoài mong đợi. Không gian sống mới mang lại cho gia đình tôi cảm giác bình yên và tự hào mỗi khi đón khách.
                    </p>
                    <footer className="text-base font-bold text-[var(--color-wood)] mt-6 not-italic flex items-center">
                      <div className="w-8 h-[1px] bg-[var(--color-wood)] mr-3"></div>
                      Chủ đầu tư dự án {project.title}
                    </footer>
                  </blockquote>
                  <p className="mb-10 text-lg">
                    Sự hài lòng của khách hàng chính là thước đo thành công lớn nhất của chúng tôi. Mỗi dự án hoàn thành không chỉ là một công trình kiến trúc, mà còn là một tổ ấm mang đậm dấu ấn cá nhân, nơi lưu giữ những khoảnh khắc hạnh phúc của gia đình.
                  </p>
                  
                  <div className="mt-12 pt-8 border-t border-[var(--color-beige)] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-[var(--color-charcoal)]/60 font-medium uppercase tracking-wider">
                      Khám phá thêm các dự án khác
                    </div>
                    <Link to="/projects" className="inline-flex items-center px-8 py-4 bg-[var(--color-wood)] text-white font-medium rounded-full hover:bg-[var(--color-gold)] transition-all duration-300 shadow-md hover:shadow-lg">
                      Xem thêm dự án <ArrowRight size={20} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-beige)] sticky top-28">
              <h3 className="text-xl font-serif font-bold text-[var(--color-wood)] mb-6 pb-4 border-b border-[var(--color-beige)]">Tóm tắt thông tin</h3>
              
              <ul className="space-y-5 mb-8">
                <li className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[var(--color-charcoal)]/60 flex items-center"><Layers size={16} className="mr-2 text-[var(--color-gold)]" /> Hạng mục</span>
                  <span className="font-medium text-[var(--color-charcoal)]">{project.category}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[var(--color-charcoal)]/60 flex items-center"><Tag size={16} className="mr-2 text-[var(--color-gold)]" /> Phong cách</span>
                  <span className="font-medium text-[var(--color-charcoal)]">{project.style}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[var(--color-charcoal)]/60 flex items-center"><Ruler size={16} className="mr-2 text-[var(--color-gold)]" /> Diện tích</span>
                  <span className="font-medium text-[var(--color-charcoal)]">{project.area} m²</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[var(--color-charcoal)]/60 flex items-center"><DollarSign size={16} className="mr-2 text-[var(--color-gold)]" /> Chi phí</span>
                  <span className="font-medium text-[var(--color-charcoal)]">{project.cost || "Liên hệ"}</span>
                </li>
              </ul>

              <div className="bg-[var(--color-cream)] p-6 rounded-2xl mb-6">
                <h4 className="font-bold text-[var(--color-wood)] mb-2">Bạn thích dự án này?</h4>
                <p className="text-sm text-[var(--color-charcoal)]/70 mb-4">Hãy để lại thông tin, chúng tôi sẽ tư vấn giải pháp tương tự cho không gian của bạn.</p>
                <Link to="/contact" className="block w-full py-3 bg-[var(--color-wood)] text-white text-center font-medium rounded-xl hover:bg-[var(--color-gold)] transition-colors shadow-sm">
                  Nhận tư vấn ngay
                </Link>
              </div>
              
              <a href="tel:0909123456" className="flex items-center justify-center w-full py-3 bg-white text-[var(--color-wood)] border border-[var(--color-wood)] text-center font-medium rounded-xl hover:bg-[var(--color-beige)] transition-colors">
                <Phone size={18} className="mr-2" /> Gọi hotline: 0909 123 456
              </a>
            </div>
          </div>

        </div>
      </div>
      
      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] text-white hover:text-[var(--color-gold)] transition-colors p-2 rounded-full bg-black/50 hover:bg-black/80"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full ${selectedVideo.type === 'tiktok' ? 'max-w-[400px] aspect-[9/16]' : 'max-w-5xl aspect-video'} rounded-2xl overflow-hidden shadow-2xl bg-black`}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedVideo.type === 'video' ? (
                <video 
                  src={selectedVideo.url} 
                  className="w-full h-full outline-none"
                  controls 
                  autoPlay 
                  playsInline
                />
              ) : selectedVideo.type === 'tiktok' ? (
                // For TikTok, we use the embed player
                <iframe 
                  src={selectedVideo.url} 
                  title="TikTok video player" 
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <iframe 
                  src={selectedVideo.url} 
                  title="Video player" 
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
