"use client";

import { useMemo, useState } from "react";

type Transaction = {
  id: string; client: string; initials: string; type: "Buy" | "Sell"; usdt: number;
  inr: string; method: string; status: "Completed" | "Review" | "Processing"; time: string;
};

const transactions: Transaction[] = [
  { id: "VX-84291", client: "Arjun Mehta", initials: "AM", type: "Buy", usdt: 12450, inr: "₹10,46,825", method: "Bank transfer", status: "Completed", time: "10:42 AM" },
  { id: "VX-84290", client: "Meera Shah", initials: "MS", type: "Sell", usdt: 8200, inr: "₹6,87,980", method: "CDM", status: "Review", time: "10:18 AM" },
  { id: "VX-84289", client: "Zaid Khan", initials: "ZK", type: "Buy", usdt: 3600, inr: "₹3,02,040", method: "UPI", status: "Processing", time: "09:55 AM" },
  { id: "VX-84288", client: "Kavya Iyer", initials: "KI", type: "Sell", usdt: 21500, inr: "₹18,06,000", method: "Cash", status: "Completed", time: "09:21 AM" },
  { id: "VX-84287", client: "Rohan Das", initials: "RD", type: "Buy", usdt: 6800, inr: "₹5,70,520", method: "Bank transfer", status: "Completed", time: "Yesterday" },
];

const icons: Record<string, string> = { Dashboard: "⌂", Transactions: "↔", Clients: "◎", KYC: "◇", Audit: "≡", Reports: "▥", Settings: "⚙" };

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [range, setRange] = useState("Today");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [menu, setMenu] = useState(false);
  const filtered = useMemo(() => transactions.filter((t) => `${t.id} ${t.client} ${t.method}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <div className="brand"><span className="brand-mark">V</span><span>VaultX <b>Ledger</b></span></div>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {["Dashboard", "Transactions", "Clients", "KYC", "Audit", "Reports"].map((item) => (
            <button key={item} className={active === item ? "active" : ""} onClick={() => { setActive(item); setMenu(false); flash(`${item} view selected`); }}>
              <span>{icons[item]}</span>{item}{item === "KYC" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => flash("Settings are restricted to administrators")}><span>{icons.Settings}</span>Settings</button>
          <div className="support-card"><span className="pulse-dot"/><strong>Systems operational</strong><small>Last backup 18 min ago</small></div>
          <div className="user-mini"><span>NM</span><div><strong>Nikhil Menon</strong><small>Administrator</small></div><button aria-label="Open account menu">•••</button></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">☰</button>
          <div className="search-wrap"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transaction ID, client or payment method..." aria-label="Search transactions"/><kbd>⌘ K</kbd></div>
          <button className="icon-button" aria-label="Notifications" onClick={() => flash("You have 3 KYC reviews pending")}>♧<i>3</i></button>
          <button className="avatar" aria-label="Account">NM</button>
        </header>

        <div className="page-body">
          <div className="welcome-row">
            <div><p className="eyebrow">FRIDAY, 7 AUGUST</p><h1>Good morning, Nikhil.</h1><p>Here’s what’s moving across your desk today.</p></div>
            <div className="header-actions"><button className="secondary" onClick={() => flash("Report export prepared securely")}>⇩ Export report</button><button className="primary" onClick={() => flash("New transaction form ready")}>＋ New transaction</button></div>
          </div>

          <section className="metrics" aria-label="Key metrics">
            <article><div className="metric-icon teal">↗</div><div><span>USDT purchased</span><h2>48,250 <small>USDT</small></h2><p className="up">↑ 12.4% <i>vs yesterday</i></p></div></article>
            <article><div className="metric-icon violet">↙</div><div><span>USDT sold</span><h2>31,840 <small>USDT</small></h2><p className="down">↓ 4.2% <i>vs yesterday</i></p></div></article>
            <article><div className="metric-icon gold">₹</div><div><span>INR volume</span><h2>₹67.2L</h2><p className="up">↑ 8.7% <i>vs yesterday</i></p></div></article>
            <article><div className="metric-icon navy">✓</div><div><span>Transactions</span><h2>47</h2><p><b className="review-num">2</b> <i>awaiting review</i></p></div></article>
          </section>

          <section className="main-grid">
            <article className="panel activity-panel">
              <div className="panel-heading"><div><h3>Transaction activity</h3><p>Buy and sell volume across this week</p></div><select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Chart range"><option>Today</option><option>This week</option><option>This month</option></select></div>
              <div className="chart-legend"><span><i className="dot teal-bg"/>Buy</span><span><i className="dot violet-bg"/>Sell</span><b>{range}</b></div>
              <div className="chart" aria-label="Weekly transaction chart">
                <div className="y-axis"><span>25K</span><span>20K</span><span>15K</span><span>10K</span><span>5K</span><span>0</span></div>
                <div className="bars">
                  {[[48,35],[65,43],[55,38],[82,58],[68,46],[91,63],[51,34]].map((v,i) => <div className="bar-day" key={i}><div className="bar-pair"><i style={{height:`${v[0]}%`}}/><i style={{height:`${v[1]}%`}}/></div><span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>)}
                </div>
              </div>
            </article>

            <article className="panel kyc-panel">
              <div className="panel-heading"><div><h3>KYC attention</h3><p>Items requiring action</p></div><button onClick={() => { setActive("KYC"); flash("Showing all KYC cases"); }}>View all →</button></div>
              <div className="kyc-item"><span className="client-avatar peach">MS</span><div><strong>Meera Shah</strong><p>Video KYC needs review</p></div><time>12m</time></div>
              <div className="kyc-item"><span className="client-avatar blue">AA</span><div><strong>Aditya Arora</strong><p>PAN document expiring</p></div><time>1h</time></div>
              <div className="kyc-item"><span className="client-avatar green">SP</span><div><strong>Sana Patel</strong><p>Address mismatch flagged</p></div><time>3h</time></div>
              <button className="review-button" onClick={() => flash("Review queue opened")}>Review pending KYC <span>3</span></button>
            </article>
          </section>

          <section className="panel transactions-panel">
            <div className="panel-heading"><div><h3>Recent transactions</h3><p>{query ? `${filtered.length} matching records` : "Latest activity across all clients"}</p></div><button onClick={() => { setActive("Transactions"); flash("Full transaction register opened"); }}>View all transactions →</button></div>
            <div className="table-scroll"><table><thead><tr><th>Transaction ID</th><th>Client</th><th>Type</th><th>USDT amount</th><th>INR amount</th><th>Payment</th><th>Status</th><th>Time</th></tr></thead><tbody>
              {filtered.map((t) => <tr key={t.id} onClick={() => setSelected(t)}><td><b className="tx-id">{t.id}</b></td><td><div className="client-cell"><span className="client-avatar">{t.initials}</span><strong>{t.client}</strong></div></td><td><span className={`type ${t.type.toLowerCase()}`}>{t.type === "Buy" ? "↗" : "↙"} {t.type}</span></td><td><b>{t.usdt.toLocaleString()}</b></td><td>{t.inr}</td><td><span className="payment">{t.method}</span></td><td><span className={`status ${t.status.toLowerCase()}`}>● {t.status}</span></td><td>{t.time}</td></tr>)}
            </tbody></table>{filtered.length === 0 && <div className="empty-state">No transaction matches “{query}”. Try an ID like VX-84291.</div>}</div>
          </section>

          <footer><div><span className="shield">✓</span><p><strong>Protected workspace</strong><small>AES-256 storage · TLS 1.3 in transit · Role-based access</small></p></div><p>Audit logging active <span className="live-dot"/></p></footer>
        </div>
      </section>

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="detail-card" onClick={(e) => e.stopPropagation()} aria-modal="true" role="dialog"><button className="close" onClick={() => setSelected(null)}>×</button><p className="eyebrow">TRANSACTION RECORD</p><h2>{selected.id}</h2><div className="detail-client"><span className="client-avatar">{selected.initials}</span><div><strong>{selected.client}</strong><small>KYC verified · Client since 2023</small></div></div><dl><div><dt>Direction</dt><dd><span className={`type ${selected.type.toLowerCase()}`}>{selected.type}</span></dd></div><div><dt>USDT amount</dt><dd>{selected.usdt.toLocaleString()} USDT</dd></div><div><dt>INR settlement</dt><dd>{selected.inr}</dd></div><div><dt>Payment rail</dt><dd>{selected.method}</dd></div><div><dt>Status</dt><dd><span className={`status ${selected.status.toLowerCase()}`}>● {selected.status}</span></dd></div></dl><div className="audit-note"><span>≡</span><p><strong>Audit trail protected</strong><small>Created by Nikhil Menon · Device and IP captured</small></p></div><button className="primary full" onClick={() => flash("Client history opened")}>View client transaction history</button></section></div>}
      {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}
    </main>
  );
}
