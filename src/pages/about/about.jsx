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
            <h3>Men Akbarali — Andijon Qishloq</h3>
            <p>
              Texnologiyalar olamiga qiziqishim oddiy qiziqishdan boshlanib,
              bugungi kunda Full-Stack yo'nalishidagi mustahkam ko'nikmalarga
              aylandi. Men uchun dasturlash — shunchaki kod yozish emas, balki
              atrofimizdagi muammolarni yengillashtiradigan asbob-uskunalar va
              tizimlarni yaratishdir.
            </p>
            <p>
              Men qishloq sharoitida yashab, internet va zamonaviy
              texnologiyalar yordamida har kuni o'z ustimda ishlayman.
              Institutdagi o'qishim va kundalik hayotimni dasturlash bilan
              ajoyib tarzda muvozanatda ushlab turishga harakat qilaman.
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
                <img
                  src="/src/assets/image.png"
                  alt="ZAYLO - MONTAGEM URANIUM"
                  className="track-cover"
                />
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
