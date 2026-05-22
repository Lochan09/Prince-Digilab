import { WhatsAppSVG, InstagramSVG, EmailSVG } from '../icons';

const CONTACT_ITEMS = [
  { icon: '📍', label: 'Address',       value: 'New Prince Digilab, Mysuru, Karnataka — 570 001' },
  { icon: '📞', label: 'Phone',         value: '0821-4264066' },
  { icon: '✉️', label: 'Email',         value: '4kdigitalpress@gmail.com' },
  { icon: '🕐', label: 'Working Hours', value: 'Mon – Sat: 9:00 AM – 8:00 PM' },
];

const MAPS_EMBED = 'https://www.google.com/maps?q=New+Prince+Digilab+Mysuru+Karnataka&output=embed';

export default function ContactSection() {
  return (
    <section className="pad contact-section" id="contact">
      <div className="sec-label">Contact</div>
      <h2 className="sec-title">Visit Our <em>Studio</em></h2>

      <div className="contact-grid">
        <div>
          {CONTACT_ITEMS.map(item => (
            <div key={item.label} className="contact-item">
              <div className="contact-icon">{item.icon}</div>
              <div>
                <div className="contact-label">{item.label}</div>
                <div className="contact-val">{item.value}</div>
              </div>
            </div>
          ))}

          <div className="social-links">
            <a className="social-link whatsapp"  href="https://wa.me/918214264066"             target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <WhatsAppSVG />
            </a>
            <a className="social-link instagram" href="https://instagram.com/newprincedigilab" target="_blank" rel="noopener noreferrer" title="Instagram">
              <InstagramSVG />
            </a>
            <a className="social-link email"     href="mailto:4kdigitalpress@gmail.com"        title="Email">
              <EmailSVG />
            </a>
          </div>
        </div>

        <div className="contact-map">
          <iframe title="New Prince Digilab location" src={MAPS_EMBED} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
