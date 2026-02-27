/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminProjectEditor from "./pages/AdminProjectEditor";
import AdminPostEditor from "./pages/AdminPostEditor";
import CompanyProfile from "./pages/CompanyProfile";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Videos from "./pages/Videos";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<CompanyProfile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="videos" element={<Videos />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/editor" element={<AdminProjectEditor />} />
        <Route path="/admin/post-editor" element={<AdminPostEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

