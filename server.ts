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
    INSERT INTO projects (title, area, cost, style, category, description, thumbnail, gallery)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertProject.run("Biệt thự Thảo Điền", 450, "15 tỷ", "Modern Luxury", "Biệt thự", "Biệt thự ven sông với thiết kế mở, tối đa hóa ánh sáng tự nhiên và không gian xanh.", "https://loremflickr.com/800/1000/architecture?lock=1", "[]");
  insertProject.run("Nhà phố Minimalist", 120, "3.5 tỷ", "Minimalism", "Nhà phố", "Tối ưu hóa không gian sống đô thị với phong cách tối giản, tinh tế.", "https://loremflickr.com/800/1000/architecture?lock=2", "[]");
  insertProject.run("Penthouse Landmark", 250, "8 tỷ", "Contemporary", "Nội thất", "Thiết kế nội thất đẳng cấp cho căn hộ Penthouse với tầm nhìn panorama.", "https://loremflickr.com/800/1000/interior?lock=3", "[]");
  insertProject.run("Villa Đà Lạt", 600, "20 tỷ", "Indochine", "Nhà vườn", "Sự kết hợp hoàn hảo giữa kiến trúc Đông Dương và thiên nhiên thơ mộng.", "https://loremflickr.com/800/1000/architecture?lock=4", "[]");
  insertProject.run("Townhouse Quận 7", 150, "4 tỷ", "Japandi", "Nhà phố", "Sự giao thoa giữa phong cách Nhật Bản và Bắc Âu, mang lại cảm giác bình yên.", "https://loremflickr.com/800/1000/architecture?lock=5", "[]");
  insertProject.run("Căn hộ Duplex", 180, "5 tỷ", "Modern Classic", "Nội thất", "Vẻ đẹp vượt thời gian với những đường nét cổ điển được làm mới.", "https://loremflickr.com/800/1000/interior?lock=6", "[]");
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
