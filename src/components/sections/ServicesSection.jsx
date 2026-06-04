import { SERVICES } from '../../data/services';

export default function ServicesSection() {
  return (
    <section className="pad services-section" id="services">
      <div className="sec-label">What We Offer</div>
      <h2 className="sec-title">Our <em>Services</em></h2>
      <p className="sec-sub">
        Every product is handcrafted in Mysuru — from premium NPL pad albums to LED video boxes and luxury gift combos.
      </p>
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <div key={s.title} className="service-card">
            <span className="svc-num">0{i + 1}</span>
            <div className="svc-icon-wrap">
              <span className="svc-icon">{s.icon}</span>
            </div>
            <div className="svc-name">{s.title}</div>
            <p className="svc-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
