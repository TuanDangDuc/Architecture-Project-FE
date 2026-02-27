import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("architect.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    area INTEGER,
    cost TEXT,
    style TEXT,
    category TEXT,
    description TEXT,
    content TEXT,
    thumbnail TEXT,
    gallery TEXT,
    video TEXT,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    area INTEGER,
    budget TEXT,
    type TEXT,
    time TEXT,
    description TEXT,
    status TEXT DEFAULT 'Mới',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT,
    excerpt TEXT,
    content TEXT,
    thumbnail TEXT,
    category TEXT,
    status TEXT DEFAULT 'published',
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert sample data if empty
try {
  db.exec("ALTER TABLE projects ADD COLUMN content TEXT");
} catch (e) {
  // Column already exists
}

const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (title, area, cost, style, category, description, thumbnail, gallery, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertProject.run(
    "Biệt thự Phố Hiện Đại - Q.7", 
    350, 
    "8.5 tỷ", 
    "Hiện đại", 
    "Biệt thự", 
    "Thiết kế biệt thự phố với không gian mở, hồ bơi vô cực và sân vườn trên mái.", 
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
    "[]",
    "<p>Chi tiết dự án biệt thự phố hiện đại tại Quận 7...</p>"
  );
  insertProject.run(
    "Nhà Phố Tân Cổ Điển - Gò Vấp", 
    280, 
    "5.2 tỷ", 
    "Tân cổ điển", 
    "Nhà phố", 
    "Sự kết hợp tinh tế giữa nét đẹp cổ điển sang trọng và tiện nghi hiện đại.", 
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
    "[]",
    "<p>Chi tiết dự án nhà phố tân cổ điển...</p>"
  );
  insertProject.run(
    "Biệt thự Vườn Nghỉ Dưỡng - Đà Lạt", 
    500, 
    "12 tỷ", 
    "Địa trung hải", 
    "Nhà vườn", 
    "Không gian nghỉ dưỡng tuyệt vời giữa lòng thành phố ngàn hoa.", 
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
    "[]",
    "<p>Chi tiết dự án biệt thự vườn Đà Lạt...</p>"
  );
  insertProject.run(
    "Nhà Ống Lệch Tầng - Bình Thạnh", 
    180, 
    "3.8 tỷ", 
    "Minimalism", 
    "Nhà phố", 
    "Giải pháp tối ưu không gian và ánh sáng cho nhà phố diện tích nhỏ.", 
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
    "[]",
    "<p>Chi tiết dự án nhà ống lệch tầng...</p>"
  );
  insertProject.run(
    "Biệt thự Mái Thái - Đồng Nai", 
    400, 
    "7.5 tỷ", 
    "Á Đông", 
    "Biệt thự", 
    "Kiến trúc mái Thái truyền thống kết hợp công năng hiện đại, phù hợp khí hậu nhiệt đới.", 
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
    "[]",
    "<p>Chi tiết dự án biệt thự mái Thái...</p>"
  );
  insertProject.run(
    "Nội thất Căn hộ Duplex - Q.2", 
    220, 
    "4.5 tỷ", 
    "Luxury", 
    "Nội thất", 
    "Thiết kế nội thất sang trọng, đẳng cấp với vật liệu cao cấp nhập khẩu.", 
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
    "[]",
    "<p>Chi tiết dự án nội thất Duplex...</p>"
  );
}

const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (postCount.count === 0) {
  const insertPost = db.prepare(`
    INSERT INTO posts (title, slug, excerpt, content, thumbnail, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertPost.run(
    "5 Xu hướng thiết kế nhà phố nổi bật năm 2024",
    "xu-huong-thiet-ke-nha-pho-2024",
    "Khám phá những xu hướng kiến trúc đang lên ngôi, từ không gian xanh đến vật liệu bền vững, giúp ngôi nhà của bạn không chỉ đẹp mà còn trường tồn với thời gian.",
    `<style>
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-heading { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-subheading { font-family: "Playfair Display", serif; font-size: 1.4rem; font-weight: 600; color: #333; margin-top: 2rem; margin-bottom: 0.8rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .article-caption { text-align: center; font-style: italic; font-size: 0.9rem; color: #666; margin-top: -1.5rem; margin-bottom: 2rem; }
      .article-list { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
      .article-list li { margin-bottom: 0.5rem; line-height: 1.6; }
      .highlight-box { background-color: #FDFBF7; border-left: 4px solid #9E2A25; padding: 1.5rem; margin: 2rem 0; border-radius: 0 8px 8px 0; }
    </style>
    <p class="article-text">Năm 2024 đánh dấu sự lên ngôi của phong cách thiết kế bền vững và sự quay trở lại của những giá trị truyền thống được làm mới. Không gian sống không chỉ đơn thuần là nơi trú ngụ, mà còn là nơi chữa lành, kết nối con người với thiên nhiên và với chính bản thân mình.</p>
    
    <h2 class="article-heading">1. Không gian xanh đa tầng</h2>
    <p class="article-text">Xu hướng "mang thiên nhiên vào nhà" không còn mới, nhưng trong năm 2024, nó được nâng lên một tầm cao mới với khái niệm "không gian xanh đa tầng". Không chỉ là một vài chậu cây ở ban công, kiến trúc sư đang tích hợp mảng xanh vào mọi ngóc ngách: từ giếng trời, sân trong (courtyard) cho đến những khu vườn trên mái.</p>
    <img class="article-image" src="https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Không gian xanh trong nhà phố" />
    <p class="article-caption">Giếng trời kết hợp cây xanh tạo nên lá phổi tự nhiên cho ngôi nhà.</p>

    <h2 class="article-heading">2. Vật liệu bền vững và thô mộc</h2>
    <p class="article-text">Sự lên ngôi của Wabi Sabi và Japandi đã mở đường cho các vật liệu thô mộc như bê tông trần, gạch nung, gỗ tự nhiên và đá ong. Vẻ đẹp không hoàn hảo của bề mặt vật liệu mang lại cảm giác gần gũi, ấm áp và có chiều sâu thời gian.</p>
    <div class="highlight-box">
      <strong>Lưu ý:</strong> Khi sử dụng vật liệu thô, cần chú ý đến việc xử lý chống thấm và bảo dưỡng định kỳ để đảm bảo độ bền cho công trình.
    </div>

    <h2 class="article-heading">3. Thiết kế mở và linh hoạt</h2>
    <p class="article-text">Ranh giới giữa các phòng chức năng ngày càng mờ nhạt. Phòng khách liền bếp, phòng làm việc kết hợp thư viện... là những giải pháp phổ biến. Việc sử dụng vách ngăn kính, cửa trượt hoặc thay đổi cao độ sàn giúp không gian vừa thông thoáng vừa đảm bảo sự riêng tư cần thiết.</p>

    <h2 class="article-heading">4. Công nghệ Smart Home tích hợp</h2>
    <p class="article-text">Nhà thông minh không còn là khái niệm xa xỉ. Hệ thống chiếu sáng, điều hòa, rèm cửa tự động được điều khiển qua giọng nói hoặc smartphone đang trở thành tiêu chuẩn mới cho nhà phố hiện đại, mang lại sự tiện nghi tối đa.</p>

    <h2 class="article-heading">5. Màu sắc trung tính ấm áp</h2>
    <p class="article-text">Thay vì những gam màu lạnh (cool grey) của thập kỷ trước, năm 2024 ưa chuộng các tông màu trung tính ấm (warm neutrals) như kem, be, nâu đất, cam đất (terracotta). Những gam màu này tạo cảm giác thư thái, dễ chịu và là phông nền hoàn hảo cho đồ nội thất.</p>
    
    <p class="article-text">Việc cập nhật xu hướng không có nghĩa là chạy theo mốt nhất thời. Tại <strong>Mai Hương Architects</strong>, chúng tôi luôn chắt lọc những tinh hoa phù hợp nhất với khí hậu, văn hóa và cá tính của từng gia chủ để kiến tạo nên những không gian sống trường tồn.</p>`,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Xu hướng",
    "published"
  );

  insertPost.run(
    "Kinh nghiệm xây nhà tiết kiệm chi phí cho vợ chồng trẻ",
    "kinh-nghiem-xay-nha-tiet-kiem",
    "Những lưu ý quan trọng giúp bạn tối ưu ngân sách mà vẫn đảm bảo chất lượng công trình, từ khâu thiết kế đến thi công hoàn thiện.",
    `<style>
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-heading { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-list { list-style-type: none; padding-left: 0; margin-bottom: 1.5rem; }
      .article-list li { margin-bottom: 1rem; padding-left: 1.5rem; position: relative; }
      .article-list li::before { content: "✓"; color: #9E2A25; position: absolute; left: 0; font-weight: bold; }
    </style>
    <p class="article-text">Xây nhà là việc hệ trọng cả đời, đặc biệt với các cặp vợ chồng trẻ khi nguồn tài chính còn hạn hẹp. Làm sao để sở hữu một ngôi nhà đẹp, tiện nghi mà không rơi vào cảnh nợ nần chồng chất? Dưới đây là những kinh nghiệm xương máu được đúc kết từ hàng trăm công trình thực tế.</p>
    
    <h2 class="article-heading">1. Lập kế hoạch tài chính chi tiết</h2>
    <p class="article-text">Đừng bao giờ bắt tay vào xây nhà mà không có một bảng dự toán chi tiết. Hãy chia ngân sách thành các khoản mục: Chi phí thiết kế, chi phí xây thô, chi phí hoàn thiện và chi phí nội thất. Luôn dự phòng khoảng 10-15% cho các chi phí phát sinh không tên.</p>

    <h2 class="article-heading">2. Lựa chọn phong cách thiết kế phù hợp</h2>
    <p class="article-text">Phong cách Hiện đại (Modern) hoặc Tối giản (Minimalism) là lựa chọn tối ưu cho ngân sách hạn chế. Các phong cách này tập trung vào công năng, hạn chế các chi tiết trang trí cầu kỳ, phào chỉ rườm rà tốn kém nhân công và vật liệu.</p>
    
    <h2 class="article-heading">3. "Xây thô tốt, hoàn thiện dần"</h2>
    <p class="article-text">Nếu ngân sách chưa cho phép, hãy đầu tư mạnh vào phần kết cấu (móng, cột, dầm, sàn) và hệ thống điện nước âm tường. Đây là những phần khó sửa chữa sau này. Phần nội thất và trang trí có thể hoàn thiện dần theo thời gian khi có thêm điều kiện tài chính.</p>

    <h2 class="article-heading">4. Chọn vật liệu thông minh</h2>
    <ul class="article-list">
      <li><strong>Gạch ốp lát:</strong> Chọn loại gạch nội địa chất lượng cao thay vì gạch nhập khẩu đắt đỏ.</li>
      <li><strong>Cửa:</strong> Sử dụng cửa nhôm kính hệ phổ thông cho cửa sổ, cửa gỗ công nghiệp cho cửa phòng ngủ thay vì gỗ tự nhiên nguyên khối.</li>
      <li><strong>Sơn:</strong> Chọn thương hiệu uy tín nhưng dòng trung cấp là đủ đảm bảo độ bền 5-7 năm.</li>
    </ul>

    <h2 class="article-heading">5. Thuê đơn vị thiết kế thi công trọn gói uy tín</h2>
    <p class="article-text">Nhiều người nghĩ tự gọi thợ sẽ rẻ hơn, nhưng thực tế thường ngược lại do quản lý kém, thất thoát vật tư và sai sót kỹ thuật phải đập đi xây lại. Một đơn vị chuyên nghiệp sẽ giúp bạn tối ưu giải pháp, quản lý vật tư và cam kết không phát sinh chi phí.</p>`,
    "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Kinh nghiệm",
    "published"
  );

  insertPost.run(
    "Phong cách Indochine - Bản giao hưởng Đông Dương",
    "phong-cach-indochine",
    "Tìm hiểu về phong cách thiết kế Indochine: sự kết hợp hoàn hảo giữa nét hoài cổ Á Đông và lãng mạn Pháp, tạo nên không gian sống đầy chất thơ.",
    `<style>
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-heading { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-image { width: 100%; border-radius: 0; margin: 2rem 0; }
      .quote-box { font-family: "Playfair Display", serif; font-size: 1.5rem; font-style: italic; text-align: center; color: #7B1E1A; margin: 3rem 0; padding: 0 2rem; }
    </style>
    <p class="article-text">Phong cách Indochine (Đông Dương) là sự giao thoa bản sắc giữa nền văn hóa Á Đông lâu đời và nét lãng mạn, hiện đại của kiến trúc Pháp. Trải qua bao thăng trầm lịch sử, Indochine vẫn giữ nguyên sức hút mãnh liệt, trở thành biểu tượng của sự sang trọng, tinh tế và hoài niệm.</p>
    
    <div class="quote-box">"Indochine là nụ hôn kiểu Pháp trên môi cô gái Á Đông."</div>

    <h2 class="article-heading">Đặc trưng của phong cách Indochine</h2>
    <p class="article-text">Không gian Indochine thường sử dụng các gam màu nhiệt đới ấm nóng như vàng nhạt, vàng kem, trắng... kết hợp với màu sắc của vật liệu tự nhiên như gỗ, tre, mây, gạch bông. Điểm nhấn thường là những họa tiết kỷ hà, hoa lá cách điệu hay tĩnh vật mang đậm bản sắc văn hóa Việt Nam.</p>
    
    <img class="article-image" src="https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Nội thất phong cách Indochine" />

    <h2 class="article-heading">Vật liệu truyền thống</h2>
    <p class="article-text">Gỗ tự nhiên, tre, mây, gạch bông (gạch cement) là những vật liệu không thể thiếu. Chúng không chỉ bền bỉ với khí hậu nhiệt đới mà còn mang lại cảm giác gần gũi, thân thuộc.</p>

    <h2 class="article-heading">Ứng dụng trong nhà ở hiện đại</h2>
    <p class="article-text">Ngày nay, Indochine được các kiến trúc sư "trẻ hóa" để phù hợp với nhịp sống hiện đại. Vẫn giữ cái hồn cốt xưa cũ nhưng đường nét được giản lược, nội thất tiện nghi hơn, tạo nên một không gian sống vừa sang trọng, vừa ấm cúng và đầy chất nghệ thuật.</p>`,
    "https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Kiến thức",
    "published"
  );
  insertPost.run(
    "Giải pháp lấy sáng và thông gió cho nhà ống diện tích nhỏ",
    "giai-phap-lay-sang-nha-ong",
    "Bí quyết khắc phục nhược điểm thiếu sáng, bí bách của nhà ống đô thị.",
    "<p>Nhà ống thường gặp vấn đề về ánh sáng và thông gió...</p>",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Giải pháp",
    "published"
  );
  insertPost.run(
    "Phong thủy trong xây dựng nhà ở: Những điều kiêng kỵ",
    "phong-thuy-xay-nha",
    "Những nguyên tắc phong thủy cơ bản giúp gia chủ đón tài lộc, may mắn.",
    "<p>Phong thủy đóng vai trò quan trọng trong văn hóa xây dựng của người Việt...</p>",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Phong thủy",
    "published"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    const views = db.prepare("SELECT SUM(views) as total FROM projects").get() as { total: number };
    const clicks = db.prepare("SELECT SUM(clicks) as total FROM projects").get() as { total: number };
    const consultations = db.prepare("SELECT COUNT(*) as total FROM consultations WHERE status = 'Mới'").get() as { total: number };
    const projects = db.prepare("SELECT COUNT(*) as total FROM projects").get() as { total: number };
    
    res.json({
      views: views.total || 0,
      clicks: clicks.total || 0,
      consultations: consultations.total || 0,
      projects: projects.total || 0,
    });
  });

  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
    res.json(projects.map((p: any) => ({ ...p, gallery: JSON.parse(p.gallery || '[]') })));
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id) as any;
    if (project) {
      db.prepare("UPDATE projects SET views = views + 1 WHERE id = ?").run(req.params.id);
      res.json({ ...project, gallery: JSON.parse(project.gallery || '[]') });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/projects", (req, res) => {
    const { title, area, cost, style, category, description, content, thumbnail, gallery, video } = req.body;
    const stmt = db.prepare(`
      INSERT INTO projects (title, area, cost, style, category, description, content, thumbnail, gallery, video)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, area, cost, style, category, description, content, thumbnail, JSON.stringify(gallery || []), video);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { title, area, cost, style, category, description, content, thumbnail, gallery, video } = req.body;
    const stmt = db.prepare(`
      UPDATE projects SET title = ?, area = ?, cost = ?, style = ?, category = ?, description = ?, content = ?, thumbnail = ?, gallery = ?, video = ?
      WHERE id = ?
    `);
    stmt.run(title, area, cost, style, category, description, content, thumbnail, JSON.stringify(gallery || []), video, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/projects/:id/click", (req, res) => {
    db.prepare("UPDATE projects SET clicks = clicks + 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/consultations", (req, res) => {
    const consultations = db.prepare("SELECT * FROM consultations ORDER BY created_at DESC").all();
    res.json(consultations);
  });

  app.post("/api/consultations", (req, res) => {
    const { name, phone, email, area, budget, type, time, description } = req.body;
    const stmt = db.prepare(`
      INSERT INTO consultations (name, phone, email, area, budget, type, time, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, phone, email, area, budget, type, time, description);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/consultations/:id/status", (req, res) => {
    db.prepare("UPDATE consultations SET status = ? WHERE id = ?").run(req.body.status, req.params.id);
    res.json({ success: true });
  });

  // --- Posts API ---
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
    if (post) res.json(post);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/posts", (req, res) => {
    const { title, excerpt, content, thumbnail, category, status } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const stmt = db.prepare(`
      INSERT INTO posts (title, slug, excerpt, content, thumbnail, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, slug, excerpt, content, thumbnail, category, status || 'published');
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/posts/:id", (req, res) => {
    const { title, excerpt, content, thumbnail, category, status } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const stmt = db.prepare(`
      UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, thumbnail = ?, category = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(title, slug, excerpt, content, thumbnail, category, status || 'published', req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/posts/:id", (req, res) => {
    const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
