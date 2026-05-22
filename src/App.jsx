import React, { useCallback, useEffect, useRef, useState } from 'react';

// ── DATA ──────────────────────────────────────────────────────────────────────

const CATALOG = {
  npl: [
    ['/images/01__3_.jpg',  'NPL Pads – Designs P-01 to P-12'],
    ['/images/01__4_.jpg',  'NPL Pads – Designs P-13 to P-24'],
    ['/images/01__5_.jpg',  'NPL Pads – Designs P-25 to P-36'],
    ['/images/01__6_.jpg',  'NPL Pads – Designs P-37 to P-48'],
    ['/images/01__7_.jpg',  'NPL Pads – Designs P-49 to P-60'],
    ['/images/01__8_.jpg',  'NPL Pads – Designs P-61 to P-72'],
  ],
  luxury: [
    ['/images/01__10_.jpg', 'Luxury Combo – Sets 04, 05 & 06'],
    ['/images/01__11_.jpg', 'Luxury Combo – Sets 07, 08 & 09'],
  ],
  led: [
    ['/images/01__12_.jpg', 'LED Box – LED-01 & LED-02'],
    ['/images/01__13_.jpg', 'LED Box – LED-03, LED-04 & LED-05'],
  ],
  combo: [
    ['/images/01__14_.jpg',  'Special Combo Packages – CP-01 to CP-05'],
    ['/images/01__14_a.jpg', 'Special Combo – CP-01 & CP-02 (with sizes)'],
    ['/images/01__14_b.jpg', 'Special Combo – CP-04, CP-05 & CP-06'],
    ['/images/01__14_c.jpg', 'Special Combo – CP-07 & CP-08'],
    ['/images/01__15_.jpg',  'Special Combo – CP-06, CP-07 & CP-08'],
  ],
  suitcase: [
    ['/images/01__16_.jpg', 'Suitcase Packages – SP-01 to SP-12'],
    ['/images/01__17_.jpg', 'Suitcase SP-13 to SP-15 & Box with Pad'],
  ],
  threefold: [
    ['/images/01__18_.jpg', 'Three Fold Pads & Pendrive Boxes'],
  ],
  minibooks: [
    ['/images/mini-books.png', 'Mini Books – Rexin Cover Finish (9" × 6")'],
  ],
};

const CATALOG_TABS = [
  { id: 'npl',       label: 'NPL Pad Albums' },
  { id: 'luxury',    label: 'Luxury Combos' },
  { id: 'led',       label: 'LED Boxes' },
  { id: 'combo',     label: 'Special Combos', badge: true },
  { id: 'suitcase',  label: 'Suitcase Packages' },
  { id: 'threefold', label: 'Three Fold & Pendrive' },
  { id: 'minibooks', label: 'Mini Books', badge: true },
];

const HERO_SLIDES = Array.from({ length: 15 }, (_, i) => `/images/hero-slide-${i + 1}.jpg`);

const HERO_BG = [
  '/images/01__3_.jpg', '/images/01__7_.jpg', '/images/01__10_.jpg',
  '/images/01__12_.jpg', '/images/01__16_.jpg', '/images/01__18_.jpg',
];

const TICKER_WORDS = [
  'NPL Pad Albums', 'Luxury Combos', 'LED Video Boxes', 'Suitcase Packages',
  'Special Combo Sets', 'Pendrive Boxes', 'Three Fold Pads', 'Box with Pad',
  'Wedding Albums', 'Custom Photo Products',
];

const REVIEWS = [
  { name: 'Bharathi Bharathi',    text: 'Very beautiful product in Karnataka. Unique albums and premium quality products. Thank you New Prince Digilab!', stars: 5, color: '#7C3AED' },
  { name: 'Khali Official',       text: 'Good response, good quality printing available and excellent customer support.', stars: 5, color: '#A855F7' },
  { name: 'Arun Arts',            text: 'Good response, quality printing available. Very professional service.', stars: 5, color: '#5B21B6' },
  { name: 'Gire Gire',            text: 'Very beautiful product in Karnataka. Thumba unique album matte spl pad. Thank you for new prince!', stars: 5, color: '#9333EA' },
  { name: 'Veenanm Veena',        text: 'Good service. Very satisfied with the products and quick delivery.', stars: 5, color: '#7C3AED' },
  { name: 'Ranganath jadugar',    text: 'Very nice album making here. Best quality products in Mysuru!', stars: 5, color: '#6D28D9' },
  { name: 'Divya Chandrakanth',   text: 'They provide best quality as well as respond politely. Had very good experience with the lab.', stars: 5, color: '#A855F7' },
  { name: 'Manoj kumar N',        text: 'Superb Quality and worth every penny! Must visit this store and try trending albums in 4K quality and 7 colour too!', stars: 5, color: '#7C3AED' },
  { name: 'Manjula J',            text: "It's very good quality, superb owners, very trustworthy. Quality is fabulous. Thank you New Prince Digital Lab!", stars: 5, color: '#5B21B6' },
  { name: 'manu nayak',           text: 'The service is exceptional comparatively from other labs! Highly recommended.', stars: 5, color: '#9333EA' },
  { name: 'nagendra aradhya',     text: 'Good Service, all new album designs available. Great experience!', stars: 5, color: '#7C3AED' },
  { name: 'Vasanth',              text: 'Good quality albums and excellent printing. Satisfied customer.', stars: 5, color: '#A855F7' },
  { name: 'Pavan Pavankumar',     text: 'Very good service and quality. Would definitely recommend to everyone.', stars: 5, color: '#6D28D9' },
];

const SERVICES = [
  { icon: '📖', title: 'Photo Albums & Pads',    desc: 'Premium NPL pad albums for weddings, receptions and engagements with 72+ unique designs.' },
  { icon: '🎁', title: 'Luxury Combo Packages',  desc: 'Designer boxes with wood finish, gold hardware and premium leather options.' },
  { icon: '💡', title: 'LED Video Boxes',         desc: 'Built-in screen boxes for stunning video presentations at your events.' },
  { icon: '🧳', title: 'Suitcase Packages',       desc: 'Briefcase-style carriers with custom photo cutouts and premium finishes.' },
  { icon: '📦', title: 'Special Combo Sets',      desc: 'Album, diary, calendar, pendrive and frame sets — all in one gift-ready package.' },
  { icon: '🖼️', title: 'Pendrive & Frame Boxes',  desc: 'Gift-ready digital and printed memory packaging, beautifully crafted.' },
];

const HERO_STATS = [
  { num: '72+',   label: 'Album Designs' },
  { num: '1000+', label: 'Happy Clients' },
  { num: '10+',   label: 'Years Experience' },
  { num: '100%',  label: 'Custom Made' },
];

const FAQ_ITEMS = [
  { q: 'What products do you offer?', a: 'We offer NPL Pad Albums, Luxury Combo Packages, LED Video Boxes, Suitcase Packages, Special Combo Sets, Three Fold Pads, Pendrive Boxes and Box with Pad products.' },
  { q: 'How do I place an order?', a: 'You can visit our studio in Mysuru or fill out the order form on this page. We will contact you to confirm the design and deliver on time.' },
  { q: 'Can I customise the design code?', a: 'Yes! You can choose any design code from our catalog (P-01 to P-72 for NPL Pads, LED-01 to LED-05, CP-01 to CP-08 for combos, and more).' },
  { q: 'How long does delivery take?', a: 'Typical turnaround is 5–10 working days depending on the product and customisation. Urgent orders can be discussed directly with our team.' },
  { q: 'Can I share photos via Google Drive?', a: 'Yes, paste your shared Google Drive link in the order form and we will download your photos for processing.' },
];

const EMPTY_FORM = {
  name: '', phone: '', email: '', productCategory: '',
  albumSize: '', occasion: '', designCode: '', customText: '', notes: '', driveUrl: '',
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function StarsSVG({ n }) {
  return <span className="rev-stars">{'★'.repeat(n)}</span>;
}

function GoogleLogoSVG() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function WhatsAppSVG() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function InstagramSVG() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

// ── HERO SLIDER ───────────────────────────────────────────────────────────────

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progRef = useRef(null);
  const pausedRef = useRef(false);
  const total = HERO_SLIDES.length;

  const goTo = useCallback((n) => {
    setCurrent(((n % total) + total) % total);
    setProgress(0);
    setTimeout(() => setProgress(100), 30);
  }, [total]);

  useEffect(() => {
    setProgress(0);
    setTimeout(() => setProgress(100), 30);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) goTo(current + 1);
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  return (
    <div
      className="hero-slider-wrap"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="hero-slider">
        {HERO_SLIDES.map((src, i) => (
          <div key={i} className={`slide${i === current ? ' active' : ''}`}>
            <img src={src} alt={`Album design ${i + 1}`} loading="lazy" />
          </div>
        ))}
        <div className="slide-badge">New Arrivals</div>
        <div
          className="slider-progress"
          style={{ width: `${progress}%`, transition: progress === 0 ? 'none' : 'width 3s linear' }}
        />
      </div>
      <div className="slider-dots">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider-dot${i === current ? ' active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── REVIEW TICKER ─────────────────────────────────────────────────────────────

function ReviewCard({ r }) {
  return (
    <div className="rev-card">
      <StarsSVG n={r.stars} />
      <div className="rev-text">"{r.text}"</div>
      <div className="rev-author">
        <div className="rev-avatar" style={{ background: r.color }}>{initials(r.name)}</div>
        <div>
          <div className="rev-name">{r.name}</div>
          <div className="rev-badge"><GoogleLogoSVG />Google Review</div>
        </div>
      </div>
    </div>
  );
}

function ReviewsTicker() {
  const half = Math.ceil(REVIEWS.length / 2);
  const row1 = REVIEWS.slice(0, half);
  const row2 = REVIEWS.slice(half);
  return (
    <div className="reviews-ticker-wrap">
      <div className="reviews-ticker-row row-1">
        {[...row1, ...row1].map((r, i) => <ReviewCard key={i} r={r} />)}
      </div>
      <div className="reviews-ticker-row row-2">
        {[...row2, ...row2].map((r, i) => <ReviewCard key={i} r={r} />)}
      </div>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className={`faq-q${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
        {q}
        <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`faq-a${open ? ' open' : ''}`}>{a}</div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab]     = useState('npl');
  const [navOpen, setNavOpen]         = useState(false);
  const [moreOpen, setMoreOpen]       = useState(false);
  const [activePage, setActivePage]   = useState(null); // 'about' | 'achievements' | null
  const [lb, setLb]                   = useState(null); // { cat, idx }
  const [form, setForm]               = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [driveStatus, setDriveStatus] = useState(''); // '' | 'ok' | 'warn'

  // close more-dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (!e.target.closest('.nav-more-wrap')) setMoreOpen(false);
    }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // keyboard nav for lightbox
  useEffect(() => {
    function handler(e) {
      if (!lb) return;
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowRight') lbNav(1);
      if (e.key === 'ArrowLeft')  lbNav(-1);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  function lbNav(d) {
    if (!lb) return;
    const items = CATALOG[lb.cat];
    setLb({ cat: lb.cat, idx: ((lb.idx + d) + items.length) % items.length });
  }

  function field(name) {
    return e => setForm(f => ({ ...f, [name]: e.target.value }));
  }

  function checkDrive(val) {
    const v = val.trim();
    if (v.includes('drive.google.com')) setDriveStatus('ok');
    else if (v.length > 10)            setDriveStatus('warn');
    else                                setDriveStatus('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit order.');
      setForm(EMPTY_FORM);
      setDriveStatus('');
      setSuccessOpen(true);
    } catch (err) {
      alert('Error: ' + err.message + '\nPlease call us directly: 0821-4264066');
    } finally {
      setSubmitting(false);
    }
  }

  function navTo(page) {
    setActivePage(page);
    setNavOpen(false);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function navToMain(hash) {
    setActivePage(null);
    setNavOpen(false);
    setMoreOpen(false);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="app-shell">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav>
        <a href="#home" className="logo-wrap" onClick={() => navToMain('#home')}>
          <img className="logo-img" src="/images/1778236747583_Logo.jpg" alt="New Prince Digilab logo" />
          <div>
            <span className="logo-text">New Prince <span>Digilab</span></span>
            <span className="logo-sub">Mysuru • Premium Photo Lab</span>
          </div>
        </a>

        <ul className={`nav-links${navOpen ? ' open' : ''}`} id="navLinks">
          <li><a href="#home"    onClick={() => navToMain('#home')}>Home</a></li>
          <li><a href="#catalog" onClick={() => navToMain('#catalog')}>Catalog</a></li>
          <li><a href="#services" onClick={() => navToMain('#services')}>Services</a></li>
          <li className="nav-more-wrap">
            <button
              className="nav-more-btn"
              aria-expanded={moreOpen}
              onClick={e => { e.stopPropagation(); setMoreOpen(o => !o); }}
            >
              More
              <svg className="more-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <ul id="moreDropdown" className={`nav-more-dropdown${moreOpen ? ' open' : ''}`}>
              <li><a href="#about"        onClick={() => navTo('about')}>About Us</a></li>
              <li><a href="#achievements" onClick={() => navTo('achievements')}>Achievements</a></li>
              <li><a href="#faq"          onClick={() => navTo('faq')}>FAQ</a></li>
            </ul>
          </li>
          <li><a href="#contact" onClick={() => navToMain('#contact')}>Contact</a></li>
        </ul>

        <a className="nav-btn" href="#order" onClick={() => navToMain('#order')}>Order Now</a>

        <button
          className={`hamburger${navOpen ? ' active' : ''}`}
          id="hamburger"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>



      {/* ── SPA PAGES ────────────────────────────────────────── */}
      {activePage === 'about' && (
        <div className="spa-page active" id="page-about">
          <div style={{ paddingTop: '8rem', paddingBottom: '5rem', padding: '8rem 3rem 5rem' }}>
            <div className="sec-label">Our Story</div>
            <h1 className="sec-title">About <em>New Prince Digilab</em></h1>
            <p className="sec-sub" style={{ maxWidth: '70ch', marginBottom: '2rem' }}>
              New Prince Digilab has been Mysuru's most trusted photo lab for over a decade. We specialise in crafting
              premium photo albums, luxury combo packages, LED video boxes, and personalised memory keepsakes for
              weddings, receptions, and all celebrations.
            </p>
            <p className="sec-sub" style={{ maxWidth: '70ch', marginBottom: '2rem' }}>
              Our skilled artisans combine the finest rexin, leather, and wood materials with cutting-edge 4K printing
              to deliver products that truly preserve your most cherished moments. Every album is made with passion,
              precision, and pride.
            </p>
            <div className="why-grid" style={{ marginTop: '2.5rem' }}>
              {HERO_STATS.map(s => (
                <div key={s.num} className="why-card">
                  <div className="why-num">{s.num}</div>
                  <div className="why-label">{s.label}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: '2.5rem', border: 'none', cursor: 'pointer' }}
              onClick={() => navToMain('#contact')}>
              Visit Our Studio
            </button>
          </div>
        </div>
      )}

      {activePage === 'achievements' && (
        <div className="spa-page active" id="page-achievements">
          <div style={{ padding: '8rem 3rem 5rem' }}>
            <div className="sec-label">Milestones</div>
            <h1 className="sec-title">Our <em>Achievements</em></h1>
            <p className="sec-sub" style={{ maxWidth: '64ch', marginBottom: '2.5rem' }}>
              Over the years, New Prince Digilab has built a reputation for excellence in photo printing and album
              craftsmanship across Karnataka.
            </p>
            <div className="services-grid" style={{ marginTop: '2rem' }}>
              {[
                { icon: '🏆', title: '1000+ Happy Clients', desc: 'Trusted by families across Mysuru and Karnataka for their most precious memories.' },
                { icon: '⭐', title: '5-Star Google Rating', desc: 'Consistently rated 5 stars by our clients on Google for quality and service.' },
                { icon: '📐', title: '72+ Unique Designs', desc: 'Our NPL Pad Album catalog features over 72 exclusive designs crafted in-house.' },
                { icon: '🎖️', title: '10+ Years of Excellence', desc: 'A decade of delivering premium photo products with zero compromise on quality.' },
                { icon: '🌟', title: 'Featured Lab in Mysuru', desc: 'Recognised as one of the top photo labs in Mysuru by local photographers and studios.' },
                { icon: '🔬', title: '4K Printing Technology', desc: 'State-of-the-art 4K quality printing with 7-colour ink systems for vibrant outputs.' },
              ].map(a => (
                <div key={a.title} className="service-card">
                  <div className="svc-icon">{a.icon}</div>
                  <div className="svc-name">{a.title}</div>
                  <p className="svc-desc">{a.desc}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: '2.5rem', border: 'none', cursor: 'pointer' }}
              onClick={() => navToMain(null)}>
              ← Back to Home
            </button>
          </div>
        </div>
      )}

      {activePage === 'faq' && (
        <div className="spa-page active" id="page-faq">
          <div style={{ padding: '8rem 3rem 5rem' }}>
            <div className="sec-label">FAQs</div>
            <h1 className="sec-title">Frequently Asked <em>Questions</em></h1>
            <p className="sec-sub" style={{ maxWidth: '64ch', marginBottom: '2.5rem' }}>
              Everything you need to know before placing your order with New Prince Digilab.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '800px' }}>
              {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
            </div>
            <button className="btn-primary" style={{ marginTop: '2.5rem', border: 'none', cursor: 'pointer' }}
              onClick={() => navToMain(null)}>
              ← Back to Home
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      {!activePage && (
        <main id="main-content">

          {/* HERO */}
          <section className="hero" id="home">
            <div className="hero-bg" id="hero-bg">
              {HERO_BG.map((src, i) => <img key={i} src={src} alt="" />)}
            </div>
            <div className="hero-overlay" />
            <div className="hero-logo-watermark">
              <img src="/images/1778236747583_Logo.jpg" alt="" />
            </div>

            <div className="hero-content">
              <div className="hero-eyebrow">Mysuru's Premier Photo Lab</div>
              <h1 className="hero-title">Memories Crafted in <em>Timeless</em> Style</h1>
              <p className="hero-desc">
                We create bespoke photo albums, suitcase packages, LED combo boxes and digital keepsakes
                for weddings and celebrations.
              </p>
              <div className="hero-actions">
                <a className="btn-primary" href="#catalog" onClick={() => navToMain('#catalog')}>Browse Catalog</a>
                <a className="btn-outline" href="#order"   onClick={() => navToMain('#order')}>Place an Order</a>
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

          {/* TICKER */}
          <section className="ticker" aria-label="Featured products">
            <div className="ticker-track" id="ticker-track">
              {[...TICKER_WORDS, ...TICKER_WORDS].map((w, i) => (
                <span key={i} className="ticker-item">
                  <span className="ticker-dot">✦</span>{w}
                </span>
              ))}
            </div>
          </section>

          {/* CATALOG */}
          <section className="pad catalog-section" id="catalog">
            <div className="sec-label">Product Catalog</div>
            <h2 className="sec-title">Our <em>Collections</em></h2>
            <p className="sec-sub">Browse our handcrafted range of premium rexin, leather and wood products.</p>

            <div className="catalog-tabs">
              {CATALOG_TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {tab.badge && <span className="tab-new-badge">New</span>}
                </button>
              ))}
            </div>

            <div className="sheet-grid">
              {(CATALOG[activeTab] || []).map(([src, label], idx) => (
                <div
                  key={label}
                  className="sheet-card"
                  onClick={() => src ? setLb({ cat: activeTab, idx }) : undefined}
                  style={!src ? { cursor: 'default' } : {}}
                >
                  {src
                    ? <img src={src} alt={label} loading="lazy" />
                    : (
                      <div style={{
                        minHeight: '200px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                        background: 'linear-gradient(135deg,var(--purple-dark),var(--purple-light))',
                        color: '#fff', padding: '2rem',
                      }}>
                        <span style={{ fontSize: '2.5rem' }}>📚</span>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}>{label}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.8, fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Photos coming soon</span>
                      </div>
                    )
                  }
                  <div className="sheet-label">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* WHY */}
          <section className="pad why-section">
            <div className="sec-label">Why Choose Us</div>
            <h2 className="sec-title">Craftsmanship You Can <em>Feel</em></h2>
            <div className="why-grid">
              <div className="why-card"><div className="why-num">72+</div><div className="why-label">Unique NPL Pad Designs</div></div>
              <div className="why-card"><div className="why-num">12+</div><div className="why-label">Luxury Combo Options</div></div>
              <div className="why-card"><div className="why-num">5</div><div className="why-label">LED Box Collections</div></div>
              <div className="why-card"><div className="why-num">15+</div><div className="why-label">Suitcase Package Styles</div></div>
              <div className="why-card"><div className="why-num">100%</div><div className="why-label">Custom Personalization</div></div>
            </div>
          </section>

          {/* SERVICES */}
          <section className="pad services-section" id="services">
            <div className="sec-label">What We Offer</div>
            <h2 className="sec-title">Our <em>Services</em></h2>
            <div className="services-grid">
              {SERVICES.map(s => (
                <div key={s.title} className="service-card">
                  <div className="svc-icon">{s.icon}</div>
                  <div className="svc-name">{s.title}</div>
                  <p className="svc-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HAPPY CUSTOMERS */}
          <section className="customers-section">
            <div className="customers-header">
              <div className="sec-label">Customer Love</div>
              <div className="rating-badge">
                <span>★ 5.0</span>
                <small>Google Rating</small>
              </div>
              <h2>What Our <em>Happy Customers</em> Say</h2>
              <p>Real reviews from real clients who trusted us with their most precious memories.</p>
            </div>
            <ReviewsTicker />
          </section>

          {/* REVIEW STRIP */}
          <section className="review-strip">
            <div className="review-strip-inner">
              <div className="review-stars">★★★★★</div>
              <div className="review-heading">Love Our Work? <em>Leave a Review</em></div>
              <div className="review-sub">Your feedback helps other families discover us</div>
              <a
                className="review-btn"
                href="https://www.google.com/maps/search/New+Prince+Digilab+Mysuru"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GoogleLogoSVG />
                Write a Google Review
              </a>
              <div className="review-note">Takes less than 60 seconds — every review means the world to us</div>
            </div>
          </section>

          {/* ORDER */}
          <section className="order-section" id="order">
            <div className="order-left">
              <div className="sec-label">Book Your Order</div>
              <h2 className="sec-title">Preserve Your <em>Moments</em></h2>
              <p className="sec-sub">Visit us in Mysuru or fill the form and we'll help you pick the perfect design.</p>
              <div className="order-features">
                {[
                  'Over 72 exclusive NPL pad album designs',
                  'Luxury wood, gold hardware & leather finishes',
                  'LED & suitcase combo packages available',
                  'Custom text, names and dates embossed',
                  'Quick turnaround — 5 to 10 working days',
                  'Share photos via Google Drive link',
                ].map(f => <div key={f} className="order-feat">{f}</div>)}
              </div>
            </div>

            <div className="order-right">
              <div className="form-title">Place an Order</div>
              <div className="form-sub">We'll contact you shortly to confirm</div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input value={form.name} onChange={field('name')} type="text" placeholder="Prince" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input value={form.phone} onChange={field('phone')} type="tel" placeholder="9876543210" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Email Address *</label>
                  <input value={form.email} onChange={field('email')} type="email" placeholder="yourname@gmail.com" required />
                </div>

                <div className="form-group">
                  <label>Product Category *</label>
                  <select value={form.productCategory} onChange={field('productCategory')} required>
                    <option value="">— Select Category —</option>
                    <option>NPL Pad Album</option>
                    <option>Luxury Combo Package</option>
                    <option>LED Video Box</option>
                    <option>Special Combo Package</option>
                    <option>Suitcase Package</option>
                    <option>Three Fold Pad</option>
                    <option>Pendrive Box</option>
                    <option>Box with Pad</option>
                    <option>Other / Custom</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Design Code</label>
                    <input value={form.designCode} onChange={field('designCode')} type="text" placeholder="P-07" />
                  </div>
                  <div className="form-group">
                    <label>Album Size</label>
                    <select value={form.albumSize} onChange={field('albumSize')}>
                      <option value="">Select Size</option>
                      {['6 X 9','8 X 24','9 X 24','12 X 18','10 X 26','12 X 24','12 X 30','12 X 32','12 X 36','15 X 24','16 X 24','18 X 24'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Occasion</label>
                  <select value={form.occasion} onChange={field('occasion')}>
                    <option value="">Select Occasion</option>
                    {['Wedding','Reception','Engagement','Birthday','Baby Shower / Naming','Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Names / Custom Text</label>
                  <input value={form.customText} onChange={field('customText')} type="text" placeholder="Adam & Eve — 14 Feb 2025" />
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea value={form.notes} onChange={field('notes')} placeholder="Specific requests, finishes, delivery info..." />
                </div>

                <div className="form-group">
                  <div className="upload-section-label">
                    Photos <span>(optional — share via Google Drive)</span>
                  </div>
                  <button
                    type="button"
                    className="drive-btn"
                    onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}
                  >
                    <svg className="drive-btn-icon" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                    </svg>
                    <div className="drive-btn-text">
                      <span className="drive-btn-title">Upload via Google Drive</span>
                      <span className="drive-btn-sub">Share your photo folder link below</span>
                    </div>
                    <span className="drive-btn-arrow">→</span>
                  </button>

                  <div className="drive-link-wrap">
                    <label>Google Drive Link</label>
                    <div className="drive-link-input-row">
                      <input
                        id="driveUrl"
                        value={form.driveUrl}
                        onChange={e => { field('driveUrl')(e); checkDrive(e.target.value); }}
                        type="url"
                        placeholder="Paste your shared Drive link here"
                      />
                    </div>
                    {driveStatus === 'ok' && (
                      <div className="drive-validated show ok">✅ Google Drive link detected — we'll be able to view your photos!</div>
                    )}
                    {driveStatus === 'warn' && (
                      <div className="drive-validated show warn">⚠️ This doesn't look like a Google Drive link. Please double-check.</div>
                    )}
                  </div>
                </div>

                <button className="form-submit" type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Submit Order Request'}
                </button>
              </form>
            </div>
          </section>

          {/* CONTACT */}
          <section className="pad contact-section" id="contact">
            <div className="sec-label">Contact</div>
            <h2 className="sec-title">Visit Our <em>Studio</em></h2>
            <div className="contact-grid">
              <div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <div className="contact-label">Address</div>
                    <div className="contact-val">New Prince Digilab, Mysuru, Karnataka — 570 001</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-val">0821-4264066</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-val">4kdigitalpress@gmail.com</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🕐</div>
                  <div>
                    <div className="contact-label">Working Hours</div>
                    <div className="contact-val">Mon – Sat: 9:00 AM – 8:00 PM</div>
                  </div>
                </div>

                <div className="social-links">
                  <a className="social-link whatsapp" href="https://wa.me/918214264066" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                    <WhatsAppSVG />
                  </a>
                  <a className="social-link instagram" href="https://instagram.com/newprincedigilab" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <InstagramSVG />
                  </a>
                  <a className="social-link email" href="mailto:4kdigitalpress@gmail.com" title="Email">
                    <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </a>
                </div>
              </div>

              <div className="contact-map">
                <iframe
                  title="New Prince Digilab location"
                  src="https://www.google.com/maps?q=New+Prince+Digilab+Mysuru+Karnataka&output=embed"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer>
            <div className="footer-logo">New Prince <span>Digilab</span></div>
            <div className="footer-copy">© {new Date().getFullYear()} New Prince Digilab, Mysuru. All rights reserved.</div>
            <div className="footer-tag">Premium Photo Lab · Mysuru · Karnataka</div>
          </footer>

        </main>
      )}

      {/* ── LIGHTBOX ──────────────────────────────────────────── */}
      <div
        className={`lightbox${lb ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setLb(null); }}
      >
        {lb && CATALOG[lb.cat][lb.idx][0] && (
          <>
            <img className="lb-img" src={CATALOG[lb.cat][lb.idx][0]} alt={CATALOG[lb.cat][lb.idx][1]} />
            <button className="lb-close" onClick={() => setLb(null)}>✕</button>
            <button className="lb-prev"  onClick={() => lbNav(-1)}>‹</button>
            <button className="lb-next"  onClick={() => lbNav(1)}>›</button>
          </>
        )}
      </div>

      {/* ── SUCCESS MODAL ─────────────────────────────────────── */}
      <div className={`modal${successOpen ? ' open' : ''}`}>
        <div className="modal-box">
          <div className="modal-icon">🎉</div>
          <div className="modal-title">Order Received!</div>
          <div className="modal-msg">Thank you! We'll contact you shortly to confirm your order and guide you through the next steps.</div>
          <button className="modal-close" onClick={() => setSuccessOpen(false)}>Close</button>
        </div>
      </div>

      {/* ── FLOATING BUTTONS (right) ───────────────────────────── */}
      <div className="fab-group">
        <a
          className="review-fab"
          href="https://www.google.com/maps/search/New+Prince+Digilab+Mysuru"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="review-fab-pulse" />
          <GoogleLogoSVG />
          Review Us
        </a>
        <a className="order-fab" href="#order" onClick={() => navToMain('#order')}>
          <div className="order-fab-pulse" />
          <svg viewBox="0 0 24 24"><path d="M7 4h-2l-3 9v2h20v-2l-3-9h-2m-10 0v-2a5 5 0 0110 0v2m-5 6v4m-2-2h4" strokeWidth="2" stroke="#fff" fill="none" strokeLinecap="round"/></svg>
          Order Now
        </a>
      </div>

      {/* ── FLOATING BUTTONS (left) ────────────────────────────── */}
      <div className="social-fab-group">
        <a
          className="whatsapp-fab"
          href="https://wa.me/918214264066"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="whatsapp-fab-pulse" />
          <WhatsAppSVG />
          WhatsApp
        </a>
        <a
          className="instagram-fab"
          href="https://instagram.com/newprincedigilab"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="instagram-fab-pulse" />
          <InstagramSVG />
          Instagram
        </a>
      </div>

    </div>
  );
}
