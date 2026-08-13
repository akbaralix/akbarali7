import React from "react";
import SEO from "../../components/SEO";
import sound from "/src/assets/ZAYLO - MONTAGEM URANIUM (SLOWED).mp3";
import { useAudio } from "../../components/AudioContext";
import "./about.css";

function About() {
  const { playTrack, isPlaying, currentTrack, progress, handleProgressChange } =
    useAudio();

  // 1. Aynan shu trek tanlanganmi? (Pauzada bo'lsa ham true bo'ladi)
  const isThisTrack = currentTrack === sound;

  // 2. Aynan shu trek aynan hozir ijro etilayaptimi?
  const isThisPlaying = isThisTrack && isPlaying;

  const timelineData = [
    {
      year: "2024",
      title: "Dasturlashga Ilk Qadam",
      desc: "2 oylik IT kursida poydevor bilimlarni oldim va keyinchalik o'z ustimda tinimsiz, mustaqil ishlashni boshladim. Ilk sodda loyihalarimni aynan shu yili yaratdim.",
    },
    {
      year: "2025",
      title: "Full-Stack Sari Harakat",
      desc: "Faqat Frontend (vizual qism) bilan cheklanib qolmay, tizimlarning ichki arxitekturasi — Backend qanday ishlashini o'rganishga sho'ng'idim va Full-Stack Dasturchi bo'lishni tanladim.",
    },
    {
      year: "2026",
      title: "Sunoiy Intelekt Sohasiga Kirish",
      desc: "Hozirda men suniy intelekt (AI) yaratishni o'rganish uchun o'zim mustaqil harakat qilib izlanmoqdaman.",
    },
  ];

  return (
    <div className="about-container">
      <SEO
        title="Men Haqimda"
        description="Men Akbarali — Muammolarga Raqamli Yechim Topuvchi Muhandis. Mening dasturlashdagi yo'lim, prinsiplarim va erishgan yutuqlarim haqida bu yerda bilib oling."
        keywords="Tursunboyev Akbarali haqida, Akbarali, tarjimai hol, prinsiplar, tajriba"
      />
      <div className="about-hero">
        <h1 className="about-title">Men Haqimda</h1>
        <div className="about-grid">
          <div className="about-bio">
            <div className="about-bio-flx">
              <h3>Mening ismim Akbarali</h3>
              <img
                src="https://cdn2.cdnstep.com/YpBVNOUlV38UevDn3xU7/4-2.thumb128.png"
                alt=""
              />
            </div>

            <p>
              Men Andijon viloyati, Izboskan tumanida tug‘ilganman. Hozirda
              Andijon Qishloq Xo‘jaligi va Agrotexnologiyalar Institutida tahsil
              olyapman. Dasturlashga bo‘lgan qiziqishim 2024-yilda boshlangan.
              Shu vaqtdan beri dasturlashni mustaqil o‘rganib, turli loyihalar
              ustida ishlab, o‘z bilim va tajribamni bosqichma-bosqich
              rivojlantirib kelmoqdaman.
              <img
                src="https://cdn2.cdnstep.com/YpBVNOUlV38UevDn3xU7/10-2.thumb128.png"
                alt=""
              />
            </p>
            <p>
              Ko‘pchilik dasturlashni asosan pul topish yoki yaxshi ishga kirish
              uchun o‘rganadi. Menda esa bu qiziqish biroz boshqacharoq
              boshlangan. Men dasturlash orqali katta loyihalar yaratishni,
              ayniqsa O‘zbekiston foydalanuvchilari uchun foydali va qiziqarli
              mahsulot ishlab chiqishni orzu qilaman.
              <img
                src="https://cdn2.cdnstep.com/YpBVNOUlV38UevDn3xU7/39-1.thumb128.png"
                alt=""
              />
            </p>

            <p>
              Bir vaqtlar Telegram, Instagram yoki Facebook kabi katta ijtimoiy
              platforma yaratishni xohlardim. Keyinchalik esa bunday loyihani
              yaratish faqat texnologiyaning o‘zi bilan cheklanmasligini,
              foydalanuvchilar ishonchi va auditoriyasini shakllantirish ham
              juda katta mas’uliyat ekanini tushundim. Shunga qaramay, bu fikr
              meni to‘xtatmadi.
              <img
                src="	https://cdn2.cdnstep.com/YpBVNOUlV38UevDn3xU7/19-2.thumb128.png"
                alt=""
              />
            </p>
            <p>
              Hozircha aniq bir startap g‘oyam yo‘q. Lekin kelajakda o‘zimga
              tegishli, katta auditoriyaga ega va haqiqiy muammoni hal qiladigan
              loyiha yaratishni maqsad qilganman. Hozir esa buning uchun kerak
              bo‘ladigan bilim va tajribani yig‘ish bilan bandman.
              <img
                src="	https://cdn2.cdnstep.com/YpBVNOUlV38UevDn3xU7/27-2.thumb128.png"
                alt=""
              />
            </p>
          </div>

          {/* 🎵 Musiqani yoqish qismi */}
          <div className="sound-card">
            <div className="sound-header">
              <div className="sound-badge">
                <span className="pulse-dot"></span>
                PHONK MUSIC
              </div>
              <h3>Menga PHONK musiqalari yoqadi</h3>
            </div>

            <div className="sound-body">
              <div className="track-cover-wrapper">
                <button
                  className={`sound-play-btn ${isThisPlaying ? "playing" : ""}`}
                  onClick={() => playTrack(sound, "ZAYLO - MONTAGEM URANIUM")}
                  aria-label="Play / Pause"
                >
                  {isThisPlaying ? (
                    /* Pause Icon */
                    <svg
                      width="35"
                      height="35"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    /* Play Icon */
                    <svg
                      width="35"
                      height="35"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="track-details">
                <div className="track-info-header">
                  <span className="track-title">ZAYLO - MONTAGEM URANIUM</span>
                </div>

                <div className="track-progress-wrapper">
                  <input
                    type="range"
                    className="sound-progress-input"
                    min="0"
                    max="100"
                    value={isThisTrack ? progress : 0}
                    onChange={(e) => handleProgressChange(e.target.value)}
                    style={{ "--progress": `${isThisTrack ? progress : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-timeline-section">
        <h2 className="timeline-main-title">Mening Rivojlanish Yo'lim</h2>
        <div className="timeline-container">
          {timelineData.map((item, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
