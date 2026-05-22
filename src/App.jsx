import { useState } from 'react';

import { Nav }                                        from './components/layout';
import { Lightbox }                                   from './components/ui';
import FloatingButtons                                from './components/FloatingButtons';
import { MainPage, AboutPage, AchievementsPage, FaqPage, MyOrdersPage } from './pages';
import { CATALOG }                                    from './data/catalog';

export default function App() {
  const [activePage, setActivePage] = useState(null); // null | 'about' | 'achievements' | 'faq'
  const [lb,         setLb]         = useState(null); // null | { cat, idx }

  function goToPage(page) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function goToSection(hash) {
    setActivePage(null);
    if (!hash) return;
    setTimeout(() => {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  function navLightbox(delta) {
    if (!lb) return;
    const items = CATALOG[lb.cat];
    setLb({ cat: lb.cat, idx: ((lb.idx + delta) + items.length) % items.length });
  }

  return (
    <div className="app-shell">

      <Nav onGoToPage={goToPage} onGoToSection={goToSection} />

      {activePage === 'about'        && <AboutPage        onBack={() => goToSection(null)} />}
      {activePage === 'achievements' && <AchievementsPage onBack={() => goToSection(null)} />}
      {activePage === 'faq'          && <FaqPage          onBack={() => goToSection(null)} />}
      {activePage === 'myorders'     && <MyOrdersPage     onBack={() => goToSection(null)} />}

      {!activePage && (
        <MainPage
          onOpenLightbox={(cat, idx) => setLb({ cat, idx })}
          onGoToSection={goToSection}
          onViewOrders={() => goToPage('myorders')}
        />
      )}

      <Lightbox lb={lb} onClose={() => setLb(null)} onNav={navLightbox} />
      <FloatingButtons onOrderClick={() => goToSection('#order')} />

    </div>
  );
}
