import { TICKER_WORDS } from '../../data/constants';

export default function Ticker() {
  const doubled = [...TICKER_WORDS, ...TICKER_WORDS];

  return (
    <section className="ticker" aria-label="Featured products">
      <div className="ticker-track">
        {doubled.map((word, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot">✦</span>
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
