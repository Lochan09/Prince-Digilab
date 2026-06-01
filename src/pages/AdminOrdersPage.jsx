import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Chart colour palette ─────────────────────────────────────────────────────────
const CHART_COLORS = [
  '#6c3fc8', // purple
  '#0ea5e9', // sky blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
];

const DAILY_COLOR   = '#6c3fc8';
const MONTHLY_COLOR = '#0ea5e9';
const GRID_COLOR    = '#f1f5f9';

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
  });
}

function StatCard({ num, label, sub, color }) {
  return (
    <div className="admin-stat-card" style={{ borderTop: `3px solid ${color || '#6c3fc8'}` }}>
      <div className="admin-stat-num" style={{ color: color || '#6c3fc8' }}>{num}</div>
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

// ── Data helpers ─────────────────────────────────────────────────────────────────
function buildDailyTrend(orders, days = 14) {
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
        <div key={i} style={{ color: p.color || '#6c3fc8' }}>
          {p.name ? `${p.name}: ` : ''}{p.value} order{p.value !== 1 ? 's' : ''}
        </div>
      ))}
    </div>
  );
};

// ── Export helpers ───────────────────────────────────────────────────────────────
function exportExcel(orders) {
  const rows = orders.map(o => ({
    'Order ID':       o.id || '',
    'Date':           fmtDate(o.createdAt),
    'Name':           o.name || '',
    'Phone':          o.phone || '',
    'Email':          o.email || '',
    'Product':        o.productCategory || '',
    'Album Size':     o.albumSize || '',
    'Design Code':    o.designCode || '',
    'Custom Text':    o.customText || '',
    'Notes':          o.notes || '',
    'Photos':         o.photoCount || 0,
    'Drive Folder':   o.driveFolderUrl || '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 22 }, { wch: 22 }, { wch: 20 }, { wch: 14 },
    { wch: 28 }, { wch: 24 }, { wch: 14 }, { wch: 12 },
    { wch: 24 }, { wch: 30 }, { wch: 8  }, { wch: 40 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, `prince-digilab-orders-${new Date().toISOString().slice(0,10)}.xlsx`);
}

function exportPDF(orders) {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.setTextColor(108, 63, 200);
  doc.text('New Prince Digilab — Orders Report', 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}  ·  Total orders: ${orders.length}`, 14, 23);

  autoTable(doc, {
    startY: 28,
    head: [['Order ID', 'Date', 'Name', 'Phone', 'Product', 'Album Size', 'Design', 'Photos']],
    body: orders.map(o => [
      o.id || '',
      fmtDate(o.createdAt),
      o.name || '',
      o.phone || '',
      o.productCategory || '',
      o.albumSize || '',
      o.designCode || '',
      o.photoCount || 0,
    ]),
    headStyles: {
      fillColor: [108, 63, 200],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 7.5, textColor: 50 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 38 },
      2: { cellWidth: 28 },
      3: { cellWidth: 26 },
      4: { cellWidth: 38 },
      5: { cellWidth: 24 },
      6: { cellWidth: 20 },
      7: { cellWidth: 16 },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`prince-digilab-orders-${new Date().toISOString().slice(0,10)}.pdf`);
}

// ── Dashboard tab ─────────────────────────────────────────────────────────────────
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
        <StatCard num={orders.length} label="Total Orders"  color="#6c3fc8" />
        <StatCard num={monthCount}    label="This Month"    color="#0ea5e9" />
        <StatCard num={weekCount}     label="This Week"     color="#10b981" />
        <StatCard num={todayCount}    label="Today"         color="#f59e0b" />
      </div>

      {/* Daily trend */}
      <div className="chart-card">
        <div className="chart-card-title">Orders — Last 14 Days</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={daily} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888' }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={DAILY_COLOR} radius={[4, 4, 0, 0]}>
              {daily.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly + pie side by side */}
      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-title">Monthly Trend (6 months)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="orders" stroke={MONTHLY_COLOR} strokeWidth={2.5}
                dot={{ r: 4, fill: MONTHLY_COLOR }} activeDot={{ r: 6 }} />
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
                  {sizes.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
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
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10, fill: '#555' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {products.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="chart-empty">No data yet</div>}
      </div>
    </div>
  );
}

// ── All Orders tab ────────────────────────────────────────────────────────────────
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
      <div className="admin-orders-toolbar">
        <input className="admin-search" type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, product or order ID…" />

        <div className="admin-export-btns">
          <button className="admin-export-btn admin-export-btn--excel"
            onClick={() => exportExcel(filtered)}
            disabled={filtered.length === 0}
            title="Export to Excel">
            <span>⬇</span> Excel
          </button>
          <button className="admin-export-btn admin-export-btn--pdf"
            onClick={() => exportPDF(filtered)}
            disabled={filtered.length === 0}
            title="Export to PDF">
            <span>⬇</span> PDF
          </button>
        </div>
      </div>

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

// ── Main page ─────────────────────────────────────────────────────────────────────
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
