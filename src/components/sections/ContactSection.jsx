import { WhatsAppSVG, InstagramSVG, FacebookSVG, EmailSVG } from '../icons';

const MAPS_EMBED = 'https://www.google.com/maps?q=New+Prince+Digilab+Mysuru+Karnataka&output=embed';

export default function ContactSection() {
  return (
    <section className="pad contact-section" id="contact">
      <div className="sec-label">Find Us</div>
      <h2 className="sec-title">Visit Our <em>Lab</em></h2>

      <div className="contact-grid">
        <div>

          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <div className="contact-label">Address</div>
              <div className="contact-val">
                #56 Maharaja Shopping Complex<br />
                Cellar Area, B N Road<br />
                Mysuru — 570 001, Karnataka
              </div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <div className="contact-label">Phone</div>
              <div className="contact-val">
                0821-4264066<br />
                9353612126
              </div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">🕐</div>
            <div>
              <div className="contact-label">Working Hours</div>
              <div className="contact-val">
                Monday – Saturday: 10:00 AM – 8:00 PM<br />
                Sunday: Closed
              </div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">✦</div>
            <div>
              <div className="contact-label">Speciality</div>
              <div className="contact-val">
                Wedding Albums · Luxury Boxes · LED Frames<br />
                Custom Photo Products · Digital Keepsakes
              </div>
            </div>
          </div>

          <div className="social-links">
            <a className="social-link instagram" href="https://www.instagram.com/prince_digilabmys" target="_blank" rel="noopener noreferrer" title="Instagram">
              <InstagramSVG />
            </a>
            <a className="social-link facebook"  href="https://facebook.com/newprincedigilab"  target="_blank" rel="noopener noreferrer" title="Facebook">
              <FacebookSVG />
            </a>
            <a className="social-link whatsapp"  href="https://wa.me/918214264066"             target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <WhatsAppSVG />
            </a>
            <a className="social-link email"     href="mailto:princedigilab@gmail.com"         title="Email">
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
