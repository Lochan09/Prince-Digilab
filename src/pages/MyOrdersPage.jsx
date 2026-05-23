import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Row({ label, value }) {
  return (
    <div className="order-detail-row">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function OrderCard({ order, expanded, onToggle }) {
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

export default function MyOrdersPage({ onBack }) {
  const { user, signIn, loading } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error,    setError]    = useState('');
  const [expanded, setExpanded] = useState(0);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    setError('');
    fetch(`/api/orders/lookup?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(d => { if (d.orders) setOrders(d.orders); else setError(d.error || 'Failed to load orders.'); })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setFetching(false));
  }, [user]);

  return (
    <div className="spa-page active" id="page-myorders">
      <div className="myorders-wrap">
        <button className="btn-primary myorders-back" onClick={onBack}
          style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Back to Home
        </button>

        <div className="sec-label" style={{ marginTop: '1.5rem' }}>Order History</div>
        <h1 className="sec-title">My <em>Orders</em></h1>

        {loading && <div className="order-empty">Loading…</div>}

        {!loading && !user && (
          <div className="myorders-signin-prompt">
            <p>Sign in with your Google account to view your orders.</p>
            <button className="btn-primary" onClick={signIn}
              style={{ border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
              Sign In with Google
            </button>
          </div>
        )}

        {!loading && user && (
          <>
            <div className="myorders-user-row">
              <img src={user.photoURL} referrerPolicy="no-referrer" className="nav-avatar" alt="" />
              <span>Orders for <strong>{user.email}</strong></span>
            </div>

            {fetching && <div className="order-empty">Loading your orders…</div>}
            {error    && <div className="order-lookup-error">{error}</div>}

            {!fetching && !error && orders.length === 0 && (
              <div className="order-empty">No orders found. Place your first order!</div>
            )}

            {!fetching && orders.length > 0 && (
              <div className="order-history-list">
                {orders.map((o, i) => (
                  <OrderCard
                    key={o.id || i}
                    order={o}
                    expanded={expanded === i}
                    onToggle={() => setExpanded(expanded === i ? null : i)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <p className="order-helpline">For order queries call us: <strong>0821-4264066</strong></p>
      </div>
    </div>
  );
}
