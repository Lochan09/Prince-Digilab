const WHY_STATS = [
  { num: '72+',  label: 'Unique NPL Pad Designs',  icon: '📔' },
  { num: '12+',  label: 'Luxury Combo Options',    icon: '✨' },
  { num: '5',    label: 'LED Box Collections',     icon: '💡' },
  { num: '15+',  label: 'Suitcase Package Styles', icon: '🧳' },
  { num: '100%', label: 'Custom Personalisation',  icon: '🎨' },
];

export default function WhySection() {
  return (
    <section className="pad why-section">
      <div className="sec-label">Why Choose Us</div>
      <h2 className="sec-title">Craftsmanship You Can <em>Feel</em></h2>
      <div className="why-grid">
        {WHY_STATS.map(s => (
          <div key={s.num} className="why-card">
            <div className="why-icon">{s.icon}</div>
            <div className="why-num">{s.num}</div>
            <div className="why-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
