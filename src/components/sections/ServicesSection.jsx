import { SERVICES } from '../../data/services';

export default function ServicesSection() {
  return (
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
  );
}
