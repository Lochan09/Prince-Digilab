import { GoogleLogoSVG } from '../icons';
import { REVIEWS } from '../../data/reviews';

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function ReviewCard({ r }) {
  return (
    <div className="rev-card">
      <div className="rev-stars">{'★'.repeat(r.stars)}</div>
      <div className="rev-text">"{r.text}"</div>
      <div className="rev-author">
        <div className="rev-avatar" style={{ background: r.color }}>
          {initials(r.name)}
        </div>
        <div>
          <div className="rev-name">{r.name}</div>
          <div className="rev-badge">
            <GoogleLogoSVG />
            Google Review
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsTicker() {
  const half = Math.ceil(REVIEWS.length / 2);
  const row1 = REVIEWS.slice(0, half);
  const row2 = REVIEWS.slice(half);

  return (
    <div className="reviews-ticker-wrap">
      <div className="reviews-ticker-row row-1">
        {[...row1, ...row1].map((r, i) => <ReviewCard key={i} r={r} />)}
      </div>
      <div className="reviews-ticker-row row-2">
        {[...row2, ...row2].map((r, i) => <ReviewCard key={i} r={r} />)}
      </div>
    </div>
  );
}
