import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, Link, Image as ImageIcon, Video, FileText, ArrowLeft, UploadCloud, X, Settings, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { API_BASE } from '../config/api.ts';

export default function AdminProjectEditor() {
  const location = useLocation();
  const editProject = location.state?.project;

  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [step, setStep] = useState<'info' | 'builder'>('info');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [previewContent, setPreviewContent] = useState({ html: '', css: '' });
  const navigate = useNavigate();

  const handlePreview = () => {
    if (editor) {
      setPreviewContent({
        html: editor.getHtml(),
        css: editor.getCss()
      });
      setIsPreviewOpen(true);
    }
  };
  
  const [projectInfo, setProjectInfo] = useState({
    id: editProject?.id || null,
    title: editProject?.name || "", 
    category: editProject?.category?.name || "", 
    style: editProject?.style || "MODERN", 
    area: editProject?.area || "", 
    cost: editProject?.constructionCost || "", 
    thumbnail: editProject?.titleImage || "",
    gallery: editProject?.images?.map((img: any) => img.url) || [],
    description: editProject?.description || "",
    content: editProject?.content || "",
    video: editProject?.video || ""
  });
  
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('https://api.kientrucmaihuong.com/api/category')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0 && !projectInfo.category) {
          setProjectInfo(prev => ({ ...prev, category: data[0].name }));
        }
      })
      .catch(err => console.error("Lỗi tải danh mục:", err));
  }, []);
  
  const [isDragging, setIsDragging] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (e) {
      console.error("Lỗi upload ảnh:", e);
    }
    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsUploading(true);
      const file = e.dataTransfer.files[0];
      const url = await uploadImage(file);
      if (url) {
        setProjectInfo({...projectInfo, thumbnail: url});
      } else {
        alert("Có lỗi xảy ra khi tải ảnh lên.");
      }
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const url = await uploadImage(file);
      if (url) {
        setProjectInfo({...projectInfo, thumbnail: url});
      } else {
        alert("Có lỗi xảy ra khi tải ảnh lên.");
      }
      setIsUploading(false);
    }
  };

  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      const newImages: string[] = [];
      
      for (const fileItem of files) {
        const file = fileItem as File;
        const url = await uploadImage(file);
        if (url) {
          newImages.push(url);
        }
      }
      
      if (newImages.length > 0) {
        setProjectInfo(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...newImages]
        }));
      }
      setIsUploading(false);
    }
  };

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setProjectInfo(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), newGalleryUrl.trim()]
      }));
      setNewGalleryUrl("");
    }
  };

  const removeGalleryImage = (index: number) => {
    setProjectInfo(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (step !== 'builder' || !editorRef.current) return;

    const e = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      assetManager: {
        upload: `${API_BASE}/api/upload`,
        uploadName: 'file',
        autoAdd: true,
      },
      selectorManager: { componentFirst: true },
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'Typography',
            open: true,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'font-style'],
            properties: [
              { name: 'Font', property: 'font-family' },
              { name: 'Size', property: 'font-size' },
              { name: 'Weight', property: 'font-weight' },
              { name: 'Color', property: 'color', type: 'color' },
              { name: 'Align', property: 'text-align' }
            ],
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'opacity'],
          },
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'margin', 'padding'],
          }
        ],
      },
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
            content: `
              <figure class="image-figure">
                <img class="article-image" src="https://loremflickr.com/800/500/architecture" alt="Image" />
                <figcaption class="image-caption">Nhập chú thích hình ảnh tại đây</figcaption>
              </figure>
            `,
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
                <h3 class="quote-title">Đánh giá từ gia chủ</h3>
                <p class="quote-text">"Nội dung trích dẫn hoặc đánh giá của khách hàng..."</p>
                <p class="quote-author">- Tên người đánh giá</p>
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
      <h2 class="article-title">Ý tưởng thiết kế</h2>
      <p class="article-text">Nhập mô tả ý tưởng thiết kế của bạn tại đây. Lấy cảm hứng từ phong cách hiện đại, đội ngũ kiến trúc sư đã khéo léo sử dụng các vật liệu tự nhiên...</p>
      
      <figure class="image-figure">
        <img class="article-image" src="https://loremflickr.com/800/500/architecture?lock=1" alt="Ý tưởng thiết kế" />
        <figcaption class="image-caption">Phối cảnh tổng thể dự án với không gian xanh mát</figcaption>
      </figure>
      
      <h2 class="article-title">Giải pháp không gian</h2>
      <p class="article-text">Mặt bằng công năng được bố trí khoa học, phân khu rõ ràng nhưng vẫn đảm bảo sự kết nối xuyên suốt. Hệ thống cửa kính lớn không chỉ giúp mở rộng tầm nhìn mà còn mang lại nguồn năng lượng tích cực cho ngôi nhà mỗi ngày.</p>
      
      <h2 class="article-title">Vật liệu & Thi công</h2>
      <p class="article-text">Để hiện thực hóa bản vẽ thiết kế một cách hoàn hảo nhất, chúng tôi đặc biệt chú trọng vào việc lựa chọn vật liệu và quy trình thi công. Mọi chi tiết từ sàn nhà, ốp tường, đến hệ thống ánh sáng đều được tuyển chọn từ những thương hiệu uy tín, đảm bảo độ bền và tính thẩm mỹ cao nhất.</p>
      
      <div class="article-quote">
        <div class="quote-icon">✦</div>
        <h3 class="quote-title">Đánh giá từ gia chủ</h3>
        <p class="quote-text">"Tôi thực sự ấn tượng với sự chuyên nghiệp và tận tâm của đội ngũ MAI HUONG ARC. Họ không chỉ lắng nghe mong muốn của tôi mà còn đưa ra những giải pháp thiết kế vượt ngoài mong đợi. Không gian sống mới mang lại cho gia đình tôi cảm giác bình yên và tự hào mỗi khi đón khách."</p>
        <p class="quote-author">- Chủ đầu tư dự án</p>
      </div>

      <style>
        .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
        .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
        .image-figure { margin: 2rem 0; width: 100%; }
        .article-image { width: 100%; border-radius: 12px 12px 0 0; display: block; }
        .image-caption { background-color: #f9f9f9; color: #555; padding: 12px; text-align: center; font-style: italic; font-size: 0.9rem; border-radius: 0 0 12px 12px; margin-top: 0; border: 1px solid #eee; border-top: none; }
        .article-quote { background-color: #FDFBF7; border-left: 4px solid #9E2A25; padding: 2rem; margin: 2rem 0; border-radius: 0 12px 12px 0; position: relative; }
        .quote-icon { font-size: 2rem; color: #9E2A25; line-height: 1; margin-bottom: 1rem; }
        .quote-title { font-weight: bold; color: #7B1E1A; margin-bottom: 0.5rem; }
        .quote-text { font-family: "Playfair Display", serif; font-size: 1.4rem; font-style: italic; color: #333; margin-bottom: 1rem; line-height: 1.6; }
        .quote-author { font-weight: bold; color: #7B1E1A; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
      </style>
    `;

    const initialContent = projectInfo.content || defaultTemplate;

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

    // Custom upload handling for GrapesJS Asset Manager
    e.on('asset:upload:start', () => {
      // Optional: show loading state
    });

    e.on('asset:upload:response', (response) => {
      if (response && response.url) {
        // GrapesJS Asset Manager expects the response to be mapped to { data: [...] }
        return { data: [response.url] };
      }
    });

    e.on('asset:upload:error', (err) => {
      console.error('Lỗi upload trong GrapesJS:', err);
      alert('Không thể tải ảnh này lên máy chủ. Vui lòng thử lại.');
    });

    setEditor(e);

    return () => {
      e.destroy();
    };
  }, [step]);

  const handleSave = async () => {
    let fullContent = projectInfo.content || '';
    
    // If editor is active, get the latest content
    if (editor && step === 'builder') {
      const html = editor.getHtml();
      const css = editor.getCss();
      fullContent = `<style>${css}</style>${html}`;
    }
    
    const adminIdFromStorage = localStorage.getItem("adminId");
    const MOCK_ADMIN_ID = adminIdFromStorage || "3368b6b0-fa6f-409b-a6df-d91834164bba"; // Temporarily hardcoded for API constraint
    
    // Find category ID based on selected name
    const selectedCat = categories.find(c => c.name === projectInfo.category);
    const mappedCategoryId = selectedCat?.id || (categories.length > 0 ? categories[0].id : null);

    // Map user-friendly category names to Backend Enum Type 
    // Backend Enum Type: HOUSE, VILLA, APARTMENT, CAFE, RESTAURANT, HOTEL, OFFICE, HOMESTAY, SHOP, RESORT
    let mappedType = "HOUSE";
    if (projectInfo.category.includes("Biệt thự")) mappedType = "VILLA";
    else if (projectInfo.category.includes("Nhà vườn")) mappedType = "HOMESTAY";
    else if (projectInfo.category.includes("Nhà phố")) mappedType = "HOUSE";
    else if (projectInfo.category.includes("Nội thất")) mappedType = "APARTMENT"; // Default mapping to pass validation

    // Validate safe Backend Enum Style (MODERN, CLASSIC, NEOCLASSIC, MINIMALIST, INDUSTRIAL, SCANDINAVIAN, JAPANESE, TROPICAL)
    let mappedStyle = "MODERN";
    const rawStyle = projectInfo.style.toUpperCase();
    if (["CLASSIC", "NEOCLASSIC", "MINIMALIST", "INDUSTRIAL", "SCANDINAVIAN", "JAPANESE", "TROPICAL"].includes(rawStyle)) {
      mappedStyle = rawStyle;
    }

    const projectData = {
      name: projectInfo.title,
      area: parseInt(projectInfo.area) || 0,
      constructionCost: parseFloat(projectInfo.cost) || 0,
      style: mappedStyle,
      titleImage: projectInfo.thumbnail,
      type: mappedType,
      slug: projectInfo.title.toLowerCase().replace(/ /g, '-'),
      content: fullContent,
      status: "ACTIVE",
      categoryId: mappedCategoryId,
      adminId: MOCK_ADMIN_ID,
      images: projectInfo.gallery || []
    };
    
    try {
      let res;
      if (projectInfo.id) {
        // Update existing project
        res = await fetch(`https://api.kientrucmaihuong.com/api/project/${projectInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...projectData, id: projectInfo.id })
        });
      } else {
        // Create new project
        res = await fetch('https://api.kientrucmaihuong.com/api/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      }
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      alert("Đã lưu dự án thành công!");
      navigate('/admin');
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu dự án. Vui lòng kiểm tra lại thông tin.");
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
            {step === 'info' ? "Thông tin cơ bản dự án" : (projectInfo.title || "Thiết kế bài viết")}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {step === 'builder' && (
            <>
              <button 
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                Xem trước
              </button>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${isSettingsOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Settings size={18} /> Thông tin cơ bản
              </button>
            </>
          )}
          
          {step === 'info' ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Save size={18} /> Lưu dự án
              </button>
              <button 
                onClick={() => setStep('builder')}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--color-wood)] text-white font-medium rounded-lg hover:bg-[var(--color-gold)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Tiếp tục thiết kế bài viết
              </button>
            </div>
          ) : (
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--color-wood)] text-white font-medium rounded-lg hover:bg-[var(--color-gold)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <Save size={18} /> Lưu dự án
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên dự án <span className="text-red-500">*</span></label>
                    <input required type="text" value={projectInfo.title} onChange={e => setProjectInfo({...projectInfo, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Nhập tên dự án..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn (Hiển thị ở đầu trang chi tiết)</label>
                    <textarea value={projectInfo.description} onChange={e => setProjectInfo({...projectInfo, description: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" rows={3} placeholder="Nhập mô tả ngắn gọn về dự án..."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                      <select value={projectInfo.category} onChange={e => setProjectInfo({...projectInfo, category: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phong cách</label>
                      <select value={projectInfo.style} onChange={e => setProjectInfo({...projectInfo, style: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                        <option value="MODERN">Hiện đại (Modern)</option>
                        <option value="CLASSIC">Cổ điển (Classic)</option>
                        <option value="NEOCLASSIC">Tân cổ điển (Neoclassic)</option>
                        <option value="MINIMALIST">Tối giản (Minimalist)</option>
                        <option value="INDUSTRIAL">Công nghiệp (Industrial)</option>
                        <option value="SCANDINAVIAN">Bắc Âu (Scandinavian)</option>
                        <option value="JAPANESE">Nhật Bản (Japanese)</option>
                        <option value="TROPICAL">Nhiệt đới (Tropical)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diện tích (m²)</label>
                      <input type="number" value={projectInfo.area} onChange={e => setProjectInfo({...projectInfo, area: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chi phí</label>
                      <input type="text" value={projectInfo.cost} onChange={e => setProjectInfo({...projectInfo, cost: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Ví dụ: 2 tỷ" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video (Link YouTube/TikTok hoặc Tải lên)</label>
                    <div className="flex gap-2">
                      <input type="text" value={projectInfo.video} onChange={e => setProjectInfo({...projectInfo, video: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Nhập link video..." />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Thumbnail (Kéo thả hoặc chọn ảnh)</label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center h-64 ${
                      isDragging ? 'border-[var(--color-wood)] bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${projectInfo.thumbnail ? 'p-2' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {projectInfo.thumbnail ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden group">
                        <img src={projectInfo.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors">
                            {isUploading ? "Đang tải lên..." : "Đổi ảnh khác"}
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={isUploading} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[var(--color-wood)]">
                          <UploadCloud size={32} />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">
                          {isUploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây"}
                        </p>
                        <p className="text-sm text-gray-400 mb-4">hoặc</p>
                        <label className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                          Chọn ảnh từ máy tính
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={isUploading} />
                        </label>
                      </>
                    )}
                  </div>
                  
                  {/* Gallery Management */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thư viện ảnh dự án</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                      {projectInfo.gallery && projectInfo.gallery.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-wood)] hover:bg-gray-50 transition-all text-gray-400 hover:text-[var(--color-wood)]">
                        <UploadCloud size={24} className="mb-1" />
                        <span className="text-xs font-medium">{isUploading ? "Đang tải..." : "Thêm ảnh"}</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryFileSelect} disabled={isUploading} />
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end gap-4">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer text-lg"
                >
                  <Save size={20} /> Lưu dự án
                </button>
                <button 
                  onClick={() => setStep('builder')}
                  className="flex items-center gap-2 px-8 py-3 bg-[var(--color-wood)] text-white font-medium rounded-xl hover:bg-[var(--color-gold)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 cursor-pointer text-lg"
                >
                  Tiếp tục thiết kế bài viết
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án <span className="text-red-500">*</span></label>
                <input required type="text" value={projectInfo.title} onChange={e => setProjectInfo({...projectInfo, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Nhập tên dự án..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select value={projectInfo.category} onChange={e => setProjectInfo({...projectInfo, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phong cách</label>
                <select value={projectInfo.style} onChange={e => setProjectInfo({...projectInfo, style: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                  <option value="MODERN">Hiện đại</option>
                  <option value="CLASSIC">Cổ điển</option>
                  <option value="NEOCLASSIC">Tân cổ điển</option>
                  <option value="MINIMALIST">Tối giản</option>
                  <option value="INDUSTRIAL">Công nghiệp</option>
                  <option value="SCANDINAVIAN">Bắc Âu</option>
                  <option value="JAPANESE">Nhật Bản</option>
                  <option value="TROPICAL">Nhiệt đới</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
                  <input type="number" value={projectInfo.area} onChange={e => setProjectInfo({...projectInfo, area: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí</label>
                  <input type="text" value={projectInfo.cost} onChange={e => setProjectInfo({...projectInfo, cost: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Ví dụ: 2 tỷ" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh Thumbnail</label>
                <input type="text" value={projectInfo.thumbnail} onChange={e => setProjectInfo({...projectInfo, thumbnail: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="https://..." />
                {projectInfo.thumbnail && (
                  <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <img src={projectInfo.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsSettingsOpen(false)} className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium cursor-pointer">
                Tiếp tục thiết kế nội dung
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Blocks */}
        <div className={`w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-sm transition-all duration-300 ${step === 'builder' ? (isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute left-0') : 'hidden'}`}>
          {step === 'builder' && (
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-16 bg-white border border-l-0 border-gray-200 rounded-r-lg flex items-center justify-center shadow-sm text-gray-500 hover:text-[var(--color-wood)] hover:bg-gray-50 z-30 cursor-pointer"
              title={isLeftSidebarOpen ? "Ẩn công cụ" : "Hiện công cụ"}
            >
              {isLeftSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          )}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-sm uppercase tracking-wider text-gray-700">
              Kéo thả
            </h2>
          </div>
          <div id="blocks" className="flex-1 overflow-y-auto p-4 custom-grapesjs-blocks"></div>
        </div>
        
        {/* Editor Area */}
        <div className={`flex-1 bg-gray-100 overflow-hidden relative transition-opacity duration-300 ${step === 'builder' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div ref={editorRef} className="absolute inset-0"></div>
        </div>

        {/* Right Sidebar - Style Manager */}
        <div className={`w-72 bg-white border-l border-gray-200 flex flex-col shrink-0 z-20 shadow-sm transition-all duration-300 ${step === 'builder' ? (isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0') : 'hidden'}`}>
          {step === 'builder' && (
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-16 bg-white border border-r-0 border-gray-200 rounded-l-lg flex items-center justify-center shadow-sm text-gray-500 hover:text-[var(--color-wood)] hover:bg-gray-50 z-30 cursor-pointer"
              title={isRightSidebarOpen ? "Ẩn tùy chỉnh" : "Hiện tùy chỉnh"}
            >
              {isRightSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>
          )}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-sm uppercase tracking-wider text-gray-700">
              Tùy chỉnh
            </h2>
          </div>
          <div id="styles-container" className="flex-1 overflow-y-auto p-4 custom-grapesjs-styles">
            <p className="text-xs text-gray-400 text-center mt-4">Chọn một phần tử để chỉnh sửa kiểu dáng</p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-wood)]">Xem trước nội dung</h2>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium cursor-pointer"
              >
                <X size={20} /> Đóng xem trước
              </button>
            </div>
            <div className="prose prose-lg max-w-none">
              <style>{previewContent.css}</style>
              <div dangerouslySetInnerHTML={{ __html: previewContent.html }} />
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for GrapesJS */}
      <style>{`
        /* ... existing styles ... */
        .gjs-cv-canvas {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
        }

        /* Sidebar Styling */
        .custom-grapesjs-blocks, .custom-grapesjs-styles {
          background-color: #ffffff;
        }

        /* Block Styling */
        .custom-grapesjs-blocks .gjs-block {
          background: #fff;
          border: 1px solid #e5e7eb;
          color: #4b5563;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        .custom-grapesjs-blocks .gjs-block:hover {
          border-color: var(--color-gold);
          color: var(--color-wood);
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .custom-grapesjs-blocks .gjs-block-category {
          background: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
        .custom-grapesjs-blocks .gjs-block-category .gjs-title {
          color: #111827 !important;
          font-weight: 600 !important;
          padding: 12px !important;
          letter-spacing: 0.05em !important;
          text-shadow: none !important;
        }

        /* Style Manager Styling */
        .gjs-sm-sector {
          background-color: #ffffff !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 12px 0 !important;
        }
        .gjs-sm-sector-title, .gjs-sm-title {
          background: #f9fafb !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          color: #111827 !important;
          font-weight: 600 !important;
          margin-bottom: 8px !important;
          border: 1px solid #f3f4f6 !important;
          text-shadow: none !important;
        }
        .gjs-sm-properties {
          padding: 0 4px !important;
          background-color: #ffffff !important;
        }
        .gjs-sm-property {
          background-color: #ffffff !important;
        }
        .gjs-field {
          background-color: #ffffff !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          padding: 6px !important;
          transition: border-color 0.2s !important;
          color: #374151 !important;
          box-shadow: none !important;
        }
        .gjs-field:focus-within {
          border-color: var(--color-gold) !important;
        }
        .gjs-field input, .gjs-field select {
          color: #374151 !important;
          font-size: 13px !important;
          background-color: transparent !important;
        }
        .gjs-sm-label {
          color: #6b7280 !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          margin-bottom: 4px !important;
          text-shadow: none !important;
        }
        
        /* Radio Buttons */
        .gjs-radio-items {
          background: #f3f4f6 !important;
          padding: 3px !important;
          border-radius: 6px !important;
        }
        .gjs-radio-item {
          border-radius: 4px !important;
          color: #6b7280 !important;
          background-color: transparent !important;
          box-shadow: none !important;
        }
        .gjs-radio-item.gjs-sm-active {
          background: white !important;
          color: var(--color-wood) !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
        }
        
        /* Color Picker */
        .gjs-field-colorp {
          background-color: #ffffff !important;
        }
        .gjs-field-colorp-c {
          background-color: #ffffff !important;
        }
        
        /* Clear buttons */
        .gjs-sm-clear {
          color: #9ca3af !important;
        }
        .gjs-sm-clear:hover {
          color: var(--color-wood) !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
