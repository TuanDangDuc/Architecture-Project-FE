import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Home as HomeIcon, Building, TreePine, Sofa, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Logo2 from "../components/Logo2";

const services = [
  { icon: HomeIcon, title: "Nhà phố", desc: "Tối ưu không gian sống đô thị" },
  { icon: Building, title: "Biệt thự", desc: "Đẳng cấp, sang trọng, tinh tế" },
  { icon: TreePine, title: "Nhà vườn", desc: "Giao hòa cùng thiên nhiên" },
  { icon: Sofa, title: "Nội thất", desc: "Cá nhân hóa từng chi tiết" },
];

const testimonials = [
  { name: "Anh Minh", role: "Chủ đầu tư Biệt thự Quận 2", content: "Rất hài lòng với thiết kế tối giản nhưng vô cùng sang trọng. Đội ngũ làm việc chuyên nghiệp, đúng tiến độ." },
  { name: "Chị Lan", role: "Chủ nhà phố Gò Vấp", content: "Không gian sống được tối ưu tuyệt vời. Ánh sáng tự nhiên ngập tràn, cảm giác rất ấm cúng và thoải mái." },
];

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setFeaturedProjects(data.slice(0, 6));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] py-24 flex items-center justify-center overflow-hidden bg-[var(--color-charcoal)]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Architecture" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Logo2 className="w-45 h-45 text-white mx-auto drop-shadow-lg" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg"
          >
            MAI HƯƠNG ARCHITECTS <br/>
            <span className="text-[var(--color-beige)] italic font-light text-3xl md:text-5xl mt-4 block drop-shadow-md">Kiến tạo không gian, Nâng tầm phong cách</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md"
          >
            Công Ty TNHH Mai Hương Architects mang đến những giải pháp thiết kế kiến trúc và nội thất tối giản, hiện đại, đậm dấu ấn cá nhân cho tổ ấm của bạn.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/portfolio" className="px-8 py-4 bg-[var(--color-wood)] text-white font-medium rounded-full hover:bg-[var(--color-gold)] transition-all duration-300 w-full sm:w-auto text-center flex items-center justify-center shadow-lg hover:shadow-xl border border-transparent">
              Về Chúng Tôi <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/projects" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-medium rounded-full hover:bg-white hover:text-[var(--color-wood)] transition-all duration-300 w-full sm:w-auto text-center shadow-md hover:shadow-lg">
              Xem Dự Án
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-wood)] mb-4">Dịch vụ của chúng tôi</h2>
            <div className="w-24 h-1 bg-[var(--color-gold)] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[var(--color-beige)] group"
              >
                <div className="w-14 h-14 bg-[var(--color-beige)] rounded-full flex items-center justify-center mb-6 group-hover:bg-[var(--color-gold)] transition-colors">
                  <service.icon size={28} className="text-[var(--color-wood)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3 text-[var(--color-charcoal)]">{service.title}</h3>
                <p className="text-[var(--color-charcoal)]/70 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-[var(--color-beige)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-wood)] mb-4">Dự Án Nổi Bật</h2>
              <div className="w-24 h-1 bg-[var(--color-gold)]"></div>
            </div>
            <Link to="/projects" className="hidden md:flex items-center text-[var(--color-wood)] font-medium hover:text-[var(--color-gold)] transition-colors group">
              Xem tất cả <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl aspect-[4/5] animate-pulse"></div>
              ))
            ) : featuredProjects.length > 0 ? (
              featuredProjects.map((project: any, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer bg-[var(--color-beige)]"
                >
                  <Link to={`/projects/${project.id}`}>
                    <img 
                      src={project.thumbnail || `https://loremflickr.com/800/1000/architecture?lock=${project.id}`} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-10">
                      <span className="text-white font-serif font-black text-3xl md:text-4xl tracking-widest uppercase drop-shadow-lg rotate-[-30deg]">MAI HUONG ARC</span>
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 via-white/80 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex flex-col items-center text-center">
                      <span className="inline-block px-4 py-1 bg-white/50 backdrop-blur-md text-[var(--color-charcoal)] text-xs font-bold tracking-wider uppercase rounded-full mb-2 shadow-sm">
                        {project.category}
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-charcoal)] mb-2">{project.title}</h3>
                      <div className="text-[var(--color-charcoal)]/80 text-sm font-medium">
                        Diện Tích: {project.area} m² / Chi Phí: {project.cost || "Liên hệ"}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-[var(--color-charcoal)]/50">
                Chưa có dự án nào.
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/projects" className="inline-flex items-center px-8 py-4 bg-[var(--color-wood)] text-white font-medium rounded-full hover:bg-[var(--color-gold)] transition-all duration-300 shadow-md hover:shadow-lg">
              Xem toàn bộ Dự Án <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-24 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-beige)] mb-6 leading-tight">
                Trải nghiệm không gian thực tế
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed font-light">
                Mỗi công trình là một tác phẩm nghệ thuật được chăm chút tỉ mỉ từ bản vẽ đến thực tế. Hãy cùng chúng tôi dạo bước qua những không gian sống đã được hiện thực hóa.
              </p>
              <ul className="space-y-4 mb-10">
                {['Thiết kế tinh tế, tối giản', 'Vật liệu cao cấp, bền vững', 'Thi công chuẩn xác 99% bản vẽ'].map((item, i) => (
                  <li key={i} className="flex items-center text-white">
                    <CheckCircle2 size={20} className="text-[var(--color-beige)] mr-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/portfolio" className="inline-flex px-8 py-4 bg-[var(--color-beige)] text-[var(--color-charcoal)] font-medium rounded-full hover:bg-white transition-colors">
                Khám phá thêm
              </Link>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/video/1280/720" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[var(--color-gold)] hover:scale-110 transition-all duration-300 group">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2 group-hover:border-l-white"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-wood)] mb-4">Khách hàng nói gì</h2>
            <div className="w-24 h-1 bg-[var(--color-gold)] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-[var(--color-beige)] relative"
              >
                <div className="text-6xl text-[var(--color-gold)] opacity-20 font-serif absolute top-6 left-6">"</div>
                <p className="text-lg text-[var(--color-charcoal)]/80 italic mb-8 relative z-10 leading-relaxed">
                  {t.content}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-beige)] rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold text-[var(--color-wood)]">{t.name}</h4>
                    <p className="text-sm text-[var(--color-charcoal)]/60">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
