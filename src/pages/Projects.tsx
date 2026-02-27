import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const categories = [
  "Tất cả",
  "Nhà phố",
  "Biệt thự",
  "Nhà vườn",
  "Nội thất",
  "Dịch vụ khác"
];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredProjects = activeCategory === "Tất cả" 
    ? projects 
    : projects.filter((p: any) => p.category === activeCategory);

  return (
    <div className="py-24 bg-[var(--color-cream)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6">Dự án của chúng tôi</h1>
          <p className="text-lg text-[var(--color-charcoal)]/70 max-w-2xl mx-auto font-light">
            Khám phá những không gian sống đẳng cấp, được thiết kế tỉ mỉ và thi công chuẩn xác bởi đội ngũ MAI HUONG ARC.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[var(--color-wood)] text-white shadow-md"
                  : "bg-white text-[var(--color-charcoal)] border border-[var(--color-beige)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-[4/3] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project: any) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--color-beige)]"
                >
                  <Link to={`/projects/${project.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-beige)]">
                      <img
                        src={project.thumbnail || `https://loremflickr.com/800/600/architecture?lock=${project.id}`}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-10">
                        <span className="text-white font-serif font-black text-2xl md:text-3xl tracking-widest uppercase drop-shadow-lg rotate-[-30deg]">MAI HUONG ARC</span>
                      </div>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 via-white/80 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex flex-col items-center text-center">
                        <span className="inline-block px-4 py-1 bg-white/50 backdrop-blur-md text-[var(--color-charcoal)] text-xs font-bold tracking-wider uppercase rounded-full mb-2 shadow-sm">
                          {project.category}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-[var(--color-charcoal)] mb-2">{project.title}</h3>
                        <div className="text-[var(--color-charcoal)]/80 text-sm font-medium">
                          Diện Tích: {project.area} m² / Chi Phí: {project.cost || "Liên hệ"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-[var(--color-charcoal)]/50">
            <p>Chưa có dự án nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
