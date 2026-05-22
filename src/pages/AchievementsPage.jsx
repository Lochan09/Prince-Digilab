const ACHIEVEMENTS = [
  { icon: '🏆', title: '1000+ Happy Clients',      desc: 'Trusted by families across Mysuru and Karnataka for their most precious memories.' },
  { icon: '⭐', title: '5-Star Google Rating',      desc: 'Consistently rated 5 stars by our clients on Google for quality and service.' },
  { icon: '📐', title: '72+ Unique Designs',        desc: 'Our NPL Pad Album catalog features over 72 exclusive designs crafted in-house.' },
  { icon: '🎖️', title: '10+ Years of Excellence',   desc: 'A decade of delivering premium photo products with zero compromise on quality.' },
  { icon: '🌟', title: 'Featured Lab in Mysuru',    desc: 'Recognised as one of the top photo labs in Mysuru by local photographers and studios.' },
  { icon: '🔬', title: '4K Printing Technology',    desc: 'State-of-the-art 4K quality printing with 7-colour ink systems for vibrant outputs.' },
];

export default function AchievementsPage({ onBack }) {
  return (
    <div className="spa-page active" id="page-achievements">
      <div style={{ padding: '8rem 3rem 5rem' }}>
        <div className="sec-label">Milestones</div>
        <h1 className="sec-title">Our <em>Achievements</em></h1>
        <p className="sec-sub" style={{ maxWidth: '64ch', marginBottom: '2.5rem' }}>
          Over the years, New Prince Digilab has built a reputation for excellence in photo
          printing and album craftsmanship across Karnataka.
        </p>

        <div className="services-grid" style={{ marginTop: '2rem' }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.title} className="service-card">
              <div className="svc-icon">{a.icon}</div>
              <div className="svc-name">{a.title}</div>
              <p className="svc-desc">{a.desc}</p>
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
