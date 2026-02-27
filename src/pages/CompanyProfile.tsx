import { motion } from "motion/react";
import { Award, Users, Target, CheckCircle2 } from "lucide-react";

export default function CompanyProfile() {
  return (
    <div className="bg-[var(--color-cream)] min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[var(--color-charcoal)]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://loremflickr.com/1920/1080/modern,architecture,office?lock=company" 
            alt="Mai Huong Architects Office" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-beige)] mb-6 tracking-tight"
          >
            Hồ Sơ Năng Lực
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 font-light tracking-wide"
          >
            Công Ty TNHH Mai Hương Architects
          </motion.p>
        </div>
      </section>

      {/* About Us */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6">Về Chúng Tôi</h2>
            <div className="w-24 h-1 bg-[var(--color-gold)] mb-8"></div>
            <p className="text-lg text-[var(--color-charcoal)]/90 leading-relaxed mb-6 font-medium">
              <strong className="text-[var(--color-wood)] text-xl">Công Ty TNHH Mai Hương Architects (MAI HUONG ARC)</strong> là đơn vị tư vấn thiết kế kiến trúc và nội thất chuyên nghiệp, mang đến những giải pháp không gian sống hoàn mỹ, kết hợp hài hòa giữa công năng và thẩm mỹ.
            </p>
            <p className="text-lg text-[var(--color-charcoal)]/80 leading-relaxed mb-10">
              Với đội ngũ kiến trúc sư giàu kinh nghiệm, sáng tạo và nhiệt huyết, chúng tôi tự hào đã kiến tạo nên hàng trăm công trình đẳng cấp, từ biệt thự sang trọng, nhà phố hiện đại đến các không gian thương mại ấn tượng.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[var(--color-beige)]/30 p-8 rounded-2xl border border-[var(--color-beige)] text-center">
                <div className="text-5xl font-serif font-black text-[var(--color-wood)] mb-2">10+</div>
                <div className="text-sm font-bold text-[var(--color-charcoal)] uppercase tracking-wider">Năm kinh nghiệm</div>
              </div>
              <div className="bg-[var(--color-beige)]/30 p-8 rounded-2xl border border-[var(--color-beige)] text-center">
                <div className="text-5xl font-serif font-black text-[var(--color-wood)] mb-2">500+</div>
                <div className="text-sm font-bold text-[var(--color-charcoal)] uppercase tracking-wider">Dự án hoàn thành</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 mt-12">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://loremflickr.com/800/1000/modern,interior?lock=office1" 
                  alt="Mai Huong Architects Design" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://loremflickr.com/800/800/modern,architecture?lock=office2" 
                  alt="Mai Huong Architects Design" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://loremflickr.com/800/800/luxury,villa?lock=office3" 
                  alt="Mai Huong Architects Design" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg relative">
                <img 
                  src="https://loremflickr.com/800/1000/minimalist,house?lock=office4" 
                  alt="Mai Huong Architects Team" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-10">
                  <span className="text-white font-serif font-black text-3xl tracking-widest uppercase drop-shadow-lg rotate-[-30deg]">MAI HUONG ARC</span>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-wood)] text-white p-6 rounded-3xl shadow-2xl w-48 text-center z-20 hidden md:block border-4 border-[var(--color-cream)]">
              <Award size={40} className="text-[var(--color-gold)] mx-auto mb-3" />
              <h3 className="text-lg font-serif font-bold mb-1">Cam kết</h3>
              <p className="text-[var(--color-beige)] text-xs font-medium">Chất lượng hàng đầu</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-[var(--color-wood)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://loremflickr.com/1920/1080/blueprint,architecture?lock=bg" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 p-10 rounded-3xl border border-white/20 backdrop-blur-md shadow-xl"
            >
              <Target size={48} className="text-[var(--color-beige)] mb-6" />
              <h3 className="text-3xl font-serif font-bold mb-6 text-[var(--color-beige)]">Tầm Nhìn</h3>
              <p className="text-white/90 text-lg leading-relaxed font-light">
                Trở thành thương hiệu thiết kế kiến trúc và nội thất hàng đầu tại Việt Nam, tiên phong trong việc ứng dụng các xu hướng thiết kế bền vững và công nghệ vật liệu mới, mang lại giá trị sống đích thực cho cộng đồng.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 p-10 rounded-3xl border border-white/20 backdrop-blur-md shadow-xl"
            >
              <Users size={48} className="text-[var(--color-beige)] mb-6" />
              <h3 className="text-3xl font-serif font-bold mb-6 text-[var(--color-beige)]">Sứ Mệnh</h3>
              <p className="text-white/90 text-lg leading-relaxed font-light">
                Kiến tạo những không gian sống và làm việc không chỉ đẹp về thẩm mỹ mà còn tối ưu về công năng, phản ánh đậm nét cá tính và phong cách sống của từng gia chủ.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-wood)] mb-4">Giá Trị Cốt Lõi</h2>
          <div className="w-24 h-1 bg-[var(--color-gold)] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Sáng tạo", desc: "Không ngừng đổi mới, vượt qua mọi giới hạn để mang đến những thiết kế độc bản." },
            { title: "Tận tâm", desc: "Lắng nghe, thấu hiểu và đồng hành cùng khách hàng từ ý tưởng đến thực tế." },
            { title: "Chuyên nghiệp", desc: "Quy trình làm việc chuẩn mực, minh bạch và cam kết đúng tiến độ." }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-beige)] text-center group hover:border-[var(--color-gold)] transition-colors"
            >
              <div className="w-16 h-16 mx-auto bg-[var(--color-beige)] rounded-full flex items-center justify-center mb-6 group-hover:bg-[var(--color-gold)] transition-colors">
                <CheckCircle2 size={32} className="text-[var(--color-wood)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[var(--color-charcoal)] mb-4">{value.title}</h3>
              <p className="text-[var(--color-charcoal)]/70">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
