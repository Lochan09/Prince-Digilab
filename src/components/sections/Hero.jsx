import HeroSlider from '../ui/HeroSlider';
import { HERO_BG, HERO_STATS } from '../../data/constants';

export default function Hero({ onGoToSection }) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        {HERO_BG.map((src, i) => <img key={i} src={src} alt="" />)}
      </div>
      <div className="hero-overlay" />
      <div className="hero-logo-watermark">
        <img src="/images/1778236747583_Logo.jpg" alt="" />
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">Mysuru's Premier Photo Lab — Since 2015</div>
        <h1 className="hero-title">
          New Prince Digilab <em>Mysore</em>
        </h1>
        <p className="hero-desc">
          Premium photo printing, wedding albums, LED combo boxes and suitcase
          packages — proudly serving Mysuru &amp; Karnataka for over 15 years.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="#catalog" onClick={() => onGoToSection('#catalog')}>
            Browse Catalog
          </a>
          <a className="btn-outline" href="#order" onClick={() => onGoToSection('#order')}>
            Place an Order
          </a>
          <a className="btn-wa" href="https://wa.me/918214264066" target="_blank" rel="noopener noreferrer">
            Have Questions? Chat on WhatsApp
          </a>
        </div>
        <div className="hero-stats">
          {HERO_STATS.map(s => (
            <div key={s.num}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <HeroSlider />
    </section>
  );
}
