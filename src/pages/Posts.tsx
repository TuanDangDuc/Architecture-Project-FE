import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        // Filter only published posts
        const publishedPosts = data.filter((p: any) => p.status === 'published');
        setPosts(publishedPosts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
        <div className="w-12 h-12 border-4 border-[var(--color-beige)] border-t-[var(--color-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-cream)] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-wood)] mb-6">Tin tức & Bài viết</h1>
          <p className="text-lg text-[var(--color-charcoal)]/70 max-w-2xl mx-auto font-light">
            Cập nhật những xu hướng thiết kế mới nhất, kinh nghiệm xây nhà và các kiến thức hữu ích về kiến trúc, nội thất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--color-beige)] group flex flex-col"
            >
              <Link to={`/posts/${post.id}`} className="block relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.thumbnail || `https://loremflickr.com/800/600/architecture?lock=${post.id}`}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-[var(--color-wood)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-[var(--color-charcoal)]/60 mb-4 space-x-4">
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center"><User size={14} className="mr-1" /> Admin</span>
                </div>
                <Link to={`/posts/${post.id}`} className="block mb-3">
                  <h2 className="text-xl font-serif font-bold text-[var(--color-charcoal)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-[var(--color-charcoal)]/70 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <Link to={`/posts/${post.id}`} className="inline-flex items-center text-[var(--color-wood)] font-medium hover:text-[var(--color-gold)] transition-colors mt-auto">
                  Đọc tiếp <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
