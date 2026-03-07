import { API_BASE } from '../config/api.ts';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon, PlayCircle, X } from 'lucide-react';

export default function AdminVideoEditor() {
  const location = useLocation();
  const editVideo = location.state?.video;
  const navigate = useNavigate();
  
  const [videoInfo, setVideoInfo] = useState({
    id: editVideo?.id || null,
    title: editVideo?.title || "", 
    category: editVideo?.category?.name || editVideo?.category || "Biệt thự", 
    youtube_id: editVideo?.youtubeId || editVideo?.youtube_id || "",
    duration: editVideo?.duration || "",
    thumbnail: editVideo?.thumbnailUrl || editVideo?.thumbnail || "",
    project_id: editVideo?.projectId || editVideo?.project_id || ""
  });
  
  const [projects, setProjects] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/project`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoInfo({...videoInfo, thumbnail: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoInfo({...videoInfo, thumbnail: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const id = extractYoutubeId(val);
    setVideoInfo({...videoInfo, youtube_id: id});
  };

  const handleSave = async () => {
    const adminId = localStorage.getItem("adminId");
    
    // Transform data to match VideoRequest/UpdateVideoRequest
    const payload = {
      id: videoInfo.id,
      title: videoInfo.title,
      url: "", // Default empty if not provided
      thumbnailUrl: videoInfo.thumbnail,
      youtubeId: videoInfo.youtube_id,
      category: videoInfo.category,
      duration: videoInfo.duration,
      projectId: videoInfo.project_id || null,
      adminId: adminId
    };

    try {
      let response;
      if (videoInfo.id) {
        // Update: PUT to /api/video/{id} using UpdateVideoRequest
        response = await fetch(`${API_BASE}/api/video/${videoInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create: POST to /api/video using VideoRequest
        response = await fetch(`${API_BASE}/api/video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API Error: ${response.status}`);
      }
      
      alert("Đã lưu video thành công!");
      navigate('/admin');
    } catch (error: any) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu: " + (error.message || ""));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 cursor-pointer hover:-translate-x-1"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-serif font-bold text-[var(--color-wood)]">
            {videoInfo.id ? "Chỉnh sửa video" : "Thêm video mới"}
          </h1>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-[var(--color-wood)] text-white font-medium rounded-lg hover:bg-[var(--color-gold)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <Save size={18} /> Lưu video
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8 border-b pb-4">Thông tin video</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề video <span className="text-red-500">*</span></label>
                <input required type="text" value={videoInfo.title} onChange={e => setVideoInfo({...videoInfo, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Nhập tiêu đề video..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL hoặc ID <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input required type="text" value={videoInfo.youtube_id} onChange={handleYoutubeUrlChange} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="https://youtube.com/watch?v=..." />
                </div>
                {videoInfo.youtube_id && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoInfo.youtube_id}`}
                      title="YouTube video preview"
                      className="w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                  <input type="text" value={videoInfo.duration} onChange={e => setVideoInfo({...videoInfo, duration: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="Ví dụ: 15:20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select value={videoInfo.category} onChange={e => setVideoInfo({...videoInfo, category: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                    <option>Biệt thự</option>
                    <option>Nhà phố</option>
                    <option>Nội thất</option>
                    <option>Cải tạo</option>
                    <option>Nhà vườn</option>
                    <option>Kinh nghiệm</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Liên kết dự án (Tùy chọn)</label>
                <select value={videoInfo.project_id} onChange={e => setVideoInfo({...videoInfo, project_id: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all cursor-pointer">
                  <option value="">-- Chọn dự án liên quan --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Liên kết video này với một dự án đã có để hiển thị nút "Xem chi tiết dự án".</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Thumbnail (Kéo thả hoặc chọn ảnh)</label>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center h-64 ${
                  isDragging ? 'border-[var(--color-wood)] bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } ${videoInfo.thumbnail ? 'p-2' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {videoInfo.thumbnail ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden group">
                    <img src={videoInfo.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
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
                  <input type="text" value={videoInfo.thumbnail} onChange={e => setVideoInfo({...videoInfo, thumbnail: e.target.value})} className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--color-wood)] focus:border-transparent outline-none transition-all" placeholder="https://..." />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <PlayCircle size={18} /> Lưu ý về Thumbnail
                </h4>
                <p className="text-sm text-blue-600">
                  Nếu bạn không tải ảnh lên, hệ thống sẽ cố gắng lấy ảnh thumbnail tự động từ YouTube (nếu có thể) khi hiển thị ngoài trang chủ. Tuy nhiên, tốt nhất bạn nên tải lên một ảnh chất lượng cao để hiển thị đẹp nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
