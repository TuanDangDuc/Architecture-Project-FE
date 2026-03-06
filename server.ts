import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    thumbnail TEXT,
    duration TEXT,
    views INTEGER DEFAULT 0,
    category TEXT,
    youtube_id TEXT,
    project_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert sample data if empty
try {
  db.exec("ALTER TABLE projects ADD COLUMN content TEXT");
} catch (e) {
  // Column already exists
}

const videoCount = db.prepare("SELECT COUNT(*) as count FROM videos").get() as {
  count: number;
};
if (videoCount.count === 0) {
  const insertVideo = db.prepare(`
    INSERT INTO videos (title, thumbnail, duration, views, category, youtube_id, project_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertVideo.run(
    "Review Biệt thự Thảo Điền - Không gian sống đẳng cấp ven sông",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "15:20",
    12000,
    "Biệt thự",
    "dQw4w9WgXcQ",
    1,
  );
  insertVideo.run(
    "Khám phá Penthouse Landmark 81 với thiết kế nội thất siêu sang",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "12:45",
    8500,
    "Nội thất",
    "dQw4w9WgXcQ",
    3,
  );
  insertVideo.run(
    "Nhà phố Minimalist 4 tầng tại Quận 7 - Tối ưu ánh sáng tự nhiên",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "10:30",
    5200,
    "Nhà phố",
    "dQw4w9WgXcQ",
    2,
  );
}

const consultationCount = db
  .prepare("SELECT COUNT(*) as count FROM consultations")
  .get() as { count: number };
if (consultationCount.count === 0) {
  const insertConsultation = db.prepare(`
    INSERT INTO consultations (name, phone, email, area, budget, type, time, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertConsultation.run(
    "Nguyễn Văn An",
    "0909123456",
    "nguyenvanan@gmail.com",
    100,
    "1 - 2 tỷ",
    "Thiết kế nhà phố",
    "Buổi sáng (8h-12h)",
    "Tôi có mảnh đất 5x20m, muốn xây nhà phố 3 tầng phong cách hiện đại, có gara ô tô.",
    "Mới",
  );
  insertConsultation.run(
    "Trần Thị Bích",
    "0912345678",
    "tranthibich@gmail.com",
    250,
    "Trên 5 tỷ",
    "Thiết kế biệt thự",
    "Buổi chiều (13h-17h)",
    "Tư vấn thiết kế biệt thự vườn nghỉ dưỡng tại Bảo Lộc, ưu tiên không gian mở và vật liệu tự nhiên.",
    "Đang xử lý",
  );
  insertConsultation.run(
    "Lê Hoàng Nam",
    "0987654321",
    "lehoangnam@outlook.com",
    75,
    "500tr - 1 tỷ",
    "Thiết kế nội thất",
    "Buổi tối (18h-21h)",
    "Cần thiết kế và thi công nội thất căn hộ chung cư 2 phòng ngủ, phong cách tối giản (Minimalism).",
    "Đã liên hệ",
  );
  insertConsultation.run(
    "Phạm Minh Tuấn",
    "0933445566",
    "tuanpham@company.com",
    150,
    "2 - 5 tỷ",
    "Thi công trọn gói",
    "Buổi sáng (8h-12h)",
    "Xây dựng nhà phố kết hợp văn phòng kinh doanh, mặt tiền 6m.",
    "Mới",
  );
}

const projectCount = db
  .prepare("SELECT COUNT(*) as count FROM projects")
  .get() as { count: number };
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
    `<style>
      .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .article-quote { background-color: #FDFBF7; border-left: 4px solid #9E2A25; padding: 2rem; margin: 2rem 0; border-radius: 0 12px 12px 0; position: relative; }
      .quote-icon { font-size: 2rem; color: #9E2A25; line-height: 1; margin-bottom: 1rem; }
      .quote-text { font-family: "Playfair Display", serif; font-size: 1.4rem; font-style: italic; color: #333; margin-bottom: 1rem; line-height: 1.6; }
      .quote-author { font-weight: bold; color: #7B1E1A; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
      .project-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
      .feature-item { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #eee; }
      .feature-title { font-weight: bold; color: #7B1E1A; margin-bottom: 0.5rem; }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>

    <h2 class="article-title">Ý tưởng thiết kế</h2>
    <p class="article-text">Lấy cảm hứng từ vẻ đẹp vượt thời gian của kiến trúc đương đại, dự án Biệt thự Phố Q.7 được thiết kế với tiêu chí tối ưu hóa không gian và kết nối con người với thiên nhiên. Từng đường nét kiến trúc đều được tính toán kỹ lưỡng để đón trọn ánh sáng tự nhiên và gió trời, tạo nên một không gian sống đẳng cấp giữa lòng đô thị.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Phối cảnh dự án" />
      <figcaption class="image-caption">Phối cảnh tổng thể biệt thự nhìn từ trên cao</figcaption>
    </figure>

    <h2 class="article-title">Giải pháp không gian</h2>
    <p class="article-text">Mặt bằng công năng được bố trí khoa học, phân khu rõ ràng nhưng vẫn đảm bảo sự kết nối xuyên suốt. Phòng khách và bếp được thiết kế liên thông tạo cảm giác rộng rãi, thoáng đãng. Điểm nhấn đặc biệt là hồ bơi vô cực trên tầng thượng, mang lại trải nghiệm nghỉ dưỡng ngay tại nhà.</p>

    <div class="project-features">
      <div class="feature-item">
        <div class="feature-title">Thông gió tự nhiên</div>
        <p>Hệ thống giếng trời và cửa sổ đối lưu giúp không khí luôn tươi mới, giảm thiểu sự phụ thuộc vào điều hòa.</p>
      </div>
      <div class="feature-item">
        <div class="feature-title">Ánh sáng tối ưu</div>
        <p>Tận dụng tối đa ánh sáng mặt trời qua hệ vách kính lớn, giúp tiết kiệm năng lượng và tốt cho sức khỏe.</p>
      </div>
      <div class="feature-item">
        <div class="feature-title">Vật liệu cao cấp</div>
        <p>Sử dụng đá Marble tự nhiên, gỗ Óc chó nhập khẩu và thiết bị vệ sinh Duravit sang trọng.</p>
      </div>
    </div>

    <h2 class="article-title">Vật liệu & Thi công</h2>
    <p class="article-text">Chúng tôi ưu tiên sử dụng các vật liệu tự nhiên như gỗ, đá, kết hợp với bê tông trần và kính cường lực. Sự tương phản giữa các bề mặt vật liệu tạo nên nét độc đáo và cá tính cho công trình. Quy trình thi công được giám sát nghiêm ngặt đảm bảo độ sắc nét trong từng chi tiết.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Chi tiết nội thất" />
      <figcaption class="image-caption">Chi tiết nội thất phòng khách với vật liệu gỗ óc chó</figcaption>
    </figure>

    <div class="article-quote">
      <div class="quote-icon">✦</div>
      <p class="quote-text">"Tôi thực sự ấn tượng với sự chuyên nghiệp và tận tâm của đội ngũ Mai Hương Architects. Ngôi nhà không chỉ đẹp mà còn rất tiện nghi, đúng như những gì tôi hằng mơ ước về một tổ ấm bình yên."</p>
      <p class="quote-author">- Anh Tuấn, Chủ đầu tư</p>
    </div>`,
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
    `<style>
      .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .article-quote { background-color: #FDFBF7; border-left: 4px solid #9E2A25; padding: 2rem; margin: 2rem 0; border-radius: 0 12px 12px 0; position: relative; }
      .quote-icon { font-size: 2rem; color: #9E2A25; line-height: 1; margin-bottom: 1rem; }
      .quote-text { font-family: "Playfair Display", serif; font-size: 1.4rem; font-style: italic; color: #333; margin-bottom: 1rem; line-height: 1.6; }
      .quote-author { font-weight: bold; color: #7B1E1A; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>

    <h2 class="article-title">Vẻ đẹp vượt thời gian</h2>
    <p class="article-text">Dự án Nhà phố Tân cổ điển tại Gò Vấp là minh chứng cho sự kết hợp hoàn hảo giữa vẻ đẹp kiêu sa của kiến trúc cổ điển và sự tiện nghi của cuộc sống hiện đại. Những đường phào chỉ tinh tế, hệ cột trụ vững chãi cùng gam màu trắng kem chủ đạo tạo nên một diện mạo sang trọng, thanh lịch.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Mặt tiền nhà phố tân cổ điển" />
      <figcaption class="image-caption">Mặt tiền nhà phố với kiến trúc Tân cổ điển sang trọng</figcaption>
    </figure>

    <h2 class="article-title">Nội thất sang trọng</h2>
    <p class="article-text">Không gian nội thất được chăm chút tỉ mỉ với các chất liệu cao cấp như gỗ tự nhiên, da thật và đá hoa cương. Phòng khách nổi bật với bộ sofa cổ điển, đèn chùm pha lê lộng lẫy, tạo nên không gian tiếp khách đẳng cấp.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Nội thất phòng khách" />
      <figcaption class="image-caption">Không gian phòng khách với nội thất cao cấp</figcaption>
    </figure>

    <div class="article-quote">
      <div class="quote-icon">✦</div>
      <p class="quote-text">"Ngôi nhà mang lại cảm giác ấm cúng và sang trọng mỗi khi bước về. Cảm ơn đội ngũ KTS đã hiện thực hóa ý tưởng của gia đình tôi một cách xuất sắc."</p>
      <p class="quote-author">- Chị Lan, Chủ đầu tư</p>
    </div>`,
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
    `<style>
      .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .highlight-box { background-color: #eef2f5; border-left: 4px solid #2c3e50; padding: 1.5rem; margin: 2rem 0; border-radius: 0 8px 8px 0; font-style: italic; color: #555; }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>

    <h2 class="article-title">Hơi thở Địa Trung Hải giữa lòng Đà Lạt</h2>
    <p class="article-text">Nằm giữa đồi thông thơ mộng, biệt thự vườn mang phong cách Địa Trung Hải hiện lên như một bức tranh đầy màu sắc. Mái ngói đỏ nung, tường trắng và những vòm cửa cong mềm mại tạo nên nét quyến rũ khó cưỡng.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Biệt thự vườn Đà Lạt" />
      <figcaption class="image-caption">Toàn cảnh biệt thự giữa đồi thông Đà Lạt</figcaption>
    </figure>

    <h2 class="article-title">Sân vườn và Cảnh quan</h2>
    <p class="article-text">Khu vườn rộng lớn được thiết kế với nhiều loài hoa đặc trưng của Đà Lạt như Cẩm Tú Cầu, Lavender... Lối đi lát đá tự nhiên uốn lượn dẫn lối vào từng góc nhỏ bình yên, nơi gia chủ có thể thưởng trà và ngắm nhìn thung lũng.</p>
    
    <div class="highlight-box">
      "Một không gian sống chậm, nơi con người hòa mình vào thiên nhiên và tận hưởng những khoảnh khắc an yên."
    </div>

    <h2 class="article-title">Nội thất Rustic mộc mạc</h2>
    <p class="article-text">Nội thất bên trong sử dụng chủ yếu là gỗ thông, vải thô và gốm sứ, mang lại cảm giác ấm áp, gần gũi. Lò sưởi được bố trí tại trung tâm phòng khách, là nơi cả gia đình quây quần trong những đêm Đà Lạt se lạnh.</p>`,
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
    `<style>
      .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>
    <h2 class="article-title">Giải pháp cho nhà phố diện tích nhỏ</h2>
    <p class="article-text">Với diện tích đất hạn chế, giải pháp lệch tầng được áp dụng để tạo sự thông thoáng và kết nối các không gian. Cầu thang được bố trí gọn gàng, kết hợp với giếng trời giúp ánh sáng len lỏi vào từng tầng.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Nhà ống lệch tầng" />
      <figcaption class="image-caption">Mặt cắt phối cảnh nhà ống lệch tầng</figcaption>
    </figure>
    <p class="article-text">Phong cách Minimalism (Tối giản) được lựa chọn để tối ưu hóa không gian sử dụng. Màu trắng chủ đạo kết hợp với nội thất gỗ sáng màu tạo cảm giác rộng rãi hơn so với diện tích thực.</p>`,
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
    `<style>
      .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>
    <h2 class="article-title">Kiến trúc truyền thống và hiện đại</h2>
    <p class="article-text">Biệt thự mái Thái luôn là lựa chọn hàng đầu của nhiều gia đình Việt nhờ vẻ đẹp thanh thoát và khả năng chống nóng, chống thấm tốt. Tại dự án này, chúng tôi đã cách tân hệ mái để phù hợp hơn với thẩm mỹ đương đại.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Biệt thự mái Thái" />
      <figcaption class="image-caption">Biệt thự mái Thái với sân vườn rộng rãi</figcaption>
    </figure>
    <p class="article-text">Không gian sân vườn rộng rãi bao quanh ngôi nhà, tạo nên một hệ sinh thái xanh mát. Hồ cá Koi và chòi nghỉ là điểm nhấn thư giãn cho cả gia đình vào dịp cuối tuần.</p>`,
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
    `<style>
      .article-title { font-family: "Playfair Display", serif; font-size: 1.8rem; font-weight: bold; color: #7B1E1A; margin-top: 2.5rem; margin-bottom: 1rem; }
      .article-text { font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 1.5rem; }
      .article-image { width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>
    <h2 class="article-title">Đẳng cấp sống thượng lưu</h2>
    <p class="article-text">Căn hộ Duplex tại Quận 2 được thiết kế theo phong cách Luxury, đề cao sự sang trọng và tinh tế. Phòng khách thông tầng với vách kính Panorama mở ra tầm nhìn tuyệt đẹp về trung tâm thành phố.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Nội thất Duplex" />
      <figcaption class="image-caption">Phòng khách thông tầng với view Panorama</figcaption>
    </figure>
    <p class="article-text">Vật liệu kim loại mạ vàng PVD, đá Marble và da bò Ý được phối hợp hài hòa, tạo nên những điểm nhấn đắt giá cho không gian sống.</p>`,
  );
}

const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as {
  count: number;
};
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
      .article-list { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
      .article-list li { margin-bottom: 0.5rem; line-height: 1.6; }
      .highlight-box { background-color: #FDFBF7; border-left: 4px solid #9E2A25; padding: 1.5rem; margin: 2rem 0; border-radius: 0 8px 8px 0; }
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>
    <p class="article-text">Năm 2024 đánh dấu sự lên ngôi của phong cách thiết kế bền vững và sự quay trở lại của những giá trị truyền thống được làm mới. Không gian sống không chỉ đơn thuần là nơi trú ngụ, mà còn là nơi chữa lành, kết nối con người với thiên nhiên và với chính bản thân mình.</p>
    
    <h2 class="article-heading">1. Không gian xanh đa tầng</h2>
    <p class="article-text">Xu hướng "mang thiên nhiên vào nhà" không còn mới, nhưng trong năm 2024, nó được nâng lên một tầm cao mới với khái niệm "không gian xanh đa tầng". Không chỉ là một vài chậu cây ở ban công, kiến trúc sư đang tích hợp mảng xanh vào mọi ngóc ngách: từ giếng trời, sân trong (courtyard) cho đến những khu vườn trên mái.</p>
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Không gian xanh trong nhà phố" />
      <figcaption class="image-caption">Giếng trời kết hợp cây xanh tạo nên lá phổi tự nhiên cho ngôi nhà.</figcaption>
    </figure>

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
    "published",
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
    "published",
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
      .image-figure { margin: 2rem 0; text-align: center; }
      .image-caption { font-style: italic; color: #666; font-size: 0.9rem; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block; border: 1px solid #eee; }
    </style>
    <p class="article-text">Phong cách Indochine (Đông Dương) là sự giao thoa bản sắc giữa nền văn hóa Á Đông lâu đời và nét lãng mạn, hiện đại của kiến trúc Pháp. Trải qua bao thăng trầm lịch sử, Indochine vẫn giữ nguyên sức hút mãnh liệt, trở thành biểu tượng của sự sang trọng, tinh tế và hoài niệm.</p>
    
    <div class="quote-box">"Indochine là nụ hôn kiểu Pháp trên môi cô gái Á Đông."</div>

    <h2 class="article-heading">Đặc trưng của phong cách Indochine</h2>
    <p class="article-text">Không gian Indochine thường sử dụng các gam màu nhiệt đới ấm nóng như vàng nhạt, vàng kem, trắng... kết hợp với màu sắc của vật liệu tự nhiên như gỗ, tre, mây, gạch bông. Điểm nhấn thường là những họa tiết kỷ hà, hoa lá cách điệu hay tĩnh vật mang đậm bản sắc văn hóa Việt Nam.</p>
    
    <figure class="image-figure">
      <img class="article-image" src="https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Nội thất phong cách Indochine" />
      <figcaption class="image-caption">Không gian nội thất Indochine với gạch bông và gỗ tự nhiên</figcaption>
    </figure>

    <h2 class="article-heading">Vật liệu truyền thống</h2>
    <p class="article-text">Gỗ tự nhiên, tre, mây, gạch bông (gạch cement) là những vật liệu không thể thiếu. Chúng không chỉ bền bỉ với khí hậu nhiệt đới mà còn mang lại cảm giác gần gũi, thân thuộc.</p>

    <h2 class="article-heading">Ứng dụng trong nhà ở hiện đại</h2>
    <p class="article-text">Ngày nay, Indochine được các kiến trúc sư "trẻ hóa" để phù hợp với nhịp sống hiện đại. Vẫn giữ cái hồn cốt xưa cũ nhưng đường nét được giản lược, nội thất tiện nghi hơn, tạo nên một không gian sống vừa sang trọng, vừa ấm cúng và đầy chất nghệ thuật.</p>`,
    "https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Kiến thức",
    "published",
  );
  insertPost.run(
    "Giải pháp lấy sáng và thông gió cho nhà ống diện tích nhỏ",
    "giai-phap-lay-sang-nha-ong",
    "Bí quyết khắc phục nhược điểm thiếu sáng, bí bách của nhà ống đô thị.",
    "<p>Nhà ống thường gặp vấn đề về ánh sáng và thông gió...</p>",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Giải pháp",
    "published",
  );
  insertPost.run(
    "Phong thủy trong xây dựng nhà ở: Những điều kiêng kỵ",
    "phong-thuy-xay-nha",
    "Những nguyên tắc phong thủy cơ bản giúp gia chủ đón tài lộc, may mắn.",
    "<p>Phong thủy đóng vai trò quan trọng trong văn hóa xây dựng của người Việt...</p>",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "Phong thủy",
    "published",
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    const views = db
      .prepare("SELECT SUM(views) as total FROM projects")
      .get() as { total: number };
    const clicks = db
      .prepare("SELECT SUM(clicks) as total FROM projects")
      .get() as { total: number };
    const consultations = db
      .prepare(
        "SELECT COUNT(*) as total FROM consultations WHERE status = 'Mới'",
      )
      .get() as { total: number };
    const projects = db
      .prepare("SELECT COUNT(*) as total FROM projects")
      .get() as { total: number };

    res.json({
      views: views.total || 0,
      clicks: clicks.total || 0,
      consultations: consultations.total || 0,
      projects: projects.total || 0,
    });
  });

  app.get("/api/projects", (req, res) => {
    const projects = db
      .prepare("SELECT * FROM projects ORDER BY created_at DESC")
      .all();
    res.json(
      projects.map((p: any) => ({
        ...p,
        gallery: JSON.parse(p.gallery || "[]"),
      })),
    );
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(req.params.id) as any;
    if (project) {
      db.prepare("UPDATE projects SET views = views + 1 WHERE id = ?").run(
        req.params.id,
      );
      res.json({ ...project, gallery: JSON.parse(project.gallery || "[]") });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/projects", (req, res) => {
    const {
      title,
      area,
      cost,
      style,
      category,
      description,
      content,
      thumbnail,
      gallery,
      video,
    } = req.body;
    const stmt = db.prepare(`
      INSERT INTO projects (title, area, cost, style, category, description, content, thumbnail, gallery, video)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title,
      area,
      cost,
      style,
      category,
      description,
      content,
      thumbnail,
      JSON.stringify(gallery || []),
      video,
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const {
      title,
      area,
      cost,
      style,
      category,
      description,
      content,
      thumbnail,
      gallery,
      video,
    } = req.body;
    const stmt = db.prepare(`
      UPDATE projects SET title = ?, area = ?, cost = ?, style = ?, category = ?, description = ?, content = ?, thumbnail = ?, gallery = ?, video = ?
      WHERE id = ?
    `);
    stmt.run(
      title,
      area,
      cost,
      style,
      category,
      description,
      content,
      thumbnail,
      JSON.stringify(gallery || []),
      video,
      req.params.id,
    );
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/projects/:id/click", (req, res) => {
    db.prepare("UPDATE projects SET clicks = clicks + 1 WHERE id = ?").run(
      req.params.id,
    );
    res.json({ success: true });
  });

  app.get("/api/consultations", (req, res) => {
    const consultations = db
      .prepare("SELECT * FROM consultations ORDER BY created_at DESC")
      .all();
    res.json(consultations);
  });

  app.post("/api/consultations", (req, res) => {
    const { name, phone, email, area, budget, type, time, description } =
      req.body;
    const stmt = db.prepare(`
      INSERT INTO consultations (name, phone, email, area, budget, type, time, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      name,
      phone,
      email,
      area,
      budget,
      type,
      time,
      description,
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/consultations/:id/status", (req, res) => {
    db.prepare("UPDATE consultations SET status = ? WHERE id = ?").run(
      req.body.status,
      req.params.id,
    );
    res.json({ success: true });
  });

  // --- Posts API ---
  app.get("/api/posts", (req, res) => {
    const posts = db
      .prepare("SELECT * FROM posts ORDER BY created_at DESC")
      .all();
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const post = db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .get(req.params.id);
    if (post) res.json(post);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/posts", (req, res) => {
    const { title, excerpt, content, thumbnail, category, status } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const stmt = db.prepare(`
      INSERT INTO posts (title, slug, excerpt, content, thumbnail, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      status || "published",
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/posts/:id", (req, res) => {
    const { title, excerpt, content, thumbnail, category, status } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const stmt = db.prepare(`
      UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, thumbnail = ?, category = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      status || "published",
      req.params.id,
    );
    res.json({ success: true });
  });

  app.delete("/api/posts/:id", (req, res) => {
    const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  // --- Videos API ---
  app.get("/api/videos", (req, res) => {
    const videos = db
      .prepare("SELECT * FROM videos ORDER BY created_at DESC")
      .all();
    res.json(videos);
  });

  app.get("/api/videos/:id", (req, res) => {
    const video = db
      .prepare("SELECT * FROM videos WHERE id = ?")
      .get(req.params.id);
    if (video) res.json(video);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/videos", (req, res) => {
    const { title, thumbnail, duration, category, youtube_id, project_id } =
      req.body;
    const stmt = db.prepare(`
      INSERT INTO videos (title, thumbnail, duration, category, youtube_id, project_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title,
      thumbnail,
      duration,
      category,
      youtube_id,
      project_id,
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/videos/:id", (req, res) => {
    const { title, thumbnail, duration, category, youtube_id, project_id } =
      req.body;
    const stmt = db.prepare(`
      UPDATE videos SET title = ?, thumbnail = ?, duration = ?, category = ?, youtube_id = ?, project_id = ?
      WHERE id = ?
    `);
    stmt.run(
      title,
      thumbnail,
      duration,
      category,
      youtube_id,
      project_id,
      req.params.id,
    );
    res.json({ success: true });
  });

  app.delete("/api/videos/:id", (req, res) => {
    const stmt = db.prepare("DELETE FROM videos WHERE id = ?");
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
    // SPA fallback: serve index.html for all non-API routes
    app.get(/^(?!\/api).*$/, async (req, res) => {
      try {
        const indexPath = path.join(__dirname, "index.html");
        const indexHtml = await vite.transformIndexHtml(
          req.url,
          fs.readFileSync(indexPath, "utf-8"),
        );
        res.set("Content-Type", "text/html");
        res.end(indexHtml);
      } catch (e) {
        res.status(500).end((e as Error).message);
      }
    });
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
