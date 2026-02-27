import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Settings, X, UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function AdminPostEditor() {
  const location = useLocation();
  const editPost = location.state?.post;

  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [step, setStep] = useState<'info' | 'builder'>('info');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  
  const [postInfo, setPostInfo] = useState({
    id: editPost?.id || null,
    title: editPost?.title || "", 
    category: editPost?.category || "Tin tức", 
    excerpt: editPost?.excerpt || "", 
    thumbnail: editPost?.thumbnail || "",
    content: editPost?.content || "",
    status: editPost?.status || "published"
  });
  
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPostInfo({...postInfo, thumbnail: imageUrl});
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPostInfo({...postInfo, thumbnail: imageUrl});
    }
  };

  useEffect(() => {
    if (step !== 'builder' || !editorRef.current) return;

    const e = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      panels: { defaults: [] },
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'header',
            label: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><path d="M4 12h16M4 18V6M20 18V6"/></svg>
              <b>Tiêu đề (H2)</b>
            `,
            content: '<h2 class="article-title">Tiêu đề mục mới</h2>',
            category: 'Văn bản',
          },
          {
            id: 'paragraph',
            label: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>
              <b>Đoạn văn</b>
            `,
            content: '<p class="article-text">Nhập nội dung đoạn văn bản tại đây. Bạn có thể click đúp để chỉnh sửa trực tiếp đoạn văn bản này.</p>',
            category: 'Văn bản',
          },
          {
            id: 'image',
            label: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <b>Hình ảnh</b>
            `,
            content: '<img class="article-image" src="https://loremflickr.com/800/500/architecture" alt="Image" />',
            category: 'Đa phương tiện',
          },
          {
            id: 'quote',
            label: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              <b>Trích dẫn</b>
            `,
            content: `
              <div class="article-quote">
                <div class="quote-icon">✦</div>
                <h3 class="quote-title">Trích dẫn nổi bật</h3>
                <p class="quote-text">"Nội dung trích dẫn..."</p>
                <p class="quote-author">- Tác giả</p>
              </div>
            `,
            category: 'Đa phương tiện',
          },
          {
            id: 'video',
            label: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 6 4-6 4Z"/></svg>
              <b>Video</b>
            `,
            content: {
              type: 'video',
              src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              style: { width: '100%', height: '450px', 'border-radius': '1rem', 'margin': '2rem 0', 'box-shadow': '0 4px 20px rgba(0,0,0,0.05)' },
            },
            category: 'Đa phương tiện',
          }
        ]
      }
    });

    const defaultTemplate = `
      <h2 class="article-title">Tiêu đề bài viết</h2>
      <p class="article-text">Nhập nội dung bài viết của bạn tại đây...</p>
      <img class="article-image" src="https://loremflickr.com/800/500/architecture?lock=1" alt="Hình ảnh minh họa" />
      <p class="article-text">Tiếp tục nội dung bài viết...</p>
    `;

    const initialContent = postInfo.content || defaultTemplate;

    if (initialContent) {
      const styleMatch = initialContent.match(/<style>([\s\S]*?)<\/style>/);
      if (styleMatch) {
        const css = styleMatch[1];
        const html = initialContent.replace(styleMatch[0], '');
        e.setComponents(html);
        e.setStyle(css);
      } else {
        e.setComponents(initialContent);
      }
    }

    e.on('load', () => {
      const body = e.Canvas.getBody();
      if (body) {
        body.style.paddingBottom = '300px';
      }
    });

    setEditor(e);

    return () => {
      e.destroy();
    };
  }, [step]);

  const handleSave = async () => {
    let fullContent = postInfo.content || '';
    
    if (editor && step === 'builder') {
      const html = editor.getHtml();
      const css = editor.getCss();
      fullContent = `<style>${css}</style>${html}`;
    }
    
    const postData = {
      ...postInfo,
      content: fullContent
    };
    
    try {
      if (postInfo.id) {
        await fetch(`/api/posts/${postInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
      } else {
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
      }
      
      alert("Đã lưu bài viết thành công!");
      navigate('/admin');
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => step === 'builder' ? setStep('info') : navigate('/admin')}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 cursor-pointer hover:-translate-x-1"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-serif font-bold text-[var(--color-wood)]">
            {step === 'info' ? "Thông tin bài viết" : (postInfo.title || "Soạn thảo bài viết")}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {step === 'builder' && (
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${isSettingsOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings size={18} /> Thông tin cơ bản
            </button>
          )}
          
          {step === 'info' ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Save size={18} /> Lưu bài viết
              </button>
              <button 
                onClick={() => setStep('builder')}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--color-wood)] text-white font-medium rounded-lg hover:bg-[var(--color-gold)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Tiếp tục soạn thảo
              </button>
            </div>
          ) : (
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--color-wood)] text-white font-medium rounded-lg hover:bg-[var(--color-gold)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <Save size={18} /> Lưu bài viết
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Step 1: Full Page Info Form */}
        {step === 'info' && (
          <div className="absolute inset-0 bg-gray-50 overflow-y-auto p-8 z-40">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8 border-b pb-4">Điền thông tin cơ bản</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                    <input required type="text" value={postInfo.title} onChange={e => setPostInfo({...postInfo, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Nhập tiêu đề bài viết..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn (Tóm tắt)</label>
                    <textarea value={postInfo.excerpt} onChange={e => setPostInfo({...postInfo, excerpt: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" rows={3} placeholder="Nhập đoạn tóm tắt ngắn gọn..."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                      <select value={postInfo.category} onChange={e => setPostInfo({...postInfo, category: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                        <option>Tin tức</option>
                        <option>Kiến thức</option>
                        <option>Xu hướng</option>
                        <option>Kinh nghiệm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                      <select value={postInfo.status} onChange={e => setPostInfo({...postInfo, status: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                        <option value="published">Đã đăng</option>
                        <option value="draft">Bản nháp</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Thumbnail (Kéo thả hoặc chọn ảnh)</label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center h-64 ${
                      isDragging ? 'border-[var(--color-wood)] bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${postInfo.thumbnail ? 'p-2' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {postInfo.thumbnail ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden group">
                        <img src={postInfo.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors">
                            Đổi ảnh khác
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[var(--color-wood)]">
                          <UploadCloud size={32} />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">Kéo thả ảnh vào đây</p>
                        <p className="text-sm text-gray-400 mb-4">hoặc</p>
                        <label className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                          Chọn ảnh từ máy tính
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                        </label>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Hoặc nhập URL ảnh trực tiếp:</label>
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-3 rounded-l-lg border border-r-0 border-gray-300 text-gray-500">
                        <ImageIcon size={18} />
                      </div>
                      <input type="text" value={postInfo.thumbnail} onChange={e => setPostInfo({...postInfo, thumbnail: e.target.value})} className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end gap-4">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer text-lg"
                >
                  <Save size={20} /> Lưu bài viết
                </button>
                <button 
                  onClick={() => setStep('builder')}
                  className="flex items-center gap-2 px-8 py-3 bg-[var(--color-wood)] text-white font-medium rounded-xl hover:bg-[var(--color-gold)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 cursor-pointer text-lg"
                >
                  Tiếp tục soạn thảo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Info Panel (Overlay in Builder mode) */}
        {step === 'builder' && isSettingsOpen && (
          <div className="absolute top-0 left-0 bottom-0 w-96 bg-white border-r border-gray-200 shadow-2xl z-30 flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800">Thông tin cơ bản</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-gray-200 rounded-md text-gray-500 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                <input required type="text" value={postInfo.title} onChange={e => setPostInfo({...postInfo, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Nhập tiêu đề..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select value={postInfo.category} onChange={e => setPostInfo({...postInfo, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                  <option>Tin tức</option>
                  <option>Kiến thức</option>
                  <option>Xu hướng</option>
                  <option>Kinh nghiệm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select value={postInfo.status} onChange={e => setPostInfo({...postInfo, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                  <option value="published">Đã đăng</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh Thumbnail</label>
                <input type="text" value={postInfo.thumbnail} onChange={e => setPostInfo({...postInfo, thumbnail: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="https://..." />
                {postInfo.thumbnail && (
                  <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <img src={postInfo.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsSettingsOpen(false)} className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium cursor-pointer">
                Tiếp tục soạn thảo
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Blocks */}
        <div className={`w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 z-10 shadow-sm transition-opacity duration-300 ${step === 'builder' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-sm uppercase tracking-wider text-gray-700">
              Kéo thả các khối
            </h2>
            <p className="text-xs text-gray-500 mt-1">Kéo các khối dưới đây vào khung soạn thảo bên phải</p>
          </div>
          <div id="blocks" className="flex-1 overflow-y-auto p-4 custom-grapesjs-blocks"></div>
        </div>
        
        {/* Editor Area */}
        <div className={`flex-1 bg-gray-100 overflow-hidden relative transition-opacity duration-300 ${step === 'builder' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div ref={editorRef} className="absolute inset-0"></div>
        </div>
      </div>
      
      {/* Custom CSS for GrapesJS Blocks Panel */}
      <style>{`
        .custom-grapesjs-blocks .gjs-block {
          width: 100%;
          min-height: 90px;
          padding: 15px;
          margin-bottom: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          cursor: grab;
          position: relative;
          overflow: hidden;
        }
        .custom-grapesjs-blocks .gjs-block:hover {
          border-color: var(--color-gold);
          color: var(--color-wood);
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }
        .custom-grapesjs-blocks .gjs-block:active {
          cursor: grabbing;
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .custom-grapesjs-blocks .gjs-block-label {
          margin-top: 8px;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .custom-grapesjs-blocks .gjs-block-category {
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #f3f4f6;
          width: 100%;
        }
        
        /* Tùy chỉnh khung canvas của GrapesJS để full màn hình */
        .gjs-cv-canvas {
          background-color: #f3f4f6;
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
        }
        .gjs-frame {
          background-color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          width: 100% !important;
          height: 100% !important;
        }
        .gjs-frame-wrapper {
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
