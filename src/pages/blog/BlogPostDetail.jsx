import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePostDetail } from "./usePosts.js"; // Serverdan ma'lumotni yuklovchi hook
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegClock, FaEye } from "react-icons/fa";
import SEO from "../../components/SEO";
import ImageZoom from "../../components/ImageZoom";

import "react-quill-new/dist/quill.bubble.css";
import "./blog.css";

function BlogPostDetail() {
  const { slug } = useParams();
  const [isZoomed, setIsZoomed] = useState(false);
  const { post, isLoading, error } = usePostDetail(slug);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // 1. Agar post hali yuklanmagan bo'lsa, funksiyani bajarishni to'xtatamiz (Xavfsiz usul)
    if (!post?._id) return;

    // 2. Agar foydalanuvchi bu postni hali KO'RMAGAN bo'lsa (shart oldiga ! qo'yildi)
    if (!document.cookie.includes(`viewed_${post._id}`)) {
      // Backendga ko'rishlar sonini oshirish uchun so'rov jo'natamiz
      fetch(`${api}/api/post/view/${post._id}`, { method: "POST" }).catch(
        (err) => console.error("Views error:", err),
      ); // Xatolikni ushlash

      // Brauzerga ushbu post ko'rilganligi haqida cookie yozamiz (24 soatga)
      document.cookie = `viewed_${post._id}=true; max-age=86400; path=/`;
    }
  }, [post?._id, api]); // Bu yerga ham post?._id o'rnatildi
  if (isLoading) {
    return (
      <div
        style={{ padding: "100px 20px", color: "#fff", textAlign: "center" }}
      >
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "15px", opacity: 0.7 }}>
          Ma'lumot yuklanmoqda... 🔄
        </p>
      </div>
    );
  }

  // 2. Xatolik yoki Maqola umuman topilmagan holat
  if (error || !post) {
    return (
      <div
        style={{ padding: "100px 20px", color: "#fff", textAlign: "center" }}
      >
        <h2 style={{ fontWeight: "400", marginBottom: "10px" }}>
          Maqola topilmadi! ❌
        </h2>
        <Link
          to="/blog"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontSize: "0.95rem",
            borderBottom: "1px dashed #007bff",
            paddingBottom: "2px",
          }}
        >
          Blog sahifasiga qaytish
        </Link>
      </div>
    );
  }

  const cleanDesc = post.matn
    ? post.matn.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").substring(0, 150) + "..."
    : "";

  return (
    <div className="blog-post">
      <SEO
        title={post.sarlavha}
        description={cleanDesc}
        image={post.rasm}
        type="article"
      />
      <button
        className="back-btn"
        onClick={() => navigate("/blog")}
        title="Blogga qaytish"
      >
        <IoArrowBackOutline />
      </button>
      <div className="blog-post-header">
        <h2>{post.sarlavha}</h2>
        <div className="post-meta">
          <p>
            <FaEye />
            {post.korildi}
          </p>

          <p className="post-date">
            <FaRegClock />
            {new Date(post.data).toLocaleDateString("uz-UZ", {})}
          </p>
        </div>
      </div>
      <div className="post-img" onClick={() => setIsZoomed(true)}>
        <img
          src={post.rasm}
          alt={post.sarlavha}
          style={{ cursor: "zoom-in" }}
        />
      </div>
      <div className="post-content ql-editor">
        <div
          dangerouslySetInnerHTML={{
            __html: post.matn ? post.matn.replace(/&nbsp;/g, " ") : "",
          }}
        />
      </div>
      <ImageZoom
        src={post.rasm}
        alt={post.sarlavha}
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
      />
    </div>
  );
}

export default BlogPostDetail;
