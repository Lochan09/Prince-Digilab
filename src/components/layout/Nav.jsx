import { useEffect, useState } from 'react';
import { ChevronDownSVG, GoogleLogoSVG } from '../icons';
import { useAuth } from '../../context/AuthContext';

export default function Nav({ onGoToPage, onGoToSection }) {
  const [navOpen,  setNavOpen]  = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, loading, signIn, signOut } = useAuth();

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (!e.target.closest('.nav-more-wrap')) setMoreOpen(false);
    }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  function handleSection(hash) {
    setNavOpen(false);
    setMoreOpen(false);
    onGoToSection(hash);
  }

  function handlePage(page) {
    setNavOpen(false);
    setMoreOpen(false);
    onGoToPage(page);
  }

  return (
    <nav>
      <a href="#home" className="logo-wrap" onClick={() => handleSection('#home')}>
        <img
          className="logo-img"
          src="/images/1778236747583_Logo.jpg"
          alt="New Prince Digilab logo"
        />
        <div>
          <span className="logo-text">New Prince <span>Digilab</span></span>
          <span className="logo-sub">Mysuru • Premium Photo Lab</span>
        </div>
      </a>

      <ul className={`nav-links${navOpen ? ' open' : ''}`}>
        <li><a href="#home"     onClick={() => handleSection('#home')}>Home</a></li>
        <li><a href="#catalog"  onClick={() => handleSection('#catalog')}>Catalog</a></li>
        <li><a href="#services" onClick={() => handleSection('#services')}>Services</a></li>

        <li className="nav-more-wrap">
          <button
            className="nav-more-btn"
            aria-expanded={moreOpen}
            onClick={e => { e.stopPropagation(); setMoreOpen(o => !o); }}
          >
            More
            <ChevronDownSVG className="more-chevron" />
          </button>
          <ul className={`nav-more-dropdown${moreOpen ? ' open' : ''}`}>
            <li><a href="#about"        onClick={() => handlePage('about')}>About Us</a></li>
            <li><a href="#achievements" onClick={() => handlePage('achievements')}>Achievements</a></li>
            <li><a href="#faq"          onClick={() => handlePage('faq')}>FAQ</a></li>
            <li><a href="#myorders"     onClick={() => handlePage('myorders')}>My Orders</a></li>
          </ul>
        </li>

        <li><a href="#contact" onClick={() => handleSection('#contact')}>Contact</a></li>

        {/* Mobile-only auth items */}
        {!loading && !user && (
          <li className="mob-signin-li">
            <button onClick={() => { setNavOpen(false); signIn(); }}>
              <GoogleLogoSVG /> Sign In with Google
            </button>
          </li>
        )}
        {!loading && user && (
          <li className="mob-signout-li">
            <button onClick={() => { setNavOpen(false); signOut(); }}>
              Sign Out ({user.displayName?.split(' ')[0]})
            </button>
          </li>
        )}
      </ul>

      {/* Desktop sign-in / user area */}
      {!loading && !user && (
        <button className="nav-signin-btn" onClick={signIn}>
          <GoogleLogoSVG /> Sign In
        </button>
      )}
      {!loading && user && (
        <div className="nav-user-wrap">
          <img src={user.photoURL} referrerPolicy="no-referrer" className="nav-avatar" alt={user.displayName} />
          <span className="nav-user-name">{user.displayName?.split(' ')[0]}</span>
          <button className="nav-signout-btn" onClick={signOut}>Sign Out</button>
        </div>
      )}

      <a className="nav-btn" href="#order" onClick={() => handleSection('#order')}>
        Order Now
      </a>

      <button
        className={`hamburger${navOpen ? ' active' : ''}`}
        aria-expanded={navOpen}
        aria-label="Toggle navigation"
        onClick={() => setNavOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
