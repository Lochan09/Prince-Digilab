import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pdl_my_orders';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function OrderCard({ order, index, expanded, onToggle }) {
  return (
    <div className={`order-card${expanded ? ' expanded' : ''}`}>
      <button className="order-card-header" onClick={onToggle}>
        <div className="order-card-left">
          <div className="order-card-product">{order.productCategory}</div>
          <div className="order-card-id">{order.id}</div>
        </div>
        <div className="order-card-right">
          <div className="order-card-date">{fmtDate(order.createdAt)}</div>
          <span className="order-card-chevron">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="order-card-details">
          {order.name        && <Row label="Name"        value={order.name} />}
          {order.phone       && <Row label="Phone"       value={order.phone} />}
          {order.albumSize   && <Row label="Album Size"  value={order.albumSize} />}
          {order.designCode  && <Row label="Design Code" value={order.designCode} />}
          {order.customText  && <Row label="Custom Text" value={order.customText} />}
          {order.notes       && <Row label="Notes"       value={order.notes} />}
          {order.photoCount > 0 && <Row label="Photos" value={`${order.photoCount} uploaded`} />}
          {order.driveFolderUrl && (
            <div className="order-detail-row">
              <span>Photos</span>
              <a href={order.driveFolderUrl} target="_blank" rel="noopener noreferrer">View in Drive →</a>
            </div>
          )}
          <div className="order-detail-row">
            <span>Status</span>
            <span className="order-status-badge">In Progress</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="order-detail-row">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

export default function MyOrdersPage({ onBack }) {
  const [localOrders,   setLocalOrders]   = useState([]);
  const [email,         setEmail]         = useState('');
  const [fetching,      setFetching]      = useState(false);
  const [fetchedOrders, setFetchedOrders] = useState(null);
  const [fetchError,    setFetchError]    = useState('');
  const [expanded,      setExpanded]      = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setLocalOrders(stored);
    if (stored.length > 0 && stored[0].email) setEmail(stored[0].email);
  }, []);

  async function handleLookup(e) {
    e.preventDefault();
    setFetching(true);
    setFetchError('');
    setFetchedOrders(null);
    try {
      const res  = await fetch(`/api/orders/lookup?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lookup failed.');
      setFetchedOrders(data.orders);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setFetching(false);
    }
  }

  const orders = fetchedOrders ?? localOrders;

  return (
    <div className="spa-page active" id="page-myorders">
      <div className="myorders-wrap">
        <button className="btn-primary myorders-back" onClick={onBack}
          style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Back to Home
        </button>

        <div className="sec-label" style={{ marginTop: '1.5rem' }}>Order History</div>
        <h1 className="sec-title">My <em>Orders</em></h1>

        <form className="order-lookup-form" onSubmit={handleLookup}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email to look up orders"
            required
          />
          <button type="submit" disabled={fetching}>
            {fetching ? 'Looking up…' : 'Look Up'}
          </button>
        </form>
        {fetchError && <div className="order-lookup-error">{fetchError}</div>}

        {orders.length === 0 ? (
          <div className="order-empty">
            {fetchedOrders !== null
              ? 'No orders found for this email.'
              : 'No orders placed yet from this device. Use Look Up to search by email.'}
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map((o, i) => (
              <OrderCard
                key={o.id || i}
                order={o}
                index={i}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
              />
            ))}
          </div>
        )}

        <p className="order-helpline">
          For order queries call us: <strong>0821-4264066</strong>
        </p>
      </div>
    </div>
  );
}
