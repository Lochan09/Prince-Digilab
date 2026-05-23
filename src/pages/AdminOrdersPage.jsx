import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
  });
}

function Row({ label, value }) {
  return (
    <div className="order-detail-row">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

export default function AdminOrdersPage({ onBack }) {
  const { user } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState('');
  const [expanded, setExpanded] = useState(null);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then(token =>
      fetch('/api/orders/admin', { headers: { Authorization: `Bearer ${token}` } })
    )
      .then(r => r.json())
      .then(d => { if (d.orders) setOrders(d.orders); else setError(d.error || 'Failed.'); })
      .catch(() => setError('Network error.'))
      .finally(() => setFetching(false));
  }, [user]);

  const filtered = search.trim()
    ? orders.filter(o => {
        const q = search.toLowerCase();
        return (o.name || '').toLowerCase().includes(q)
          || (o.email || '').toLowerCase().includes(q)
          || (o.phone || '').includes(q)
          || (o.productCategory || '').toLowerCase().includes(q)
          || (o.id || '').includes(q);
      })
    : orders;

  const today = new Date().toDateString();
  const todayCount = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;

  return (
    <div className="spa-page active" id="page-admin">
      <div className="myorders-wrap">
        <button className="btn-primary myorders-back" onClick={onBack}
          style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Back to Home
        </button>

        <div className="sec-label" style={{ marginTop: '1.5rem' }}>Owner Dashboard</div>
        <h1 className="sec-title">Monitor <em>Orders</em></h1>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-num">{orders.length}</div>
            <div className="admin-stat-label">Total Orders</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-num">{todayCount}</div>
            <div className="admin-stat-label">Today</div>
          </div>
        </div>

        {/* Search */}
        <input
          className="admin-search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, product or order ID…"
        />

        {fetching && <div className="order-empty">Loading orders…</div>}
        {error    && <div className="order-lookup-error">{error}</div>}

        {!fetching && !error && filtered.length === 0 && (
          <div className="order-empty">{search ? 'No orders match your search.' : 'No orders yet.'}</div>
        )}

        {!fetching && filtered.length > 0 && (
          <div className="order-history-list" style={{ marginTop: '1rem' }}>
            {filtered.map((o, i) => (
              <div key={o.id || i} className={`order-card${expanded === i ? ' expanded' : ''}`}>
                <button className="order-card-header" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="order-card-left">
                    <div className="order-card-product">{o.name} — {o.productCategory}</div>
                    <div className="order-card-id">{o.id} · {o.email}</div>
                  </div>
                  <div className="order-card-right">
                    <div className="order-card-date">{fmtDate(o.createdAt)}</div>
                    <span className="order-card-chevron">{expanded === i ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expanded === i && (
                  <div className="order-card-details">
                    <Row label="Name"       value={o.name} />
                    <Row label="Phone"      value={o.phone} />
                    <Row label="Email"      value={o.email} />
                    <Row label="Product"    value={o.productCategory} />
                    {o.albumSize   && <Row label="Album Size"  value={o.albumSize} />}
                    {o.designCode  && <Row label="Design Code" value={o.designCode} />}
                    {o.customText  && <Row label="Custom Text" value={o.customText} />}
                    {o.notes       && <Row label="Notes"       value={o.notes} />}
                    {o.photoCount > 0 && <Row label="Photos" value={`${o.photoCount} uploaded`} />}
                    {o.driveFolderUrl && (
                      <div className="order-detail-row">
                        <span>Drive Folder</span>
                        <a href={o.driveFolderUrl} target="_blank" rel="noopener noreferrer">View photos →</a>
                      </div>
                    )}
                    <div className="order-detail-row">
                      <span>Status</span>
                      <span className="order-status-badge">In Progress</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
