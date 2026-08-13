import React from "react";
import myLogo from "../../assets/assets.png";
import {
  FaLinkedin,
  FaGithub,
  FaTelegram,
  FaInstagram,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaReact,
} from "react-icons/fa";
import { GrMysql } from "react-icons/gr";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiVite, SiMongodb } from "react-icons/si";
import SEO from "../../components/SEO";
import SpotlightCard from "../../components/SpotlightCard";
import "./home.css";

function Home() {
  const myLink = [
    {
      name: "Telegram",
      link: "https://t.me/akbaral1",
      icon: <FaTelegram className="icon-tg" />,
    },
    {
      link: "https://instagram.com/akbaral1.t7",
      icon: <FaInstagram className="icon-insta" />,
    },
    {
      link: "https://github.com/akbaral1",
      icon: <FaGithub className="icon-github" />,
    },
    {
      link: "https://linkedin.com/in/akbaralix",
      icon: <FaLinkedin className="icon-linkedin" />,
    },
  ];

  const mySkills = [
    { id: 1, name: "Python", icon: <FaPython />, color: "#3776AB" },
    { id: 2, name: "JavaScript", icon: <FaJsSquare />, color: "#F7DF1E" },
    { id: 3, name: "React", icon: <FaReact />, color: "#108aac" },
    { id: 4, name: "Vite", icon: <SiVite />, color: "#535bfc" },
    { id: 5, name: "HTML5", icon: <FaHtml5 />, color: "#f74514" },
    { id: 6, name: "CSS3", icon: <FaCss3Alt />, color: "#0f6fb4" },
  ];
  const myDatabase = [
    { id: 1, name: "MySQL", icon: <GrMysql />, color: "#00758F" },
    { id: 2, name: "PostgreSQL", icon: <BiLogoPostgresql />, color: "#336791" },
    { id: 3, name: "MongoDB", icon: <SiMongodb />, color: "#00ED64" },
  ];
  const myPrinciples = [
    {
      id: 1,
      title: "Toza va Strukturaviy Kod",
      description:
        "Kelajakda osongina kengayadigan, tushunarli va Clean Code qoidalariga mos kod yozaman.",
    },
    {
      id: 2,
      title: "Xavfsizlik va Anti-Spam",
      description:
        "Ayniqsa Telegram botlarda tizimni turli xil spam-hujumlardan va crash holatlaridan himoya qila olaman.",
    },
    {
      id: 3,
      title: "UI/UX va Tezkorlik",
      description:
        "Vite va React yordamida mobil qurilmalarda ham, kompyuterda ham soniyalarda ochiladigan interfeyslar quraman.",
    },
  ];

  return (
    <>
      <SEO
        title="Asosiy sahifa"
        keywords="Tursunboyev Akbarali, Akbarali, portfolio, dasturchi, fullstack, python, javascript, react, mongodb"
      />
      <div className="home-container">
        <div className="home-content">
          <div className="home-text">
            <h2>Salom Men Akbarali</h2>
            <p>
              Full-Stack (Frontend & Backend) dasturchiman. 2 yildan buyon
              zamonaviy veb-saytlar va murakkab tizimlarni qurish bilan
              shug'ullanaman.
            </p>

            <div className="home-social">
              {myLink.map((item, index) => (
                <div className="home-social-link" key={index}>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.icon}

                    <span className="tooltip-text">
                      {item.icon.props.className
                        .replace("icon-", "")
                        .toUpperCase()}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="home-img">
            <img src={myLogo} alt="Akbarali" />
          </div>
        </div>
      </div>
      <div className="skills-container">
        {/* Sektor Kirishi (Intro) */}
        <div className="skills-header">
          <h2>Texnologik Arsenal & Ko'nikmalar</h2>
          <p className="skills-intro-text">
            Zamonaviy Full-Stack muhandis sifatida, har bir loyiha uchun eng
            to'g'ri, tezkor va xavfsiz texnologiyalar kombinatsiyasini
            tanlayman. Mening asosiy qurollarim:
          </p>
        </div>
        <div className="skills-section-block">
          <h3 className="sub-section-title">Frontend & Backend</h3>
          <div className="skill-card-grid">
            {mySkills.map((skill) => {
              let shortDesc = "";
              if (skill.name === "Python")
                shortDesc = "Avtomatizatsiya va asinxron botlar";
              if (skill.name === "JavaScript")
                shortDesc = "Dinamik va interaktiv ssenariylar";
              if (skill.name === "React")
                shortDesc = "Single Page Applications (SPA)";
              if (skill.name === "Vite")
                shortDesc = "Tezkor build va loyiha yig'uvchi";
              if (skill.name === "HTML5")
                shortDesc = "Semantik va toza veb-struktura";
              if (skill.name === "CSS3")
                shortDesc = "Zamonaviy va moslashuvchan dizayn";

              return (
                <div className="enhanced-skill-card" key={skill.id}>
                  <div className="skill-card-header">
                    <div
                      className="skill-icon-box"
                      style={{ color: skill.color }}
                    >
                      {skill.icon}
                    </div>
                    <h4>{skill.name}</h4>
                  </div>
                  <p className="skill-short-desc">{shortDesc}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="database-section-block">
          <h3 className="sub-section-title">Ma'lumotlar Ombori (Databases)</h3>
          <div className="database-card-grid">
            {myDatabase.map((db) => {
              let dbDesc = "";
              if (db.name === "MySQL")
                dbDesc = "Relyatsion tizimlar va tezkor so'rovlar";
              if (db.name === "PostgreSQL")
                dbDesc = "Murakkab va yuqori yuklamali arxitekturalar";
              if (db.name === "MongoDB")
                dbDesc = "NoSQL moslashuvchan ma'lumotlar oqimi";

              return (
                <div className="enhanced-db-card" key={db.id}>
                  <div className="db-card-header">
                    <div className="db-icon-box" style={{ color: db.color }}>
                      {db.icon}
                    </div>
                    <h4>{db.name}</h4>
                  </div>
                  <p className="db-short-desc">{dbDesc}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="principles-block">
          <h3 className="sub-section-title">Men qanday kod yozaman?</h3>
          <div className="principles-grid">
            {myPrinciples.map((principle) => (
              <SpotlightCard>
                <div className="principle-item">
                  <div className="p-num">{principle.id}</div>
                  <h5>{principle.title}</h5>
                  <p>{principle.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
