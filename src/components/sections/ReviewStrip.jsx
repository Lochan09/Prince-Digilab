import { GoogleLogoSVG } from '../icons';

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/New+Prince+Digilab+Mysuru';

export default function ReviewStrip() {
  return (
    <section className="review-strip">
      <div className="review-strip-inner">
        <div className="review-stars">★★★★★</div>
        <div className="review-heading">
          Love Our Work? <em>Leave a Review</em>
        </div>
        <div className="review-sub">
          Your feedback helps other families discover us
        </div>
        <a
          className="review-btn"
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GoogleLogoSVG />
          Write a Google Review
        </a>
        <div className="review-note">
          Takes less than 60 seconds — every review means the world to us
        </div>
      </div>
    </section>
  );
}
