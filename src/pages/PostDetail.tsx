import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Tag, Clock, ChevronRight, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch current post
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
        // Fetch all posts to filter related and recent
        return fetch('/api/posts');
      })
      .then(res => res.json())
      .then(allPosts => {
        // Filter related posts (same category, exclude current)
        const related = allPosts
          .filter((p: any) => p.category === post?.category && p.id !== Number(id))
          .slice(0, 3);
        
        // If not enough related posts, fill with others
        if (related.length < 3) {
          const others = allPosts
            .filter((p: any) => p.id !== Number(id) && !related.find((r: any) => r.id === p.id))
            .slice(0, 3 - related.length);
          related.push(...others);
        }

        setRelatedPosts(related);
        
        // Get recent posts for sidebar
        setRecentPosts(allPosts.filter((p: any) => p.id !== Number(id)).slice(0, 5));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--color-wood)] font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy bài viết</div>;

  return (
    <div className="bg-[var(--color-cream)] min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[var(--color-charcoal)]/60 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-[var(--color-wood)] transition-colors">Trang chủ</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link to="/posts" className="hover:text-[var(--color-wood)] transition-colors">Tin tức</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-[var(--color-wood)] font-medium truncate">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-sm border border-[var(--color-beige)] overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 md:p-10 border-b border-[var(--color-beige)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block px-3 py-1 bg-[var(--color-gold)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm">
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--color-charcoal)]/50 flex items-center font-medium">
                    <Clock size={14} className="mr-1" /> 5 phút đọc
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--color-charcoal)]/60">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-[var(--color-gold)]" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                    <div className="flex items-center"><User size={16} className="mr-2 text-[var(--color-gold)]" /> Admin</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="mr-2 hidden sm:inline">Chia sẻ:</span>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Facebook size={14} /></button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"><Twitter size={14} /></button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors"><Linkedin size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="w-full aspect-video relative">
                <img 
                  src={post.thumbnail || `https://loremflickr.com/1920/800/architecture?lock=${post.id}`} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Post Content */}
              <div className="p-6 md:p-10">
                <div 
                  className="grapesjs-content-wrapper prose prose-lg prose-stone max-w-none 
                    prose-headings:font-serif prose-headings:text-[var(--color-wood)] 
                    prose-a:text-[var(--color-gold)] prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full
                    prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-gold)] 
                    prose-blockquote:bg-[var(--color-beige)]/20 prose-blockquote:py-4 prose-blockquote:px-6 
                    prose-blockquote:rounded-r-xl prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:text-[var(--color-wood)] prose-blockquote:not-italic
                    prose-li:marker:text-[var(--color-gold)]
                    [&_.article-text]:text-[var(--color-charcoal)]/80 [&_.article-text]:mb-6 [&_.article-text]:leading-relaxed
                    [&_.article-heading]:text-[var(--color-wood)] [&_.article-heading]:font-serif [&_.article-heading]:font-bold [&_.article-heading]:mt-10 [&_.article-heading]:mb-4
                    [&_.highlight-box]:bg-[var(--color-cream)] [&_.highlight-box]:border-l-4 [&_.highlight-box]:border-[var(--color-gold)] [&_.highlight-box]:p-6 [&_.highlight-box]:rounded-r-xl [&_.highlight-box]:my-8
                  "
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              
              {/* Tags & Navigation */}
              <div className="p-6 md:p-10 border-t border-[var(--color-beige)] bg-[var(--color-cream)]/30">
                <div className="flex items-center gap-2 mb-8">
                  <Tag size={18} className="text-[var(--color-gold)]" />
                  <span className="font-bold text-[var(--color-wood)]">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white border border-[var(--color-beige)] rounded-full text-xs text-[var(--color-charcoal)] hover:border-[var(--color-gold)] transition-colors cursor-pointer">Kiến trúc</span>
                    <span className="px-3 py-1 bg-white border border-[var(--color-beige)] rounded-full text-xs text-[var(--color-charcoal)] hover:border-[var(--color-gold)] transition-colors cursor-pointer">Nội thất</span>
                    <span className="px-3 py-1 bg-white border border-[var(--color-beige)] rounded-full text-xs text-[var(--color-charcoal)] hover:border-[var(--color-gold)] transition-colors cursor-pointer">Xu hướng</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Posts */}
            <div className="mt-12">
              <h3 className="text-2xl font-serif font-bold text-[var(--color-wood)] mb-6 flex items-center">
                <span className="w-8 h-[2px] bg-[var(--color-gold)] mr-3"></span>
                Bài viết liên quan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <Link to={`/posts/${p.id}`} key={p.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[var(--color-beige)]">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={p.thumbnail || `https://loremflickr.com/400/300/architecture?lock=${p.id}`} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-[var(--color-charcoal)]/50 mb-2">{new Date(p.created_at).toLocaleDateString('vi-VN')}</div>
                      <h4 className="font-serif font-bold text-[var(--color-wood)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search Widget - Placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-beige)]">
              <h3 className="font-serif font-bold text-lg text-[var(--color-wood)] mb-4 pb-2 border-b border-[var(--color-beige)]">Tìm kiếm</h3>
              <div className="relative">
                <input type="text" placeholder="Tìm kiếm bài viết..." className="w-full px-4 py-2 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal)]/50 hover:text-[var(--color-gold)]">
                  <ArrowLeft size={18} className="rotate-180" />
                </button>
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-beige)]">
              <h3 className="font-serif font-bold text-lg text-[var(--color-wood)] mb-4 pb-2 border-b border-[var(--color-beige)]">Danh mục</h3>
              <ul className="space-y-2">
                {['Kiến thức', 'Xu hướng', 'Kinh nghiệm', 'Phong thủy', 'Giải pháp'].map((cat, idx) => (
                  <li key={idx}>
                    <Link to="/posts" className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--color-cream)] transition-colors group">
                      <span className="text-[var(--color-charcoal)]/80 group-hover:text-[var(--color-wood)] font-medium">{cat}</span>
                      <span className="text-xs bg-[var(--color-beige)] text-[var(--color-charcoal)]/60 px-2 py-0.5 rounded-full group-hover:bg-[var(--color-gold)] group-hover:text-white transition-colors">
                        {Math.floor(Math.random() * 10) + 1}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-beige)]">
              <h3 className="font-serif font-bold text-lg text-[var(--color-wood)] mb-4 pb-2 border-b border-[var(--color-beige)]">Bài viết mới nhất</h3>
              <div className="space-y-4">
                {recentPosts.map((p) => (
                  <Link to={`/posts/${p.id}`} key={p.id} className="flex gap-4 group">
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={p.thumbnail || `https://loremflickr.com/200/200/architecture?lock=${p.id}`} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[var(--color-wood)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 mb-1">
                        {p.title}
                      </h4>
                      <span className="text-xs text-[var(--color-charcoal)]/50">{new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Banner Widget */}
            <div className="bg-[var(--color-wood)] p-8 rounded-2xl shadow-lg text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif font-bold text-white mb-2">Bạn cần tư vấn thiết kế?</h3>
                <p className="text-white/80 text-sm mb-6">Liên hệ ngay với chúng tôi để hiện thực hóa ngôi nhà mơ ước của bạn.</p>
                <Link to="/contact" className="inline-block px-6 py-3 bg-white text-[var(--color-wood)] font-bold text-sm rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-all shadow-md">
                  Nhận tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
