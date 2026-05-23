import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';

const PURPLE  = '#6c3fc8';
const SOFT    = '#a78bfa';
const COLORS  = ['#6c3fc8','#a78bfa','#c4b5fd','#7c3aed','#4c1d95','#ddd6fe','#8b5cf6','#5b21b6','#ede9fe'];

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
  });
}

function StatCard({ num, label, sub }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-num">{num}</div>
      <div className="admin-stat-label">{label}</div>
      {sub && <div className="admin-stat-sub">{sub}</div>}
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

// ── Data helpers ────────────────────────────────────────────────────────────────
function buildDailyTrend(orders, days = 30) {
  const map = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    map[key] = 0;
  }
  orders.forEach(o => {
    const key = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (key in map) map[key]++;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
}

function buildMonthly(orders, months = 6) {
  const map = {};
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    map[key] = 0;
  }
  orders.forEach(o => {
    const key = new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    if (key in map) map[key]++;
  });
  return Object.entries(map).map(([month, orders]) => ({ month, orders }));
}

function buildProductChart(orders) {
  const map = {};
  orders.forEach(o => {
    const p = o.productCategory || 'Other';
    map[p] = (map[p] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function buildSizeChart(orders) {
  const map = {};
  orders.forEach(o => {
    const s = o.albumSize || 'Not specified';
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <div className="chart-tooltip-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || PURPLE }}>
          {p.name ? `${p.name}: ` : ''}{p.value} order{p.value !== 1 ? 's' : ''}
        </div>
      ))}
    </div>
  );
};

// ── Dashboard tab ───────────────────────────────────────────────────────────────
function Dashboard({ orders }) {
  const now      = new Date();
  const today    = now.toDateString();
  const weekAgo  = new Date(now - 7  * 86400000);
  const monthAgo = new Date(now - 30 * 86400000);

  const todayCount = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;
  const weekCount  = orders.filter(o => new Date(o.createdAt) >= weekAgo).length;
  const monthCount = orders.filter(o => new Date(o.createdAt) >= monthAgo).length;

  const daily    = buildDailyTrend(orders, 14);
  const monthly  = buildMonthly(orders, 6);
  const products = buildProductChart(orders);
  const sizes    = buildSizeChart(orders);

  return (
    <div className="dashboard-wrap">
      {/* Stat cards */}
      <div className="admin-stats admin-stats--4">
        <StatCard num={orders.length} label="Total Orders" />
        <StatCard num={monthCount}    label="This Month" />
        <StatCard num={weekCount}     label="This Week" />
        <StatCard num={todayCount}    label="Today" />
      </div>

      {/* Daily trend */}
      <div className="chart-card">
        <div className="chart-card-title">Orders — Last 14 Days</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={daily} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888' }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={PURPLE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly + product charts side by side */}
      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-title">Monthly Trend (6 months)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="orders" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 4, fill: PURPLE }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Album Size Distribution</div>
          {sizes.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sizes} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={75} innerRadius={35} paddingAngle={3}>
                  {sizes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} orders`, n]} />
                <Legend iconType="circle" iconSize={8}
                  formatter={v => <span style={{ fontSize: '0.72rem' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="chart-empty">No data yet</div>}
        </div>
      </div>

      {/* Top products */}
      <div className="chart-card">
        <div className="chart-card-title">Orders by Product</div>
        {products.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(180, products.length * 40)}>
            <BarChart data={products} layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis type="category" dataKey="name" width={150}
                tick={{ fontSize: 10, fill: '#555' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={SOFT} radius={[0, 4, 4, 0]}>
                {products.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="chart-empty">No data yet</div>}
      </div>
    </div>
  );
}

// ── All Orders tab ──────────────────────────────────────────────────────────────
function AllOrders({ orders }) {
  const [expanded, setExpanded] = useState(null);
  const [search,   setSearch]   = useState('');

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

  return (
    <>
      <input className="admin-search" type="text" value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, email, phone, product or order ID…" />

      {filtered.length === 0 && (
        <div className="order-empty">{search ? 'No orders match your search.' : 'No orders yet.'}</div>
      )}

      <div className="order-history-list" style={{ marginTop: '0.75rem' }}>
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
                <Row label="Name"    value={o.name} />
                <Row label="Phone"   value={o.phone} />
                <Row label="Email"   value={o.email} />
                <Row label="Product" value={o.productCategory} />
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
    </>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────────
export default function AdminOrdersPage({ onBack }) {
  const { user } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState('');
  const [tab,      setTab]      = useState('dashboard');

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

  return (
    <div className="spa-page active" id="page-admin">
      <div className="myorders-wrap">
        <button className="btn-primary myorders-back" onClick={onBack}
          style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Back to Home
        </button>

        <div className="sec-label" style={{ marginTop: '1.5rem' }}>Owner Dashboard</div>
        <h1 className="sec-title">Monitor <em>Orders</em></h1>

        {/* Tab switcher */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === 'dashboard' ? ' active' : ''}`}
            onClick={() => setTab('dashboard')}>Dashboard</button>
          <button className={`admin-tab${tab === 'orders' ? ' active' : ''}`}
            onClick={() => setTab('orders')}>All Orders {orders.length > 0 && `(${orders.length})`}</button>
        </div>

        {fetching && <div className="order-empty">Loading orders…</div>}
        {error    && <div className="order-lookup-error">{error}</div>}

        {!fetching && !error && (
          tab === 'dashboard'
            ? <Dashboard orders={orders} />
            : <AllOrders  orders={orders} />
        )}
      </div>
    </div>
  );
}
