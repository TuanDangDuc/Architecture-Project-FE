import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
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
    <div className="bg-[var(--color-cream)] min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/posts" className="inline-flex items-center text-[var(--color-charcoal)]/60 hover:text-[var(--color-wood)] transition-colors mb-8 font-medium">
          <ArrowLeft size={20} className="mr-2" /> Trở về danh sách bài viết
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 bg-[var(--color-gold)] text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-6 shadow-sm">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--color-wood)] mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-[var(--color-charcoal)]/60 font-medium border-y border-[var(--color-beige)] py-4">
            <div className="flex items-center"><Calendar size={18} className="mr-2 text-[var(--color-gold)]" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
            <div className="flex items-center"><User size={18} className="mr-2 text-[var(--color-gold)]" /> Admin</div>
            <div className="flex items-center"><Tag size={18} className="mr-2 text-[var(--color-gold)]" /> {post.category}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="aspect-[21/9] w-full rounded-2xl overflow-hidden mb-12 shadow-lg"
        >
          <img 
            src={post.thumbnail || `https://loremflickr.com/1920/800/architecture?lock=${post.id}`} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Nội dung bài viết hiển thị theo dạng Text Editor (WYSIWYG) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grapesjs-content-wrapper prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-[var(--color-wood)] prose-a:text-[var(--color-gold)] prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-[var(--color-gold)] prose-blockquote:bg-[var(--color-beige)]/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:text-[var(--color-wood)] prose-li:marker:text-[var(--color-gold)] bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-beige)]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
