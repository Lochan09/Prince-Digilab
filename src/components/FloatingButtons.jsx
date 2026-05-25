import { GoogleLogoSVG, WhatsAppSVG, InstagramSVG, OrderBagSVG } from './icons';

const GOOGLE_MAPS_URL  = 'https://www.google.com/maps/search/New+Prince+Digilab+Mysuru';
const WHATSAPP_URL     = 'https://wa.me/918214264066';
const INSTAGRAM_URL    = 'https://www.instagram.com/prince_digilabmys';

export default function FloatingButtons({ onOrderClick }) {
  return (
    <>
      {/* Bottom-right: Review + Order */}
      <div className="fab-group">
        <a className="order-fab" href="#order" onClick={onOrderClick}>
          <div className="order-fab-pulse" />
          <OrderBagSVG />
          Order Now
        </a>
        <a className="review-fab" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
          <div className="review-fab-pulse" />
          <GoogleLogoSVG />
          Review Us
        </a>
      </div>

      {/* Bottom-left: WhatsApp + Instagram */}
      <div className="social-fab-group">
        <a className="whatsapp-fab" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <div className="whatsapp-fab-pulse" />
          <WhatsAppSVG />
          WhatsApp
        </a>
        <a className="instagram-fab" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <div className="instagram-fab-pulse" />
          <InstagramSVG />
          Instagram
        </a>
      </div>
    </>
  );
}
