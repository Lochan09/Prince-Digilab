import { HERO_STATS } from '../data/constants';

export default function AboutPage({ onBack }) {
  return (
    <div className="spa-page active" id="page-about">
      <div style={{ padding: '8rem 3rem 5rem' }}>
        <div className="sec-label">Our Story</div>
        <h1 className="sec-title">About <em>New Prince Digilab</em></h1>
        <p className="sec-sub" style={{ maxWidth: '70ch', marginBottom: '2rem' }}>
          New Prince Digilab has been Mysuru's most trusted photo lab for over a decade.
          We specialise in crafting premium photo albums, luxury combo packages, LED video
          boxes, and personalised memory keepsakes for weddings, receptions, and all
          celebrations.
        </p>
        <p className="sec-sub" style={{ maxWidth: '70ch', marginBottom: '2rem' }}>
          Our skilled artisans combine the finest rexin, leather, and wood materials with
          cutting-edge 4K printing to deliver products that truly preserve your most
          cherished moments. Every album is made with passion, precision, and pride.
        </p>

        <div className="why-grid" style={{ marginTop: '2.5rem' }}>
          {HERO_STATS.map(s => (
            <div key={s.num} className="why-card">
              <div className="why-num">{s.num}</div>
              <div className="why-label">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          style={{ marginTop: '2.5rem', border: 'none', cursor: 'pointer' }}
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
