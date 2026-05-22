import FaqItem from '../components/ui/FaqItem';
import { FAQ_ITEMS } from '../data/faq';

export default function FaqPage({ onBack }) {
  return (
    <div className="spa-page active" id="page-faq">
      <div style={{ padding: '8rem 3rem 5rem' }}>
        <div className="sec-label">FAQs</div>
        <h1 className="sec-title">Frequently Asked <em>Questions</em></h1>
        <p className="sec-sub" style={{ maxWidth: '64ch', marginBottom: '2.5rem' }}>
          Everything you need to know before placing your order with New Prince Digilab.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '800px' }}>
          {FAQ_ITEMS.map(item => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
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
