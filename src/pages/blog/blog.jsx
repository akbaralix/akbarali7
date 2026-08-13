import { Link } from "react-router-dom";
import { usePosts } from "./usePosts";
import SEO from "../../components/SEO";
import "./blog.css";

function Blog() {
  const { posts, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <div className="blog-container">
        <SEO
          title="Blog"
          description="Tursunboyev Akbarali - Dasturlash, sun'iy intellekt va veb-texnologiyalar haqidagi shaxsiy fikrlar va maqolalar blogi."
          keywords="Tursunboyev Akbarali blogi, dasturlash maqolalari, python maqola, javascript uzbek, IT blog uzbek"
        />
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

  // if (posts) return <div>Hozircha postlar yoq</div>;
  if (error) return <div className="error-message">Xatolik yuz berdi...</div>;

  return (
    <div className="blog-container">
      <SEO
        title="Blog"
        description="Tursunboyev Akbarali - Dasturlash, sun'iy intellekt va veb-texnologiyalar haqidagi shaxsiy fikrlar va maqolalar blogi."
        keywords="Tursunboyev Akbarali blogi, dasturlash maqolalari, python maqola, javascript uzbek, IT blog uzbek"
      />
      <h2>Bu yerda men o'z haqimda yozaman</h2>
      <div className="blog-grid">
        {(posts || []).map((post) => (
          <div key={post._id}>
            <div className="post-date">
              <p>{new Date(post.data).toLocaleDateString("uz-UZ", {})}</p>
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
  );
}

export default Blog;
