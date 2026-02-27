import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    area: "",
    budget: "Dưới 500 triệu",
    type: "Thiết kế nhà phố",
    time: "Buổi sáng (8h-12h)",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({
          name: "", phone: "", email: "", area: "",
          budget: "Dưới 500 triệu", type: "Thiết kế nhà phố", time: "Buổi sáng (8h-12h)", description: ""
        });
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[var(--color-cream)] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6">Liên hệ & Tư vấn</h1>
          <p className="text-lg text-[var(--color-charcoal)]/70 max-w-2xl mx-auto font-light">
            Hãy để chúng tôi lắng nghe và hiện thực hóa ý tưởng về không gian sống mơ ước của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-[var(--color-beige)]">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-wood)] mb-8">Thông tin liên hệ</h2>
              <ul className="space-y-8">
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-[var(--color-cream)] rounded-full flex items-center justify-center mr-6 shrink-0">
                    <MapPin size={24} className="text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-charcoal)]/50 mb-1">Địa chỉ văn phòng</h4>
                    <p className="text-[var(--color-charcoal)] font-medium text-lg">46 Võ trường Toản , Phường 08, Tp. Đà lạt, Đà Lạt, Vietnam</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-[var(--color-cream)] rounded-full flex items-center justify-center mr-6 shrink-0">
                    <Phone size={24} className="text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-charcoal)]/50 mb-1">Hotline tư vấn</h4>
                    <a href="tel:0356210970" className="text-[var(--color-charcoal)] font-medium text-lg hover:text-[var(--color-gold)] transition-colors">035 621 0970</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-[var(--color-cream)] rounded-full flex items-center justify-center mr-6 shrink-0">
                    <Mail size={24} className="text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-charcoal)]/50 mb-1">Email</h4>
                    <a href="mailto:maihuongarchitects@gmail.com" className="text-[var(--color-charcoal)] font-medium text-lg hover:text-[var(--color-gold)] transition-colors">maihuongarchitects@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-[var(--color-cream)] rounded-full flex items-center justify-center mr-6 shrink-0">
                    <Clock size={24} className="text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-charcoal)]/50 mb-1">Giờ làm việc</h4>
                    <p className="text-[var(--color-charcoal)] font-medium text-lg">Thứ 2 - Thứ 7: 8:00 - 17:30</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl overflow-hidden h-[300px] shadow-sm border border-[var(--color-beige)]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424167419721!2d106.69842831533424!3d10.778789992319853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768ddb!2sIndependence%20Palace!5e0!3m2!1sen!2s!4v1625562234567!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </motion.div>

          {/* Consultation Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-10 md:p-12 rounded-3xl shadow-lg border border-[var(--color-beige)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-wood)] to-[var(--color-gold)]"></div>
            
            <h2 className="text-3xl font-serif font-bold text-[var(--color-wood)] mb-8">Đăng ký nhận tư vấn miễn phí</h2>
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4"
              >
                <CheckCircle2 size={48} className="text-green-500" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Gửi yêu cầu thành công!</h3>
                  <p className="text-green-700/80">Cảm ơn bạn đã quan tâm. Đội ngũ tư vấn của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Họ và tên *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Diện tích muốn xây (m²)</label>
                    <input 
                      type="number" 
                      name="area" 
                      value={formData.area} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all"
                      placeholder="Ví dụ: 100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Ngân sách dự kiến</label>
                    <select 
                      name="budget" 
                      value={formData.budget} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all appearance-none"
                    >
                      <option>Dưới 500 triệu</option>
                      <option>500tr - 1 tỷ</option>
                      <option>1 - 2 tỷ</option>
                      <option>2 - 5 tỷ</option>
                      <option>Trên 5 tỷ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Loại tư vấn *</label>
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all appearance-none"
                    >
                      <option>Thiết kế nhà phố</option>
                      <option>Thiết kế biệt thự</option>
                      <option>Thiết kế nội thất</option>
                      <option>Thi công trọn gói</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Thời gian nhận tư vấn</label>
                  <select 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all appearance-none"
                  >
                    <option>Buổi sáng (8h-12h)</option>
                    <option>Buổi chiều (13h-17h)</option>
                    <option>Buổi tối (18h-21h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)]/70 mb-2">Mô tả chi tiết yêu cầu</label>
                  <textarea 
                    name="description" 
                    rows={4} 
                    value={formData.description} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all resize-none"
                    placeholder="Chia sẻ thêm về ý tưởng, phong cách yêu thích hoặc yêu cầu đặc biệt của bạn..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--color-wood)] text-white font-bold text-lg rounded-xl hover:bg-[var(--color-gold)] transition-colors shadow-md flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Send size={20} className="mr-2" />
                  )}
                  GỬI YÊU CẦU TƯ VẤN
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
