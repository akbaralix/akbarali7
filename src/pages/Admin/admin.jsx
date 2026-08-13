import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill-new";
import { usePosts } from "../blog/usePosts";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

import "./admin.css";
import "react-quill-new/dist/quill.snow.css";

function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(
    () => sessionStorage.getItem("admin_token") || "",
  );
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const [yangiMaqola, setYangiMaqola] = useState({
    sarlavha: "",
    rasm: "",
    matn: "",
    data: "",
    sluge: "",
  });

  const { posts, isLoading, error: postsError, refetch } = usePosts();
  const api = import.meta.env.VITE_API_URL;

  // 🔄 Token haqiqiyligini tekshirish
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = sessionStorage.getItem("admin_token");
      if (!savedToken) {
        setVerifying(false);
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await fetch(`${api}/api/admin/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.ok) {
          setIsAuthorized(true);
          setToken(savedToken);
        } else {
          sessionStorage.removeItem("admin_token");
          setToken("");
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error("Token tekshirishda xatolik:", err);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [api]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  // 🔐 BACKEND GA HAVSIZ LOGIN SO'ROVI YUBORISH
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await fetch(`${api}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setIsAuthorized(true);
        setPassword("");
        setLoginError("");
      } else {
        setLoginError(data.message || "Xato parol! ❌");
      }
    } catch (err) {
      console.error("Login so'rovida xatolik:", err);
      setLoginError("Server bilan ulanishda xatolik yuz berdi! ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken("");
    setIsAuthorized(false);
  };

  // 📝 MAQOLA QO'SHISH (JWT TOKEN BILAN HAVSIZ SO'ROV)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const generateRandomSlug = () => {
      const belgilar =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let slug = "";
      for (let i = 0; i < 7; i++) {
        const randomIndeks = Math.floor(Math.random() * belgilar.length);
        slug += belgilar.charAt(randomIndeks);
      }
      return slug;
    };

    const yuboriladiganMaqola = {
      ...yangiMaqola,
      matn: yangiMaqola.matn ? yangiMaqola.matn.replace(/&nbsp;/g, " ") : "",
      data: new Date().toISOString(),
      sluge: generateRandomSlug(),
    };

    try {
      const response = await fetch(`${api}/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(yuboriladiganMaqola),
      });

      const resData = await response.json();

      if (response.ok) {
        alert("Maqola muvaffaqiyatli saqlandi! 🎉");
        setYangiMaqola({
          sarlavha: "",
          rasm: "",
          matn: "",
          data: "",
          sluge: "",
        });
        if (refetch) refetch();
      } else if (response.status === 401) {
        alert("Seans muddati tugadi! Qayta kirishingiz kerak. 🔐");
        handleLogout();
      } else {
        alert(`Xatolik yuz berdi: ${resData.message || "Xatolik"}`);
      }
    } catch (err) {
      console.error("Ulanishda xatolik:", err);
      alert("Server bilan ulanishda xatolik yuz berdi! ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ MAQOLANI O'CHIRISH (JWT TOKEN BILAN HAVSIZ SO'ROV)
  const handleDeletePost = async (id) => {
    if (!window.confirm("Rostdan ham ushbu maqolani o'chirmoqchimisiz?"))
      return;

    try {
      const response = await fetch(`${api}/api/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (response.status === 401) {
        alert("Seans muddati tugadi! Qayta kirishingiz kerak. 🔐");
        handleLogout();
        return;
      }

      if (!response.ok) {
        alert(resData.message || "O'chirishda xatolik yuz berdi.");
        return;
      }

      alert("Muvaffaqiyatli o'chirildi!");
      if (refetch) {
        refetch();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Serverga ulanishda xatolik yuz berdi ❌");
    }
  };

  if (verifying) {
    return (
      <div className="admin-login-wrapper">
        <p style={{ textAlign: "center", color: "#fff" }}>
          Avtorizatsiya tekshirilmoqda... ⏳
        </p>
      </div>
    );
  }

  // 1. Avtorizatsiyadan o'tmagan bo'lsa Login shakli
  if (!isAuthorized) {
    return (
      <div className="admin-login-wrapper">
        <div className="ad-sticker">
          <img
            src="https://cdn2.cdnstep.com/c3GC7J6TTfnVDjyJufA4/26.thumb128.webp"
            alt=""
          />
        </div>
        <form onSubmit={handleLoginSubmit} className="admin-login">
          <h3>Admin panelga kirish 🔐</h3>
          <div className="form-group">
            <input
              type="password"
              placeholder="Parolni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {loginError && <p className="error-message">{loginError}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
          </button>
        </form>
      </div>
    );
  }

  // 2. Postlar yuklanayotgan bo'lsa Skeleton
  if (isLoading) {
    return (
      <div className="blog-container">
        <div
          className="skeleton skeleton-title"
          style={{ marginBottom: "20px", width: "150px", height: "32px" }}
        ></div>
        <div className="blog-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card-wrapper">
              <div
                className="skeleton skeleton-text"
                style={{ width: "80px", height: "16px", marginBottom: "10px" }}
              ></div>
              <div className="blog-card skeleton-card">
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "90%", height: "28px", marginBottom: "20px" }}
                ></div>
                <div className="skeleton skeleton-img"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Postlarni yuklashda xatolik bo'lsa
  if (postsError) {
    return (
      <div className="error-message">
        Postlarni yuklashda xatolik yuz berdi...
      </div>
    );
  }

  // 4. Asosiy Admin Interfeysi
  return (
    <div className="admin">
      <div
        className="admin-header-actions"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ff4a4a",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          <FiLogOut /> Chiqish
        </button>
      </div>
      <div className="admin-container">
        <h3>Yangi maqola yozish</h3>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Maqola sarlavhasi</label>
            <input
              type="text"
              required
              placeholder="Maqola uchun sarlavha"
              value={yangiMaqola.sarlavha}
              onChange={(e) =>
                setYangiMaqola({ ...yangiMaqola, sarlavha: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Maqola uchun rasm URL-manzili</label>
            <input
              type="text"
              required
              placeholder="https://example.com/image.jpg"
              value={yangiMaqola.rasm}
              onChange={(e) =>
                setYangiMaqola({ ...yangiMaqola, rasm: e.target.value })
              }
            />
          </div>

          <div className="form-group editor-group">
            <label>Maqola matni</label>
            <ReactQuill
              theme="snow"
              modules={modules}
              value={yangiMaqola.matn}
              onChange={(content) =>
                setYangiMaqola({ ...yangiMaqola, matn: content })
              }
              placeholder="Maqola matnini formatlab yozing..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Yuborilmoqda..." : "Maqola tayyor"}
          </button>
        </form>
      </div>

      <div className="blog-container">
        <h2 style={{ marginBottom: "20px" }}>Mavjud bloglar</h2>
        <div className="blog-grid">
          {posts &&
            posts.map((post) => (
              <div key={post._id || post.id}>
                <div className="admin-post-date">
                  <p>{new Date(post.data).toLocaleDateString("uz-UZ")}</p>
                  <button onClick={() => handleDeletePost(post._id)}>
                    <FaRegTrashCan />
                  </button>
                </div>
                <div className="blog-card">
                  <Link to={`/blog/${post.sluge}`}>
                    <div>
                      <h2>{post.sarlavha}</h2>
                    </div>
                    <div className="blog-img">
                      <img src={post.rasm} alt={post.sarlavha} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
