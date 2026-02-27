import { Link, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ChevronDown } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-md border-b border-[var(--color-beige)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <Logo className="w-10 h-10 text-[var(--color-wood)]" />
                <span className="text-2xl font-serif font-black text-[var(--color-wood)] tracking-widest uppercase hidden sm:block">
                  MAI HUONG <span className="font-light">ARC</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 h-full">
              <Link to="/" className="text-sm font-medium hover:text-[var(--color-gold)] transition-colors">Trang chủ</Link>
              <Link to="/portfolio" className="text-sm font-medium hover:text-[var(--color-gold)] transition-colors">Portfolio</Link>
              
              <div className="relative group h-full flex items-center">
                <Link to="/projects" className="flex items-center text-sm font-medium hover:text-[var(--color-gold)] transition-colors py-8">
                  Dự án <ChevronDown size={16} className="ml-1" />
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div className="absolute top-[100%] left-1/2 -translate-x-[60%] w-max bg-white shadow-xl border-t-2 border-[var(--color-wood)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-b-xl">
                  <div className="p-6 grid grid-cols-5 gap-6">
                    {/* Column 1 */}
                    <div>
                      <h4 className="font-bold text-sm mb-4 uppercase text-[var(--color-charcoal)]">Nhà vườn</h4>
                      <ul className="space-y-3">
                        <li><Link to="/projects?category=nha-gac-lung-san-vuon" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà gác lửng sân vườn</Link></li>
                        <li><Link to="/projects?category=nha-vuon-mai-nhat" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà vườn mái Nhật</Link></li>
                        <li><Link to="/projects?category=nha-vuon-mai-bang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà vườn mái bằng</Link></li>
                        <li><Link to="/projects?category=nha-vuon-mai-truyen-thong" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà vườn mái truyền thống</Link></li>
                        <li><Link to="/projects?category=nha-vuon-mai-thai" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà vườn mái Thái</Link></li>
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <h4 className="font-bold text-sm mb-4 uppercase text-[var(--color-charcoal)]">Nhà phố</h4>
                      <ul className="space-y-3">
                        <li><Link to="/projects?category=nha-pho-gac-lung" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà phố gác lửng</Link></li>
                        <li><Link to="/projects?category=nha-pho-1-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà phố 1 tầng</Link></li>
                        <li><Link to="/projects?category=nha-pho-2-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà phố 2 tầng</Link></li>
                        <li><Link to="/projects?category=nha-pho-3-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà phố 3 tầng</Link></li>
                        <li><Link to="/projects?category=nha-pho-4-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà phố 4 tầng</Link></li>
                      </ul>
                    </div>
                    {/* Column 3 */}
                    <div>
                      <h4 className="font-bold text-sm mb-4 uppercase text-[var(--color-charcoal)]">Biệt thự</h4>
                      <ul className="space-y-3">
                        <li><Link to="/projects?category=biet-thu-2-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Biệt thự 2 tầng</Link></li>
                        <li><Link to="/projects?category=biet-thu-3-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Biệt thự 3 tầng</Link></li>
                        <li><Link to="/projects?category=biet-thu-4-tang" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Biệt thự 4 tầng</Link></li>
                      </ul>
                    </div>
                    {/* Column 4 */}
                    <div>
                      <h4 className="font-bold text-sm mb-4 uppercase text-[var(--color-charcoal)]">Công trình thực tế</h4>
                      <ul className="space-y-3">
                        <li><Link to="/projects?category=thuc-te-nha-vuon" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà vườn</Link></li>
                        <li><Link to="/projects?category=thuc-te-nha-pho" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Nhà phố</Link></li>
                        <li><Link to="/projects?category=thuc-te-biet-thu" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Biệt thự</Link></li>
                      </ul>
                    </div>
                    {/* Column 5 */}
                    <div>
                      <h4 className="font-bold text-sm mb-4 uppercase text-[var(--color-charcoal)]">Công trình dịch vụ</h4>
                      <ul className="space-y-3">
                        <li><Link to="/projects?category=cafe" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Cafe</Link></li>
                        <li><Link to="/projects?category=homestay" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Homestay</Link></li>
                        <li><Link to="/projects?category=khach-san" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Khách sạn</Link></li>
                        <li><Link to="/projects?category=spa" className="text-sm text-[var(--color-charcoal)]/70 hover:text-[var(--color-gold)] transition-colors block border-b border-[var(--color-beige)] pb-2">Spa</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/videos" className="text-sm font-medium hover:text-[var(--color-gold)] transition-colors">Video</Link>
              <Link to="/posts" className="text-sm font-medium hover:text-[var(--color-gold)] transition-colors">Tin tức</Link>
              <Link to="/contact" className="text-sm font-medium hover:text-[var(--color-gold)] transition-colors">Liên hệ</Link>
              <Link to="/contact" className="px-5 py-2.5 bg-[var(--color-wood)] text-white text-sm font-medium rounded-full hover:bg-[var(--color-gold)] transition-colors shadow-sm">
                Nhận tư vấn
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[var(--color-wood)] hover:text-[var(--color-gold)] transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[var(--color-cream)] border-b border-[var(--color-beige)] overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:bg-[var(--color-beige)] rounded-lg transition-colors">Trang chủ</Link>
                <Link to="/portfolio" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:bg-[var(--color-beige)] rounded-lg transition-colors">Portfolio</Link>
                <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:bg-[var(--color-beige)] rounded-lg transition-colors">Dự án</Link>
                <Link to="/videos" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:bg-[var(--color-beige)] rounded-lg transition-colors">Video</Link>
                <Link to="/posts" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:bg-[var(--color-beige)] rounded-lg transition-colors">Tin tức</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:bg-[var(--color-beige)] rounded-lg transition-colors">Liên hệ</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block mt-4 px-3 py-3 bg-[var(--color-wood)] text-white text-center text-base font-medium rounded-lg hover:bg-[var(--color-gold)] transition-colors">
                  Nhận tư vấn
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-beige)] text-[var(--color-charcoal)] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Logo className="w-10 h-10 text-[var(--color-wood)]" />
                <h3 className="text-2xl font-serif font-black text-[var(--color-wood)] tracking-widest uppercase">MAI HUONG <span className="font-light">ARC</span></h3>
              </div>
              <p className="text-sm opacity-80 leading-relaxed max-w-sm">
                TƯ VẤN- THIẾT KẾ- THI CÔNG XÂY DỰNG
              </p>
            </div>
            <div>
              <h4 className="text-lg font-serif font-semibold text-[var(--color-wood)] mb-6">Liên hệ</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm opacity-80">
                  <MapPin size={18} className="text-[var(--color-wood)] shrink-0 mt-0.5" />
                  <span>46 Võ trường Toản , Phường 08, Tp. Đà lạt, Đà Lạt, Vietnam</span>
                </li>
                <li className="flex items-center space-x-3 text-sm opacity-80">
                  <Phone size={18} className="text-[var(--color-wood)] shrink-0" />
                  <span>035 621 0970</span>
                </li>
                <li className="flex items-center space-x-3 text-sm opacity-80">
                  <Mail size={18} className="text-[var(--color-wood)] shrink-0" />
                  <span>maihuongarchitects@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif font-semibold text-[var(--color-wood)] mb-6">Kết nối</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-wood)]/10 text-[var(--color-wood)] flex items-center justify-center hover:bg-[var(--color-wood)] hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-wood)]/10 text-[var(--color-wood)] flex items-center justify-center hover:bg-[var(--color-wood)] hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-wood)]/10 text-[var(--color-wood)] flex items-center justify-center hover:bg-[var(--color-wood)] hover:text-white transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[var(--color-wood)]/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-80">
            <p>&copy; {new Date().getFullYear()} MAI HUONG ARC. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/admin" className="hover:text-[var(--color-wood)] transition-colors font-medium">Admin CMS</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <a href="tel:0356210970" className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Phone size={20} />
        </a>
        <a href="#" className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <span className="font-bold text-sm">Zalo</span>
        </a>
      </div>
    </div>
  );
}
