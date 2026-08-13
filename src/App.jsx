import AppRoutes from "./routes";
import Navbar from "./pages/navbar/navbar";
import ScrolToTop from "./components/ScrolToTop";
import GlobalPlayer from "./components/GlobalPlayer";
import VisitorTracker from "./components/VisitorTracker";
import Lenis from "lenis";
import "./App.css";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    let frameId = 0;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      if (typeof lenis.destroy === "function") {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className="App">
      <VisitorTracker />
      <ScrolToTop />
      <Navbar />
      <AppRoutes />
      <GlobalPlayer />
    </div>
  );
}

export default Home;
