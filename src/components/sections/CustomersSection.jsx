import ReviewsTicker from '../ui/ReviewsTicker';

export default function CustomersSection() {
  return (
    <section className="customers-section">
      <div className="customers-header">
        <div className="sec-label">Customer Love</div>
        <div className="rating-badge">
          <span>★ 5.0</span>
          <small>Google Rating</small>
        </div>
        <h2>What Our <em>Happy Customers</em> Say</h2>
        <p>Real reviews from real clients who trusted us with their most precious memories.</p>
      </div>
      <ReviewsTicker />
    </section>
  );
}
