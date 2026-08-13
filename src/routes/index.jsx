import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";
import About from "../pages/about/about";
import Projects from "../pages/projects/projects";
import Contact from "../pages/contact/contact";
import BlogPostDetail from "../pages/blog/BlogPostDetail";
import Admin from "../pages/Admin/admin";
import Blog from "../pages/blog/blog";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/haqimda" element={<About />} />
        <Route path="/loyihalar" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/aloqa" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="/blog/:slug" element={<BlogPostDetail />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
