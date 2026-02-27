import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LayoutDashboard, FolderKanban, MessageSquare, Plus, Edit, Trash2, Eye, MousePointerClick, FileText, CheckCircle, Clock, LayoutTemplate, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ views: 0, clicks: 0, consultations: 0, projects: 0 });
  const [projects, setProjects] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "", category: "Nhà phố", style: "", area: "", cost: "", description: "", thumbnail: "", video: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/stats").then(res => res.json()).then(setStats);
    fetch("/api/projects").then(res => res.json()).then(setProjects);
    fetch("/api/consultations").then(res => res.json()).then(setConsultations);
    fetch("/api/posts").then(res => res.json()).then(setPosts);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject)
    });
    setIsAddingProject(false);
    setNewProject({ title: "", category: "Nhà phố", style: "", area: "", cost: "", description: "", thumbnail: "", video: "" });
    fetchData();
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const handleDeletePost = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const handleUpdateConsultationStatus = async (id: number, status: string) => {
    await fetch(`/api/consultations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-serif font-bold text-[var(--color-wood)]">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "projects", label: "Quản lý dự án", icon: FolderKanban },
            { id: "posts", label: "Đăng bài post", icon: FileText },
            { id: "consultations", label: "Yêu cầu tư vấn", icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === item.id 
                  ? "bg-[var(--color-wood)] text-white shadow-md translate-x-1" 
                  : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Thống kê tổng quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-4">
                  <Eye size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Lượt xem dự án</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.views}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mr-4">
                  <MousePointerClick size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Lượt click</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.clicks}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center mr-4">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Tư vấn mới</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.consultations}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-4">
                  <FolderKanban size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Tổng dự án</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.projects}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-800">Quản lý dự án</h2>
              <button 
                onClick={() => navigate('/admin/editor')}
                className="flex items-center px-4 py-2 bg-[var(--color-wood)] text-white rounded-lg hover:bg-[var(--color-gold)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus size={20} className="mr-2" /> Thêm dự án mới
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Dự án</th>
                    <th className="p-4 font-semibold text-gray-600">Danh mục</th>
                    <th className="p-4 font-semibold text-gray-600">Diện tích</th>
                    <th className="p-4 font-semibold text-gray-600">Lượt xem</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 flex items-center">
                        <img src={p.thumbnail || `https://loremflickr.com/100/100/architecture?lock=${p.id}`} alt="" className="w-12 h-12 rounded object-cover mr-4" referrerPolicy="no-referrer" />
                        <span className="font-medium text-gray-800">{p.title}</span>
                      </td>
                      <td className="p-4 text-gray-600">{p.category}</td>
                      <td className="p-4 text-gray-600">{p.area} m²</td>
                      <td className="p-4 text-gray-600">{p.views}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => navigate('/admin/editor', { state: { project: p } })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-800">Quản lý bài viết</h2>
              <button 
                onClick={() => navigate('/admin/post-editor')}
                className="flex items-center px-6 py-3 bg-[var(--color-wood)] text-white font-medium rounded-xl hover:bg-[var(--color-gold)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus size={20} className="mr-2" /> Thêm bài viết mới
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Bài viết</th>
                    <th className="p-4 font-semibold text-gray-600">Danh mục</th>
                    <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                    <th className="p-4 font-semibold text-gray-600">Ngày đăng</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 flex items-center">
                        <img src={p.thumbnail || `https://loremflickr.com/100/100/news?lock=${p.id}`} alt="" className="w-12 h-12 rounded object-cover mr-4" referrerPolicy="no-referrer" />
                        <span className="font-medium text-gray-800 line-clamp-1">{p.title}</span>
                      </td>
                      <td className="p-4 text-gray-600">{p.category || 'Tin tức'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {p.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => navigate('/admin/post-editor', { state: { post: p } })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"><Edit size={18} /></button>
                        <button onClick={() => handleDeletePost(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có bài viết nào. Hãy thêm bài viết đầu tiên!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Consultations Tab */}
        {activeTab === "consultations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Yêu cầu tư vấn</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
                    <th className="p-4 font-semibold text-gray-600">Liên hệ</th>
                    <th className="p-4 font-semibold text-gray-600">Nhu cầu</th>
                    <th className="p-4 font-semibold text-gray-600">Ngày gửi</th>
                    <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((c: any) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{c.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-800">{c.phone}</p>
                        <p className="text-sm text-gray-500">{c.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-800">{c.type}</p>
                        <p className="text-sm text-gray-500">{c.area}m² - {c.budget}</p>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4">
                        <select 
                          value={c.status}
                          onChange={(e) => handleUpdateConsultationStatus(c.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-gray-200 cursor-pointer transition-colors ${
                            c.status === 'Mới' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            c.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                            c.status === 'Đã liên hệ' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <option value="Mới">Mới</option>
                          <option value="Đang xử lý">Đang xử lý</option>
                          <option value="Đã liên hệ">Đã liên hệ</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedConsultation(c)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>

      {/* Consultation Details Modal */}
      <AnimatePresence>
        {selectedConsultation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedConsultation(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-serif font-bold text-gray-800">Chi tiết yêu cầu tư vấn</h3>
                <button 
                  onClick={() => setSelectedConsultation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Khách hàng</p>
                    <p className="font-medium text-gray-800 text-lg">{selectedConsultation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày gửi</p>
                    <p className="font-medium text-gray-800">{new Date(selectedConsultation.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-medium text-gray-800">{selectedConsultation.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-800">{selectedConsultation.email || 'Không có'}</p>
                  </div>
                </div>
                
                <div className="h-px bg-gray-100 w-full"></div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Loại công trình</p>
                    <p className="font-medium text-gray-800">{selectedConsultation.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Thời gian dự kiến</p>
                    <p className="font-medium text-gray-800">{selectedConsultation.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Diện tích</p>
                    <p className="font-medium text-gray-800">{selectedConsultation.area} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngân sách dự kiến</p>
                    <p className="font-medium text-gray-800">{selectedConsultation.budget}</p>
                  </div>
                </div>
                
                <div className="h-px bg-gray-100 w-full"></div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Yêu cầu chi tiết</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap">
                    {selectedConsultation.description || 'Không có yêu cầu chi tiết.'}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedConsultation(null)}
                  className="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
