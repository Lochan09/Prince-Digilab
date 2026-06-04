import { useState } from 'react';
import { CATALOG, CATALOG_TABS } from '../../data/catalog';

export default function Catalog({ onOpenLightbox }) {
  const [activeTab, setActiveTab] = useState('npl');

  return (
    <section className="pad catalog-section" id="catalog">
      <div className="sec-label">Product Catalog</div>
      <h2 className="sec-title">Our <em>Collections</em></h2>
      <p className="sec-sub">
        Browse our handcrafted range of premium rexin, leather and wood products.
        Click any image to view it full size.
      </p>

      <div className="scroll-fade-wrap tabs-scroll-wrap">
        <div className="catalog-tabs">
          {CATALOG_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.badge && <span className="tab-new-badge">New</span>}
            </button>
          ))}
        </div>
        <div className="scroll-more-hint" aria-hidden="true">swipe ›</div>
      </div>

      <div className="scroll-fade-wrap sheet-scroll-wrap">
        <div className="sheet-grid">
        {(CATALOG[activeTab] || []).map(([src, label], idx) => (
          <div
            key={label}
            className="sheet-card"
            onClick={() => src && onOpenLightbox(activeTab, idx)}
            style={!src ? { cursor: 'default' } : {}}
          >
            {src ? (
              <>
                <img src={src} alt={label} loading="lazy" />
                <div className="sheet-zoom-hint">Click to enlarge</div>
              </>
            ) : (
              <div style={{
                minHeight: '200px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                background: 'linear-gradient(135deg,var(--purple-dark),var(--purple-light))',
                color: '#fff', padding: '2rem',
              }}>
                <span style={{ fontSize: '2.5rem' }}>📚</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8, fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Photos coming soon
                </span>
              </div>
            )}
            <div className="sheet-label">{label}</div>
          </div>
        ))}
        </div>
        <div className="scroll-more-hint" aria-hidden="true">swipe ›</div>
      </div>
    </section>
  );
}
