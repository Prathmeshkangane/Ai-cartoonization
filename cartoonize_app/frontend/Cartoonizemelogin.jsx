import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syne+Mono&family=Outfit:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #07070F; }

  @keyframes drift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(60px,-40px) scale(1.1); }
    66%      { transform: translate(-30px,50px) scale(0.93); }
  }
  @keyframes drift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(-70px,40px) scale(1.12); }
    70%      { transform: translate(40px,-30px) scale(0.9); }
  }
  @keyframes fadeSlideUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(20px) scale(0.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes glowPulse {
    0%,100% { opacity:.5; }
    50%      { opacity:1; }
  }
  @keyframes scanMove {
    from { transform:translateY(-100%); }
    to   { transform:translateY(100vh); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes bobble {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-5px); }
  }
  @keyframes shimmerBtn {
    from { left:-80%; }
    to   { left:150%; }
  }
  @keyframes popIn {
    0%   { transform:scale(0); opacity:0; }
    70%  { transform:scale(1.15); }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-8px); }
    40%     { transform:translateX(8px); }
    60%     { transform:translateX(-5px); }
    80%     { transform:translateX(5px); }
  }

  .page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    background: #07070F;
    position: relative; overflow: hidden;
  }

  /* ── BACKGROUND ── */
  .bg-orb {
    position: absolute; border-radius: 50%;
    filter: blur(100px); pointer-events: none; z-index: 0;
  }
  .orb-v {
    width: 600px; height: 600px; top: -160px; left: -160px;
    background: radial-gradient(circle, rgba(167,139,250,.22) 0%, transparent 70%);
    animation: drift1 18s ease-in-out infinite;
  }
  .orb-p {
    width: 500px; height: 500px; bottom: -140px; right: -120px;
    background: radial-gradient(circle, rgba(244,114,182,.18) 0%, transparent 70%);
    animation: drift2 20s ease-in-out infinite;
  }
  .orb-b {
    width: 340px; height: 340px; top: 55%; right: 18%;
    background: radial-gradient(circle, rgba(96,165,250,.09) 0%, transparent 70%);
    animation: drift1 24s ease-in-out infinite reverse;
  }

  .bg-grid {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(167,139,250,.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,.028) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  .bg-scan {
    position: absolute; inset: 0; z-index: 1;
    pointer-events: none; overflow: hidden;
  }
  .bg-scan::after {
    content: '';
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,.07), transparent);
    animation: scanMove 9s linear infinite;
  }

  /* ── PARTICLES ── */
  .particle {
    position: absolute; border-radius: 50%;
    pointer-events: none; z-index: 1;
  }

  /* ── CONTAINER ── */
  .wrap {
    position: relative; z-index: 10;
    width: 100%; max-width: 450px; padding: 24px;
    animation: fadeSlideUp .65s cubic-bezier(.16,1,.3,1) both;
  }

  /* ── LOGO AREA ── */
  .logo-area {
    text-align: center; margin-bottom: 28px;
  }

  .logo-ring {
    display: inline-flex; align-items: center; justify-content: center;
    width: 68px; height: 68px; border-radius: 22px;
    background: linear-gradient(145deg, #A78BFA, #F472B6);
    box-shadow:
      0 0 0 1px rgba(167,139,250,.35),
      0 0 30px rgba(167,139,250,.35),
      0 0 80px rgba(167,139,250,.14);
    margin-bottom: 18px; position: relative;
    animation: glowPulse 3.5s ease-in-out infinite;
  }

  .brand-name {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.85rem; color: #EEEAF8;
    letter-spacing: -.045em; line-height: 1; margin-bottom: 6px;
  }

  .brand-tag {
    font-family: 'Syne Mono', monospace; font-size: .57rem;
    color: #2E2C44; letter-spacing: .24em; text-transform: uppercase;
  }

  .pills-row {
    display: flex; flex-wrap: wrap; gap: 6px;
    justify-content: center; margin-top: 14px;
  }

  .pill {
    font-family: 'Syne Mono', monospace; font-size: .55rem;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 4px 13px; border-radius: 99px; border: 1px solid;
  }

  /* ── CARD ── */
  .card {
    background: rgba(12,12,22,.88);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 24px; padding: 36px 32px;
    position: relative; overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(167,139,250,.04),
      0 28px 70px rgba(0,0,0,.75),
      inset 0 1px 0 rgba(255,255,255,.05);
    animation: cardIn .65s .08s cubic-bezier(.16,1,.3,1) both;
  }

  .card-line {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #A78BFA 30%, #F472B6 70%, transparent);
    animation: glowPulse 3s ease-in-out infinite;
  }

  .card-glow {
    position: absolute; top: -80px; right: -80px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(167,139,250,.09) 0%, transparent 70%);
    pointer-events: none;
  }

  .card-h {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 1.25rem; color: #EEEAF8;
    margin-bottom: 3px; position: relative;
  }
  .card-sub {
    font-size: .875rem; color: #6B6888; margin-bottom: 26px; position: relative;
  }

  /* ── INPUTS ── */
  .field { position: relative; margin-bottom: 14px; }

  .field-label {
    font-family: 'Syne Mono', monospace; font-size: .57rem;
    color: #2E2C44; text-transform: uppercase; letter-spacing: .13em;
    margin-bottom: 6px; display: block;
    transition: color .2s;
  }
  .field:focus-within .field-label { color: #A78BFA; }

  .field-input {
    width: 100%;
    background: rgba(18,18,30,.85);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 11px; color: #EEEAF8;
    font-family: 'Outfit', sans-serif; font-size: .9rem;
    padding: 13px 44px 13px 15px; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .field-input::placeholder { color: #2E2C44; }
  .field-input:focus {
    border-color: rgba(167,139,250,.55);
    background: rgba(10,10,20,.9);
    box-shadow: 0 0 0 3px rgba(167,139,250,.13), 0 0 22px rgba(167,139,250,.06);
  }
  .field-input.filled { border-color: rgba(167,139,250,.22); }
  .field-input.err-border {
    border-color: rgba(244,114,182,.5);
    box-shadow: 0 0 0 3px rgba(244,114,182,.1);
    animation: shake .4s ease;
  }

  .field-icon {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    color: #2E2C44; display: flex; align-items: center;
    transition: color .2s;
  }
  .field:focus-within .field-icon { color: #A78BFA; }
  .field-icon.btn-icon { cursor: pointer; }
  .field-icon.btn-icon:hover { color: #C4B5FD !important; }

  /* ── BOTTOM ROW ── */
  .bottom-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px; margin-top: 2px;
  }

  .chk-wrap {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; user-select: none;
    font-size: .82rem; color: #6B6888;
    transition: color .15s;
  }
  .chk-wrap:hover { color: #EEEAF8; }

  .chk-box {
    width: 16px; height: 16px; border-radius: 5px;
    border: 1px solid rgba(255,255,255,.12);
    background: rgba(18,18,30,.85);
    display: flex; align-items: center; justify-content: center;
    transition: all .18s; flex-shrink: 0;
  }
  .chk-box.on {
    background: linear-gradient(135deg, #A78BFA, #F472B6);
    border-color: transparent;
    box-shadow: 0 0 10px rgba(167,139,250,.4);
  }
  .chk-tick { animation: popIn .25s cubic-bezier(.16,1,.3,1); }

  .forgot-btn {
    background: none; border: none; padding: 0;
    font-family: 'Outfit', sans-serif; font-size: .82rem;
    color: #A78BFA; cursor: pointer; transition: color .2s;
  }
  .forgot-btn:hover { color: #C4B5FD; }

  /* ── PRIMARY BUTTON ── */
  .btn-primary {
    width: 100%; padding: 14px; border-radius: 11px; border: none;
    cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: .93rem; color: #fff; letter-spacing: .01em;
    background: linear-gradient(135deg, #A78BFA, #F472B6);
    box-shadow: 0 4px 22px rgba(167,139,250,.3);
    transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(167,139,250,.48);
  }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .btn-primary::after {
    content: '';
    position: absolute; top: 0; bottom: 0; width: 55%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
    transform: skewX(-22deg);
    animation: shimmerBtn 3.5s ease-in-out infinite;
  }

  .spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0;
  }

  /* ── DIVIDER ── */
  .divider-row {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0;
    font-family: 'Syne Mono', monospace; font-size: .57rem;
    color: #2E2C44; letter-spacing: .14em; text-transform: uppercase;
  }
  .div-line { flex: 1; height: 1px; background: rgba(255,255,255,.06); }

  /* ── SECONDARY BUTTON ── */
  .btn-sec {
    width: 100%; padding: 13px; border-radius: 11px;
    border: 1px solid rgba(255,255,255,.08); cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: .875rem;
    color: #6B6888; background: rgba(18,18,30,.5);
    transition: all .18s ease;
  }
  .btn-sec:hover {
    border-color: rgba(167,139,250,.28); color: #EEEAF8;
    background: rgba(18,18,30,.85);
    box-shadow: 0 0 22px rgba(167,139,250,.07);
  }

  /* ── ALERT BANNERS ── */
  .alert {
    display: flex; align-items: center; gap: 9px;
    border-radius: 10px; padding: 10px 14px;
    margin-bottom: 16px; font-size: .82rem;
    animation: fadeSlideUp .22s ease;
  }
  .alert-err {
    background: rgba(244,114,182,.07); border: 1px solid rgba(244,114,182,.22);
    color: #F9A8D4;
  }
  .alert-ok {
    background: rgba(52,211,153,.07); border: 1px solid rgba(52,211,153,.22);
    color: #6EE7B7;
  }

  /* ── FOOTER ── */
  .footer-note {
    text-align: center; margin-top: 18px;
    font-family: 'Syne Mono', monospace; font-size: .56rem;
    color: #2E2C44; letter-spacing: .1em;
  }
`;

/* ─────────────────────────── tiny SVG icons ──────────────────────────────── */
const IconStack = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17l10 5 10-5" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12l10 5 10-5" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAt = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconKey = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="15" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13 10l8 0M17 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconEye = ({ closed }) => closed ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const IconCheck = () => (
  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconOk = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─────────────────────────── particles (static) ──────────────────────────── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${((i * 19.3 + 7) % 100).toFixed(1)}%`,
  top:  `${((i * 27.7 + 11) % 100).toFixed(1)}%`,
  size: `${((i % 3) + 1.5).toFixed(1)}px`,
  op:   (0.07 + (i % 6) * 0.045).toFixed(2),
  col:  ["rgba(167,139,250,.7)", "rgba(244,114,182,.6)", "rgba(96,165,250,.55)"][i % 3],
}));

/* ─────────────────────────── PILLS config ─────────────────────────────────── */
const PILLS = [
  { label: "Cartoon",    c: "#A78BFA", bg: "rgba(167,139,250,.08)", b: "rgba(167,139,250,.22)", delay: "0s" },
  { label: "Watercolor", c: "#60A5FA", bg: "rgba(96,165,250,.08)",  b: "rgba(96,165,250,.22)",  delay: ".35s" },
  { label: "Neon Glow",  c: "#F472B6", bg: "rgba(244,114,182,.08)", b: "rgba(244,114,182,.22)", delay: ".7s" },
  { label: "+7 more",    c: "#34D399", bg: "rgba(52,211,153,.08)",  b: "rgba(52,211,153,.22)",  delay: "1.05s" },
];

/* ═══════════════════════════ MAIN COMPONENT ══════════════════════════════════ */
export default function App() {
  const [id,       setId]       = useState("");
  const [pw,       setPw]       = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [page,     setPage]     = useState("login"); // "login" | "register"

  // clear alerts when typing
  const handleId = v => { setId(v); setError(""); };
  const handlePw = v => { setPw(v); setError(""); };

  const handleLogin = async () => {
    setError(""); setSuccess("");
    if (!id || !pw) { setError("Please fill in both fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1300));
    setLoading(false);
    // ── replace below with: const res = await login_user(id, pw); ──
    setError("Invalid credentials. (Demo – connect to your backend)");
  };

  if (page === "register") {
    return (
      <>
        <style>{css}</style>
        <div className="page">
          {PARTICLES.map(p => (
            <div key={p.id} className="particle" style={{ left:p.left, top:p.top, width:p.size, height:p.size, opacity:p.op, background:p.col }} />
          ))}
          <div className="bg-orb orb-v" /><div className="bg-orb orb-p" /><div className="bg-orb orb-b" />
          <div className="bg-grid" /><div className="bg-scan" />
          <div className="wrap" style={{ maxWidth:480 }}>
            <div className="logo-area">
              <div className="logo-ring"><IconStack /></div>
              <div className="brand-name">CartoonizeMe</div>
              <div className="brand-tag">Create your free account</div>
            </div>
            <div className="card">
              <div className="card-line" /><div className="card-glow" />
              <div className="card-h">Join CartoonizeMe</div>
              <div className="card-sub">Start transforming your photos today ✨</div>
              <div className="field">
                <label className="field-label">Username</label>
                <input className="field-input" placeholder="Choose a username" />
                <span className="field-icon"><IconAt /></span>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="field-input" placeholder="your@email.com" />
                <span className="field-icon"><IconAt /></span>
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" placeholder="Create a strong password" />
                <span className="field-icon"><IconKey /></span>
              </div>
              <div style={{ height: 8 }} />
              <button className="btn-primary">Create Account <IconArrow /></button>
              <div className="divider-row"><div className="div-line" /> Already have an account? <div className="div-line" /></div>
              <button className="btn-sec" onClick={() => setPage("login")}>Sign In Instead</button>
            </div>
            <div className="footer-note">10 AI effects · No watermarks · Free forever</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* ── bg ── */}
        {PARTICLES.map(p => (
          <div key={p.id} className="particle"
            style={{ left:p.left, top:p.top, width:p.size, height:p.size, opacity:p.op, background:p.col }} />
        ))}
        <div className="bg-orb orb-v" />
        <div className="bg-orb orb-p" />
        <div className="bg-orb orb-b" />
        <div className="bg-grid" />
        <div className="bg-scan" />

        <div className="wrap">

          {/* ── LOGO ── */}
          <div className="logo-area">
            <div className="logo-ring"><IconStack /></div>
            <div className="brand-name">CartoonizeMe</div>
            <div className="brand-tag">AI Art Studio · 10 Effects</div>
            <div className="pills-row">
              {PILLS.map((p, i) => (
                <span key={i} className="pill" style={{
                  color: p.c, background: p.bg, borderColor: p.b,
                  animation: `bobble 3.2s ${p.delay} ease-in-out infinite`,
                }}>{p.label}</span>
              ))}
            </div>
          </div>

          {/* ── CARD ── */}
          <div className="card">
            <div className="card-line" />
            <div className="card-glow" />

            <div className="card-h">Welcome back</div>
            <div className="card-sub">Sign in to continue creating magic ✨</div>

            {/* alerts */}
            {error && (
              <div className="alert alert-err">
                <IconWarn /> {error}
              </div>
            )}
            {success && (
              <div className="alert alert-ok">
                <IconOk /> {success}
              </div>
            )}

            {/* Email / Username */}
            <div className="field">
              <label className="field-label">Email or Username</label>
              <input
                className={`field-input ${id ? "filled" : ""} ${error && !pw ? "err-border" : ""}`}
                placeholder="your@email.com or username"
                value={id}
                onChange={e => handleId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="username"
              />
              <span className="field-icon">
                {id.length > 2
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <IconAt />}
              </span>
            </div>

            {/* Password */}
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="field-label">Password</label>
              <input
                className={`field-input ${pw ? "filled" : ""} ${error && !id ? "err-border" : ""}`}
                type={showPw ? "text" : "password"}
                placeholder="Your secret password"
                value={pw}
                onChange={e => handlePw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
              />
              <span className="field-icon btn-icon" onClick={() => setShowPw(v => !v)}>
                <IconEye closed={showPw} />
              </span>
            </div>

            {/* remember + forgot */}
            <div className="bottom-row">
              <div className="chk-wrap" onClick={() => setRemember(v => !v)}>
                <div className={`chk-box ${remember ? "on" : ""}`}>
                  {remember && <span className="chk-tick"><IconCheck /></span>}
                </div>
                Remember me
              </div>
              <button className="forgot-btn">Forgot password?</button>
            </div>

            {/* Sign In */}
            <button className="btn-primary" onClick={handleLogin} disabled={loading}>
              {loading
                ? <><div className="spinner" /> Authenticating...</>
                : <>Sign In <IconArrow /></>}
            </button>

            {/* divider + register */}
            <div className="divider-row">
              <div className="div-line" /> New here? <div className="div-line" />
            </div>
            <button className="btn-sec" onClick={() => setPage("register")}>
              Create Free Account
            </button>
          </div>

          <div className="footer-note">10 AI effects · No watermarks · Free forever</div>
        </div>
      </div>
    </>
  );
}