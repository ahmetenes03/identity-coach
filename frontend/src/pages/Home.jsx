import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBrain,
  FaChartLine,
  FaCheck,
  FaPlay,
  FaWandMagicSparkles,
} from "react-icons/fa6";

import "../styles/home.css";

const features = [
  {
    icon: <FaBrain />,
    tone: "violet",
    title: "Yapay zekâ destekli kişisel koçluk",
    description:
      "Ruh hâlin, davranış geçmişin ve zorlandığın anlar birlikte analiz edilerek sana uygun öneriler hazırlanır.",
  },
  {
    icon: <FaChartLine />,
    tone: "blue",
    title: "İlerlemeni anlamlı verilere dönüştür",
    description:
      "Başarı oranını, check-in geçmişini ve davranış eğilimlerini anlaşılır bir ekrandan takip et.",
  },
  {
    icon: <FaWandMagicSparkles />,
    tone: "pink",
    title: "Kimlik temelli stratejiler geliştir",
    description:
      "Sadece görev tamamlamaya değil, olmak istediğin kişiyi destekleyen sürdürülebilir sistemler kurmaya odaklan.",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Kimliğini tanımla",
    text: "Nasıl birine dönüşmek istediğini açık bir kimlik cümlesiyle belirle.",
  },
  {
    number: "02",
    title: "Alışkanlığını oluştur",
    text: "Kimliğini destekleyen günlük veya haftalık küçük davranışlar planla.",
  },
  {
    number: "03",
    title: "Günlük check-in yap",
    text: "Durumunu, ruh hâlini ve karşılaştığın engelleri birkaç dakikada kaydet.",
  },
  {
    number: "04",
    title: "Kişisel stratejini al",
    text: "AI koçunun önerdiği küçük ve uygulanabilir bir sonraki adımı gör.",
  },
];

function Home() {
  return (
    <main className="home">
      <header className="home-header">
        <nav className="home-navbar">
          <Link to="/" className="home-brand">
            <span className="home-brand-icon">
              <FaBrain />
            </span>

            <span className="home-brand-text">
              Identity <strong>Coach</strong>
            </span>
          </Link>

          <div className="home-navigation">
            <a href="#features">Özellikler</a>
            <a href="#journey">Nasıl Çalışır?</a>
            <a href="#coach-preview">AI Koçluk</a>
          </div>

          <div className="home-auth">
            <Link to="/login" className="home-login">
              Giriş Yap
            </Link>

            <Link to="/register" className="home-register">
              Ücretsiz Başla
              <FaArrowRight />
            </Link>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="hero-inner">
          <div className="hero-copy">
            <h1>
              Alışkanlıklarını takip etme.
              <span>Kimliğini inşa et.</span>
            </h1>

            <p>
              Identity Coach; davranışlarını, ruh hâlini ve zorlandığın
              anları analiz ederek olmak istediğin kişiye dönüşmen için sana
              özel stratejiler sunar.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="hero-primary">
                Dönüşümüne Başla
                <FaArrowRight />
              </Link>

              <a href="#journey" className="hero-secondary">
                <span>
                  <FaPlay />
                </span>
                Nasıl çalıştığını gör
              </a>
            </div>

            <div className="hero-proof">
              <div className="hero-proof-avatars">
                <span>A</span>
                <span>E</span>
                <span>M</span>
                <span>+</span>
              </div>

              <div>
                <div className="hero-stars">★★★★★</div>
                <small>
                  Küçük davranışlar, uzun vadede gerçek bir kimlik dönüşümü.
                </small>
              </div>
            </div>
          </div>

          <div className="identity-visual">
            <div className="identity-infographic">
              <div className="infographic-glow infographic-glow-one" />
              <div className="infographic-glow infographic-glow-two" />

              <div className="identity-orbit identity-orbit-outer" />
              <div className="identity-orbit identity-orbit-middle" />
              <div className="identity-orbit identity-orbit-inner" />

              <div className="identity-core brain-core">
                <div className="brain-glass-shell" />
                <div className="brain-glow brain-glow-one" />
                <div className="brain-glow brain-glow-two" />
                <div className="brain-reflection" />

                <div className="brain-model">
                  <FaBrain />
                </div>

                <div className="brain-pulse brain-pulse-one" />
                <div className="brain-pulse brain-pulse-two" />
                <div className="brain-pulse brain-pulse-three" />
              </div>

              <div className="orbit-track orbit-track-mood">
                <div className="infographic-node mood-node">😊</div>
              </div>

              <div className="orbit-track orbit-track-progress">
                <div className="infographic-node progress-node">
                  <FaChartLine />
                </div>
              </div>

              <div className="orbit-track orbit-track-strategy">
                <div className="infographic-node strategy-node">🎯</div>
              </div>

              <article className="info-card info-card-mood">
                <span className="info-card-icon mood-card-icon">😊</span>

                <div className="info-card-copy">
                  <small>Ruh hâli</small>
                  <strong>8.2 / 10</strong>
                  <span>Harika gidiyorsun!</span>
                </div>

                <div className="info-progress">
                  <span />
                </div>
              </article>

              <article className="info-card info-card-progress">
                <div className="info-card-top">
                  <span className="info-card-icon progress-card-icon">
                    <FaChartLine />
                  </span>

                  <div className="info-card-copy">
                    <small>Haftalık ilerleme</small>
                    <strong>+18%</strong>
                  </div>
                </div>

                <div className="info-chart" aria-hidden="true">
                  <span style={{ height: "30%" }} />
                  <span style={{ height: "43%" }} />
                  <span style={{ height: "38%" }} />
                  <span style={{ height: "61%" }} />
                  <span style={{ height: "72%" }} />
                  <span style={{ height: "85%" }} />
                  <span style={{ height: "100%" }} />
                </div>
              </article>

              <article className="info-card info-card-streak">
                <span className="info-card-icon streak-card-icon">🔥</span>

                <div className="info-card-copy">
                  <small>Mevcut seri</small>
                  <strong>12 gün</strong>
                  <span>Serini koru</span>
                </div>
              </article>

              <article className="info-card info-card-strategy">
                <div className="strategy-ready">
                  <span />
                  Strateji hazır
                </div>

                <strong>İki Dakika Kuralı</strong>
                <p>Hedefini küçült, kimliğinle kurduğun bağı koru.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-card">
          <span className="trust-emoji">🛡️</span>
          <div>
            <strong>Kimlik temelli yaklaşım</strong>
            <span>Alışkanlık değil, kimlik odaklı sistem</span>
          </div>
        </div>

        <div className="trust-card">
          <FaBrain />
          <div>
            <strong>Kişiselleştirilmiş koçluk</strong>
            <span>Her kullanıcı için farklı strateji</span>
          </div>
        </div>

        <div className="trust-card">
          <FaChartLine />
          <div>
            <strong>Ölçülebilir ilerleme</strong>
            <span>Davranışlarını görünür hâle getir</span>
          </div>
        </div>

        <div className="trust-card">
          <span className="trust-emoji">⏱️</span>
          <div>
            <strong>Günde birkaç dakika</strong>
            <span>Küçük adımlarla sürdürülebilir gelişim</span>
          </div>
        </div>
      </section>

      <section id="features" className="light-section features">
        <div className="section-heading">
          <span>DAHA AKILLI BİR ALIŞKANLIK SİSTEMİ</span>

          <h2>
            İradene değil,
            <strong> doğru stratejiye güven.</strong>
          </h2>

          <p>
            Başarısızlıklarını bir problem olarak değil, seni daha iyi
            anlamamızı sağlayan değerli bir veri olarak ele alıyoruz.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className={`feature-icon ${feature.tone}`}>
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="coach-preview" className="light-section coach-section">
        <div className="coach-showcase">
          <div className="coach-copy">
            <span className="section-label">KİŞİSEL KOÇLUK DENEYİMİ</span>

            <h2>
              Her check-in,
              <strong> seni daha iyi tanıyan bir koç oluşturur.</strong>
            </h2>

            <p>
              Sistem yalnızca “yaptım” veya “yapmadım” bilgisini tutmaz.
              Ruh hâlin, zorlandığın nedenler ve geçmiş davranışların birlikte
              değerlendirilir.
            </p>

            <ul>
              <li>
                <FaCheck />
                Ruh hâli ve davranış ilişkisi
              </li>

              <li>
                <FaCheck />
                Başarısızlık nedeni analizi
              </li>

              <li>
                <FaCheck />
                Uygulanabilir kişisel stratejiler
              </li>
            </ul>
          </div>

          <div className="coach-window">
            <div className="coach-window-header">
              <div>
                <span />
                <span />
                <span />
              </div>

              <small>Identity Coach · Günlük Analiz</small>
            </div>

            <div className="coach-profile">
              <div className="coach-avatar">
                <FaBrain />
              </div>

              <div>
                <small>Bugünkü analiz</small>
                <strong>Enerji düşüşü ve yüksek hedef tespit edildi</strong>
              </div>

              <span className="coach-live">CANLI</span>
            </div>

            <div className="coach-message">
              <span className="quote-symbol">“</span>

              <p>
                Bugünkü ruh hâlin düşük ve hedefin sana büyük gelmiş.
                Yarın 20 dakika yerine yalnızca 2 dakika başlamayı dene.
                Küçük bir tekrar bile kimliğinle kurduğun bağı korur.
              </p>
            </div>

            <div className="coach-strategy">
              <div>
                <small>Önerilen strateji</small>
                <strong>İki Dakika Kuralı</strong>
              </div>

              <span>
                <FaWandMagicSparkles />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="light-section journey-section">
        <div className="section-heading journey-heading">
          <span>DÖNÜŞÜM YOLCULUĞUN</span>

          <h2>
            Küçük davranışlardan,
            <strong> kalıcı bir kimliğe.</strong>
          </h2>

          <p>
            Karmaşık planlara ihtiyacın yok. Her gün birkaç dakikalık
            bilinçli check-in ile kendi sistemini geliştirebilirsin.
          </p>
        </div>

        <div className="journey-content">
          <div className="journey-list">
            {journeySteps.map((step) => (
              <article className="journey-item" key={step.number}>
                <span>{step.number}</span>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="dashboard-preview">
            <div className="dashboard-preview-header">
              <span className="preview-logo">
                <FaBrain />
                Identity Coach
              </span>

              <small>Bugün</small>
            </div>

            <div className="identity-card">
              <div>
                <small>Kimlik cümlen</small>
                <strong>“Ben düzenli kitap okuyan biriyim.”</strong>
              </div>

              <span>📚</span>
            </div>

            <div className="checkin-preview">
              <small>Bugünkü durum</small>
              <h3>Alışkanlığını gerçekleştirdin mi?</h3>

              <div className="checkin-buttons">
                <button type="button">✓ Yaptım</button>
                <button type="button">× Yapmadım</button>
              </div>
            </div>

            <div className="preview-stats">
              <div>
                <small>Mevcut seri</small>
                <strong>12 gün</strong>
              </div>

              <div className="progress-ring">
                <span>82%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="final-cta">
          <div className="cta-light cta-light-one" />
          <div className="cta-light cta-light-two" />

          <div className="final-cta-copy">
            <span>SONRAKİ ADIMIN HAZIR</span>

            <h2>
              Olmak istediğin kişiye
              <br />
              bugün bir adım daha yaklaş.
            </h2>

            <p>
              Kusursuz olman gerekmiyor. Sistemin seninle birlikte gelişsin
              ve her denemede sana daha uygun hâle gelsin.
            </p>

            <div className="final-cta-actions">
              <Link to="/register" className="cta-primary">
                Ücretsiz Hesap Oluştur
                <FaArrowRight />
              </Link>

              <Link to="/login" className="cta-secondary">
                Zaten hesabım var
              </Link>
            </div>
          </div>

          <div className="cta-orb">
            <div className="cta-orbit cta-orbit-one" />
            <div className="cta-orbit cta-orbit-two" />

            <div className="cta-core">
              <FaWandMagicSparkles />
            </div>

            <span className="cta-dot cta-dot-one" />
            <span className="cta-dot cta-dot-two" />
            <span className="cta-dot cta-dot-three" />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="home-brand">
              <span className="home-brand-icon">
                <FaBrain />
              </span>

              <span className="home-brand-text">
                Identity <strong>Coach</strong>
              </span>
            </Link>

            <p>
              Kimlik temelli alışkanlıklarla sürdürülebilir değişim ve
              kişiselleştirilmiş gelişim.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <strong>Ürün</strong>
              <a href="#features">Özellikler</a>
              <a href="#journey">Nasıl Çalışır?</a>
              <a href="#coach-preview">AI Koçluk</a>
            </div>

            <div>
              <strong>Hesap</strong>
              <Link to="/login">Giriş Yap</Link>
              <Link to="/register">Üye Ol</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Identity Coach. Tüm hakları saklıdır.</span>
          <span>Kimliğini her gün yeniden inşa et.</span>
        </div>
      </footer>
    </main>
  );
}

export default Home;