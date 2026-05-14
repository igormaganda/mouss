<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CS Ternes Paris Ouest – Sport & Éducation IEF</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
<style>
/* ============================================================
   VARIABLES & RESET
============================================================ */
:root {
  --navy:    #0B1F3A;
  --navy-mid:#122850;
  --navy-lt: #1A3660;
  --gold:    #E8A020;
  --gold-lt: #F5BE5A;
  --white:   #FFFFFF;
  --off:     #F4F6FA;
  --muted:   #8899BB;
  --text:    #1C2D4A;
  --card-bg: #FFFFFF;
  --radius:  14px;
  --shadow:  0 4px 28px rgba(11,31,58,.10);
  --shadow-lg:0 12px 48px rgba(11,31,58,.18);
  --transition: .28s cubic-bezier(.4,0,.2,1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--white);
  color: var(--text);
  overflow-x: hidden;
  line-height: 1.65;
}

img { display: block; max-width: 100%; }

a { color: inherit; text-decoration: none; }

/* ============================================================
   UTILITIES
============================================================ */
.container { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

.label {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: .72rem; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; color: var(--gold);
  padding: 4px 12px; border-radius: 99px;
  border: 1.5px solid var(--gold);
  margin-bottom: 18px;
}

.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  color: var(--navy);
  letter-spacing: .03em;
}

.section-sub {
  font-size: 1.05rem; color: #4A5F82; max-width: 580px;
  margin-top: 12px; line-height: 1.7;
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: 'DM Sans', sans-serif; font-weight: 700;
  font-size: .95rem; letter-spacing: .02em;
  padding: 14px 28px; border-radius: 99px;
  cursor: pointer; border: none; transition: var(--transition);
  white-space: nowrap;
}

.btn-primary {
  background: var(--gold); color: var(--navy);
}
.btn-primary:hover { background: var(--gold-lt); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,160,32,.35); }

.btn-outline {
  background: transparent; color: var(--white);
  border: 2px solid rgba(255,255,255,.55);
}
.btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,.1); transform: translateY(-2px); }

.btn-navy {
  background: var(--navy); color: var(--white);
}
.btn-navy:hover { background: var(--navy-mid); transform: translateY(-2px); box-shadow: var(--shadow); }

/* fade-in on scroll */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* ============================================================
   HEADER / NAV
============================================================ */
header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(11,31,58,.96);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,.07);
  transition: var(--transition);
}

.nav-inner {
  display: flex; align-items: center; gap: 0;
  height: 68px;
}

/* LOGO */
.logo {
  display: flex; align-items: center; gap: 12px;
  flex-shrink: 0;
  margin-right: auto;
}
.logo-mark {
  width: 42px; height: 42px; border-radius: 10px;
  background: var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.35rem; color: var(--navy); letter-spacing: .04em;
}
.logo-text { line-height: 1.2; }
.logo-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem; color: var(--white); letter-spacing: .08em;
}
.logo-tagline { font-size: .65rem; color: var(--muted); letter-spacing: .06em; text-transform: uppercase; }

/* NAV LINKS */
nav { display: flex; align-items: center; gap: 2px; margin-right: 20px; }

nav a {
  font-size: .83rem; font-weight: 500; color: rgba(255,255,255,.72);
  padding: 8px 13px; border-radius: 8px;
  transition: var(--transition); white-space: nowrap;
}
nav a:hover { color: var(--white); background: rgba(255,255,255,.08); }

.nav-cta { flex-shrink: 0; }

/* HAMBURGER */
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px; margin-left: 16px;
}
.hamburger span {
  display: block; width: 24px; height: 2px;
  background: var(--white); border-radius: 2px;
  transition: var(--transition);
}

/* Mobile nav */
.mobile-nav {
  display: none; flex-direction: column;
  background: var(--navy); border-top: 1px solid rgba(255,255,255,.06);
  padding: 16px 24px 24px;
}
.mobile-nav a {
  font-size: .95rem; color: rgba(255,255,255,.8);
  padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.05);
  display: block;
}
.mobile-nav a:last-child { border-bottom: none; }

@media(max-width: 900px){
  nav { display: none; }
  .hamburger { display: flex; }
  .nav-cta { display: none; }
}
@media(max-width: 900px){ .mobile-nav.open { display: flex; } }

/* ============================================================
   HERO
============================================================ */
.hero {
  min-height: 100vh;
  background: linear-gradient(140deg, #0B1F3A 0%, #122850 55%, #1D3B72 100%);
  display: flex; flex-direction: column; justify-content: center;
  padding-top: 68px; position: relative; overflow: hidden;
}

/* Decorative shapes */
.hero::before {
  content: '';
  position: absolute; top: -100px; right: -120px;
  width: 560px; height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232,160,32,.18) 0%, transparent 70%);
  pointer-events: none;
}
.hero::after {
  content: '';
  position: absolute; bottom: -80px; left: -60px;
  width: 380px; height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 70%);
  pointer-events: none;
}

.hero-grid {
  display: grid; grid-template-columns: 1fr 440px;
  gap: 60px; align-items: center;
  padding: 80px 0;
}

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(232,160,32,.15); border: 1.5px solid rgba(232,160,32,.4);
  color: var(--gold-lt); font-size: .75rem; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  padding: 6px 14px; border-radius: 99px; margin-bottom: 26px;
}
.hero-badge::before { content: '●'; font-size: .5rem; color: var(--gold); animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.hero h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 6.5vw, 5.2rem);
  line-height: 1.0;
  color: var(--white);
  letter-spacing: .04em;
  margin-bottom: 24px;
}
.hero h1 em { color: var(--gold); font-style: normal; }

.hero-sub {
  font-size: 1.1rem; color: rgba(255,255,255,.72);
  max-width: 500px; line-height: 1.75; margin-bottom: 36px;
}

.hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }

.hero-pill {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  border-radius: 99px; padding: 8px 18px;
  font-size: .85rem; color: rgba(255,255,255,.7);
}
.hero-pill strong { color: var(--white); }

/* HERO CARD */
.hero-card {
  background: rgba(255,255,255,.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 22px;
  padding: 32px;
  display: flex; flex-direction: column; gap: 16px;
}

.hc-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem; color: var(--white); letter-spacing: .06em;
  border-bottom: 1px solid rgba(255,255,255,.1);
  padding-bottom: 14px; margin-bottom: 4px;
}

.hc-row {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.06);
}
.hc-row:last-child { border-bottom: none; padding-bottom: 0; }

.hc-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(232,160,32,.15); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}
.hc-info { flex: 1; }
.hc-day { font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gold); }
.hc-desc { font-size: .9rem; color: rgba(255,255,255,.82); font-weight: 500; }
.hc-sub { font-size: .78rem; color: var(--muted); margin-top: 2px; }

.hc-footer {
  margin-top: 6px; background: var(--gold); border-radius: 10px;
  padding: 14px 16px; text-align: center;
}
.hc-footer strong { display: block; font-size: 1.4rem; color: var(--navy); font-family:'Bebas Neue',sans-serif; letter-spacing:.04em; }
.hc-footer span { font-size: .75rem; color: var(--navy); font-weight: 600; opacity: .75; }

@media(max-width: 960px){ .hero-grid { grid-template-columns: 1fr; } .hero-card { display:none; } }

/* ============================================================
   CONCEPT SECTION
============================================================ */
.concept {
  background: var(--off); padding: 96px 0;
}

.concept-inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}

.concept-visual {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}

.cv-card {
  background: var(--white); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 22px;
  display: flex; flex-direction: column; gap: 10px;
  transition: transform var(--transition), box-shadow var(--transition);
}
.cv-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.cv-card.accent { background: var(--navy); }

.cv-icon { font-size: 1.6rem; }
.cv-label { font-weight: 700; font-size: .9rem; color: var(--navy); }
.cv-card.accent .cv-label { color: var(--white); }
.cv-num {
  font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem;
  color: var(--gold); letter-spacing: .04em; line-height: 1;
}

.concept-content .section-title { margin-bottom: 16px; }

.concept-points { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
.concept-point {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 16px; border-radius: 10px;
  background: var(--white); box-shadow: var(--shadow);
  transition: var(--transition);
}
.concept-point:hover { box-shadow: var(--shadow-lg); }
.cp-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: rgba(232,160,32,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.cp-text strong { display: block; font-size: .9rem; color: var(--navy); font-weight: 700; }
.cp-text span { font-size: .83rem; color: #607090; }

@media(max-width: 900px){ .concept-inner { grid-template-columns:1fr; } .concept-visual { display:none; } }

/* ============================================================
   ACTIVITIES (3 cards)
============================================================ */
.activities { padding: 96px 0; }

.activities-head { text-align: center; margin-bottom: 56px; }
.activities-head .section-sub { margin: 12px auto 0; text-align: center; }

.act-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

.act-card {
  border-radius: 20px; overflow: hidden;
  box-shadow: var(--shadow);
  display: flex; flex-direction: column;
  transition: transform var(--transition), box-shadow var(--transition);
  background: var(--white);
}
.act-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }

.act-thumb {
  height: 180px; display: flex; align-items: center; justify-content: center;
  font-size: 3.5rem; position: relative; overflow: hidden;
}
.act-thumb.blue  { background: linear-gradient(135deg, #0B1F3A 0%, #1D3B72 100%); }
.act-thumb.gold  { background: linear-gradient(135deg, #B8720E 0%, #E8A020 100%); }
.act-thumb.slate { background: linear-gradient(135deg, #1E3A5F 0%, #2A5298 100%); }

.act-body { padding: 26px; flex: 1; display: flex; flex-direction: column; }
.act-tag {
  font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 10px;
}
.act-body h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.45rem; letter-spacing: .04em; color: var(--navy); margin-bottom: 10px; }
.act-body p { font-size: .88rem; color: #607090; line-height: 1.65; flex: 1; }
.act-footer { margin-top: 20px; display: flex; align-items: center; justify-content: space-between; }
.act-footer a {
  font-size: .83rem; font-weight: 700; color: var(--navy);
  display: flex; align-items: center; gap: 5px;
  transition: gap var(--transition);
}
.act-footer a:hover { gap: 10px; color: var(--gold); }
.act-badge {
  font-size: .72rem; font-weight: 700; padding: 3px 10px;
  border-radius: 99px; background: var(--off); color: var(--navy);
}

@media(max-width: 860px){ .act-grid { grid-template-columns: 1fr 1fr; } }
@media(max-width: 560px){ .act-grid { grid-template-columns: 1fr; } }

/* ============================================================
   PLANNING SECTION
============================================================ */
.planning {
  background: var(--navy);
  padding: 96px 0;
  position: relative; overflow: hidden;
}
.planning::before {
  content: '';
  position: absolute; right: -80px; top: -80px;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(232,160,32,.12) 0%, transparent 70%);
  pointer-events: none;
}

.planning-head { margin-bottom: 56px; }
.planning-head .section-title { color: var(--white); }
.planning-head .section-sub { color: rgba(255,255,255,.55); }

.plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.plan-day {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 18px; padding: 30px 26px;
  transition: var(--transition); cursor: default;
}
.plan-day:hover {
  background: rgba(232,160,32,.1);
  border-color: rgba(232,160,32,.3);
  transform: translateY(-4px);
}
.plan-day.featured {
  background: var(--gold);
  border-color: var(--gold);
}

.pd-dayname {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem; letter-spacing: .12em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 18px;
}
.plan-day.featured .pd-dayname { color: var(--navy); }

.pd-icon { font-size: 2rem; margin-bottom: 14px; display: block; }

.pd-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem; color: var(--white); letter-spacing: .04em;
  margin-bottom: 8px;
}
.plan-day.featured .pd-title { color: var(--navy); }

.pd-desc { font-size: .86rem; color: rgba(255,255,255,.6); line-height: 1.6; }
.plan-day.featured .pd-desc { color: rgba(11,31,58,.7); }

.pd-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.pd-tag {
  font-size: .68rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 99px;
  background: rgba(255,255,255,.08); color: rgba(255,255,255,.65);
}
.plan-day.featured .pd-tag { background: rgba(11,31,58,.12); color: var(--navy); }

@media(max-width: 760px){ .plan-grid { grid-template-columns: 1fr; } }

/* ============================================================
   MAGAZINE
============================================================ */
.magazine { padding: 96px 0; background: var(--off); }

.magazine-head { margin-bottom: 52px; }

.mag-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: auto auto; gap: 24px; }

.mag-card {
  background: var(--white); border-radius: 18px;
  box-shadow: var(--shadow); overflow: hidden;
  display: flex; flex-direction: column;
  transition: var(--transition);
}
.mag-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }

.mag-card.featured { grid-row: span 2; }

.mag-thumb {
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; flex-shrink: 0;
}
.mag-card.featured .mag-thumb { height: 220px; }
.mag-card:not(.featured) .mag-thumb { height: 110px; }

.mag-thumb.t1 { background: linear-gradient(135deg, #0B1F3A, #2A5298); }
.mag-thumb.t2 { background: linear-gradient(135deg, #1E3A5F, #0B3D91); }
.mag-thumb.t3 { background: linear-gradient(135deg, #7B3F00, #E8A020); }
.mag-thumb.t4 { background: linear-gradient(135deg, #0A3020, #1A8050); }

.mag-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
.mag-cat {
  font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 8px;
}
.mag-card.featured .mag-body h3 { font-family: 'DM Serif Display', serif; font-size: 1.35rem; color: var(--navy); line-height: 1.3; margin-bottom: 12px; }
.mag-card:not(.featured) .mag-body h3 { font-size: 1rem; color: var(--navy); font-weight: 700; line-height: 1.35; margin-bottom: 8px; }

.mag-excerpt { font-size: .85rem; color: #607090; line-height: 1.65; flex: 1; }
.mag-meta { margin-top: 16px; font-size: .75rem; color: var(--muted); display: flex; gap: 12px; align-items: center; }
.mag-meta span::before { content: '·'; margin-right: 12px; }
.mag-meta span:first-child::before { display: none; }
.mag-read {
  margin-top: 16px; font-size: .83rem; font-weight: 700;
  color: var(--navy); display: flex; align-items: center; gap: 5px;
  transition: gap var(--transition), color var(--transition);
}
.mag-card:hover .mag-read { gap: 10px; color: var(--gold); }

@media(max-width: 760px){ .mag-grid { grid-template-columns: 1fr; } .mag-card.featured { grid-row: auto; } }

/* ============================================================
   GAMIFICATION
============================================================ */
.gamification { padding: 96px 0; }

.gami-head { text-align: center; margin-bottom: 56px; }
.gami-head .section-sub { margin: 12px auto 0; text-align: center; }

.gami-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.gami-card {
  border-radius: 18px; padding: 28px 22px;
  background: var(--white); box-shadow: var(--shadow);
  text-align: center;
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: default;
}
.gami-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }

.gami-icon { font-size: 2.5rem; margin-bottom: 14px; display: block; }

.gami-card h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem; letter-spacing: .05em; color: var(--navy); margin-bottom: 8px;
}
.gami-card p { font-size: .85rem; color: #607090; line-height: 1.6; }

.gami-bar {
  margin-top: 12px; background: var(--off); border-radius: 99px; height: 6px; overflow: hidden;
}
.gami-fill { height: 100%; border-radius: 99px; background: var(--gold); }

.gami-cta { text-align: center; margin-top: 48px; }

@media(max-width: 860px){ .gami-grid { grid-template-columns: 1fr 1fr; } }
@media(max-width: 520px){ .gami-grid { grid-template-columns: 1fr; } }

/* ============================================================
   PRICING / OFFRE
============================================================ */
.pricing {
  background: linear-gradient(140deg, #0B1F3A 0%, #1A3660 100%);
  padding: 96px 0;
}

.pricing-inner {
  display: grid; grid-template-columns: 1fr 480px; gap: 64px; align-items: center;
}

.pricing-left .section-title { color: var(--white); margin-bottom: 28px; }

.included-list { display: flex; flex-direction: column; gap: 14px; }
.included-item {
  display: flex; align-items: center; gap: 14px;
  color: rgba(255,255,255,.82); font-size: .9rem;
}
.included-item::before {
  content: '✓'; width: 26px; height: 26px;
  border-radius: 50%; background: rgba(232,160,32,.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: .75rem; color: var(--gold); font-weight: 700;
}

.pricing-card {
  background: var(--white); border-radius: 24px;
  box-shadow: 0 24px 72px rgba(0,0,0,.25);
  padding: 40px 36px; display: flex; flex-direction: column; gap: 24px;
}

.pricing-card .pc-tag {
  font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--gold);
}
.pricing-card .pc-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: var(--navy); letter-spacing: .04em;
}
.pc-price {
  display: flex; align-items: flex-end; gap: 4px;
  border-top: 1px solid var(--off); border-bottom: 1px solid var(--off);
  padding: 20px 0;
}
.pc-amount { font-family: 'Bebas Neue', sans-serif; font-size: 3.8rem; color: var(--navy); line-height: 1; letter-spacing: .02em; }
.pc-currency { font-size: 1.4rem; color: var(--navy); align-self: flex-start; margin-top: 8px; font-weight: 300; }
.pc-period { font-size: .85rem; color: var(--muted); margin-bottom: 6px; }

.pc-features { display: flex; flex-direction: column; gap: 12px; }
.pc-feat {
  display: flex; align-items: center; gap: 12px;
  font-size: .88rem; color: var(--text);
}
.pc-feat::before {
  content: ''; width: 8px; height: 8px; border-radius: 50%;
  background: var(--gold); flex-shrink: 0;
}

.pc-warning {
  background: rgba(232,160,32,.1); border: 1px solid rgba(232,160,32,.3);
  border-radius: 10px; padding: 12px 14px;
  font-size: .82rem; color: #7A5000; font-weight: 600; text-align: center;
}

@media(max-width: 900px){ .pricing-inner { grid-template-columns: 1fr; } .pricing-card { max-width: 400px; margin: 0 auto; } }

/* ============================================================
   COMMUNITY
============================================================ */
.community { padding: 96px 0; background: var(--off); }

.community-inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}

.comm-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.comm-card {
  background: var(--white); border-radius: 16px;
  box-shadow: var(--shadow); padding: 22px 18px;
  display: flex; flex-direction: column; gap: 10px;
  transition: var(--transition);
}
.comm-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.comm-card.wide { grid-column: span 2; flex-direction: row; align-items: center; gap: 16px; }

.cc-icon { font-size: 1.8rem; }
.cc-title { font-weight: 700; font-size: .92rem; color: var(--navy); }
.cc-desc { font-size: .82rem; color: #607090; }

.comm-content .section-title { margin-bottom: 16px; }

.testimonials { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }

.testi {
  background: var(--white); border-radius: 14px; box-shadow: var(--shadow);
  padding: 20px 22px;
}
.testi-text { font-family: 'DM Serif Display', serif; font-style: italic; font-size: .95rem; color: var(--text); line-height: 1.6; margin-bottom: 14px; }
.testi-author { display: flex; align-items: center; gap: 10px; }
.testi-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--navy); display: flex; align-items: center; justify-content: center;
  font-size: .8rem; color: var(--white); font-weight: 700; flex-shrink: 0;
}
.testi-info strong { display: block; font-size: .82rem; color: var(--navy); }
.testi-info span { font-size: .75rem; color: var(--muted); }

@media(max-width: 860px){ .community-inner { grid-template-columns: 1fr; } .comm-cards { display: none; } }

/* ============================================================
   FAQ
============================================================ */
.faq { padding: 96px 0; }

.faq-head { text-align: center; margin-bottom: 52px; }
.faq-head .section-sub { margin: 12px auto 0; text-align: center; }

.faq-list { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }

.faq-item {
  background: var(--white); border: 1px solid #E0E8F4;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 10px rgba(11,31,58,.05);
}

.faq-q {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 20px 24px; text-align: left;
  font-family: 'DM Sans', sans-serif; font-size: .95rem; font-weight: 700; color: var(--navy);
  transition: var(--transition);
}
.faq-q:hover { background: var(--off); }
.faq-q.open { color: var(--gold); }

.faq-icon {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--off); border: 1.5px solid #C5D4EC;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: .85rem; color: var(--navy);
  transition: var(--transition);
}
.faq-q.open .faq-icon { background: var(--gold); border-color: var(--gold); color: var(--navy); transform: rotate(45deg); }

.faq-a {
  max-height: 0; overflow: hidden;
  transition: max-height .4s ease, padding .3s ease;
  padding: 0 24px;
}
.faq-a.open {
  max-height: 300px; padding: 0 24px 20px;
}
.faq-a p { font-size: .9rem; color: #607090; line-height: 1.7; }

/* ============================================================
   FOOTER
============================================================ */
footer {
  background: var(--navy); padding: 64px 0 32px;
  border-top: 1px solid rgba(255,255,255,.06);
}

.footer-grid {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
  margin-bottom: 48px;
}

.footer-brand .logo { margin-bottom: 16px; }
.footer-brand p { font-size: .85rem; color: rgba(255,255,255,.5); line-height: 1.7; max-width: 260px; margin-bottom: 20px; }

.social-links { display: flex; gap: 10px; }
.social-link {
  width: 36px; height: 36px; border-radius: 8px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.08);
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; color: rgba(255,255,255,.6);
  transition: var(--transition);
}
.social-link:hover { background: rgba(232,160,32,.2); border-color: rgba(232,160,32,.4); color: var(--gold); }

.footer-col h4 {
  font-family: 'Bebas Neue', sans-serif; font-size: .95rem;
  letter-spacing: .1em; color: var(--white); margin-bottom: 18px;
}
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.footer-col li a { font-size: .83rem; color: rgba(255,255,255,.5); transition: color var(--transition); }
.footer-col li a:hover { color: var(--gold); }

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,.07);
  padding-top: 24px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}
.footer-bottom p { font-size: .78rem; color: rgba(255,255,255,.3); }

@media(max-width: 860px){ .footer-grid { grid-template-columns: 1fr 1fr; } }
@media(max-width: 520px){ .footer-grid { grid-template-columns: 1fr; } }

/* ============================================================
   PREINSCRIPTION CTA STRIP
============================================================ */
.cta-strip {
  background: var(--gold); padding: 48px 0;
}
.cta-strip-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
}
.cta-strip h2 {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem);
  color: var(--navy); letter-spacing: .04em;
}
.cta-strip p { font-size: .9rem; color: rgba(11,31,58,.7); margin-top: 4px; }

/* ============================================================
   ANIMATIONS
============================================================ */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(36px); }
  to   { opacity: 1; transform: none; }
}

.hero-content > * {
  opacity: 0; animation: slideUp .7s ease forwards;
}
.hero-content > *:nth-child(1) { animation-delay: .1s; }
.hero-content > *:nth-child(2) { animation-delay: .25s; }
.hero-content > *:nth-child(3) { animation-delay: .4s; }
.hero-content > *:nth-child(4) { animation-delay: .55s; }
.hero-content > *:nth-child(5) { animation-delay: .7s; }

.hero-card { animation: slideUp .8s ease .5s both; }

</style>
</head>
<body>

<!-- ============================================================
     HEADER
============================================================ -->
<header id="header">
  <div class="container">
    <div class="nav-inner">
      <!-- LOGO -->
      <a href="#" class="logo">
        <div class="logo-mark">CS</div>
        <div class="logo-text">
          <div class="logo-name">CS Ternes Paris Ouest</div>
          <div class="logo-tagline">Sport & Éducation IEF</div>
        </div>
      </a>

      <!-- NAV -->
      <nav>
        <a href="#">Accueil</a>
        <a href="#concept">Le Projet</a>
        <a href="#activities">Activités</a>
        <a href="#magazine">Magazine</a>
        <a href="#community">Communauté</a>
        <a href="#pricing">Inscriptions</a>
        <a href="#faq">Contact</a>
      </nav>

      <a href="#pricing" class="btn btn-primary nav-cta" style="font-size:.82rem;padding:10px 20px;">
        ✦ Préinscription
      </a>

      <!-- Hamburger -->
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <!-- Mobile nav -->
  <div class="mobile-nav" id="mobileNav">
    <a href="#">Accueil</a>
    <a href="#concept">Le Projet</a>
    <a href="#activities">Activités</a>
    <a href="#magazine">Magazine</a>
    <a href="#community">Communauté</a>
    <a href="#pricing">Inscriptions – 450 €/an</a>
    <a href="#faq">FAQ & Contact</a>
  </div>
</header>


<!-- ============================================================
     HERO
============================================================ -->
<section class="hero" id="home">
  <div class="container">
    <div class="hero-grid">
      <!-- LEFT CONTENT -->
      <div class="hero-content">
        <div class="hero-badge">Programme pilote · 30 places disponibles</div>

        <h1>La communauté<br><em>sport & éducation</em><br>des familles IEF.</h1>

        <p class="hero-sub">
          CS Ternes Paris Ouest réunit les familles pratiquant l'instruction en famille autour d'un projet unique : entraînements multisports, soutien scolaire, défis, stages et une communauté bienveillante.
        </p>

        <div class="hero-btns">
          <a href="#pricing" class="btn btn-primary">🏅 Rejoindre le programme pilote</a>
          <a href="#concept" class="btn btn-outline">Découvrir le projet →</a>
        </div>

        <div class="hero-pill">
          <span>🎯</span>
          <span><strong>30 places</strong> · Cotisation annuelle <strong>450 €</strong> · Démarrage septembre</span>
        </div>
      </div>

      <!-- RIGHT CARD -->
      <div class="hero-card">
        <div class="hc-title">📅 Organisation de la semaine</div>

        <div class="hc-row">
          <div class="hc-icon">📚</div>
          <div class="hc-info">
            <div class="hc-day">Lundi – Vendredi</div>
            <div class="hc-desc">Soutien scolaire en ligne</div>
            <div class="hc-sub">Cours interactifs, exercices, suivi personnalisé</div>
          </div>
        </div>

        <div class="hc-row">
          <div class="hc-icon">⚽</div>
          <div class="hc-info">
            <div class="hc-day">Mercredi après-midi</div>
            <div class="hc-desc">Entraînement multisports</div>
            <div class="hc-sub">Format UNSS · Terrain ou gymnase Paris Ouest</div>
          </div>
        </div>

        <div class="hc-row">
          <div class="hc-icon">🏆</div>
          <div class="hc-info">
            <div class="hc-day">Week-end</div>
            <div class="hc-desc">Challenges & Compétitions</div>
            <div class="hc-sub">Tournois, gamification, classements familles</div>
          </div>
        </div>

        <div class="hc-row">
          <div class="hc-icon">🏕️</div>
          <div class="hc-info">
            <div class="hc-day">Vacances scolaires</div>
            <div class="hc-desc">Stages thématiques</div>
            <div class="hc-sub">Tournois de fin de stage · Multi-activités</div>
          </div>
        </div>

        <div class="hc-footer">
          <strong>450 € / an</strong>
          <span>Tout inclus · Association loi 1901</span>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     CONCEPT
============================================================ -->
<section class="concept" id="concept">
  <div class="container">
    <div class="concept-inner">
      <!-- Visual cards -->
      <div class="concept-visual reveal">
        <div class="cv-card">
          <div class="cv-icon">👨‍👩‍👧‍👦</div>
          <div class="cv-label">Familles adhérentes</div>
          <div class="cv-num">30</div>
        </div>
        <div class="cv-card accent">
          <div class="cv-icon">🏅</div>
          <div class="cv-label" style="color:var(--gold)">Sports pratiqués</div>
          <div class="cv-num">6+</div>
        </div>
        <div class="cv-card">
          <div class="cv-icon">📆</div>
          <div class="cv-label">Jours de pratique</div>
          <div class="cv-num">52</div>
        </div>
        <div class="cv-card">
          <div class="cv-icon">📚</div>
          <div class="cv-label">Cotisation annuelle</div>
          <div class="cv-num" style="font-size:1.7rem">450€</div>
        </div>
      </div>

      <!-- Content -->
      <div class="concept-content reveal">
        <span class="label">✦ Le Projet</span>
        <h2 class="section-title">Une nouvelle organisation sport & éducation</h2>
        <p class="section-sub">
          CS Ternes Paris Ouest n'est pas un simple club sportif. C'est un écosystème complet conçu pour les familles qui éduquent à la maison, combinant pratique sportive régulière, soutien scolaire et vie communautaire.
        </p>

        <div class="concept-points">
          <div class="concept-point">
            <div class="cp-icon">🎓</div>
            <div class="cp-text">
              <strong>Complément éducatif structurant</strong>
              <span>Un cadre hebdomadaire qui soutient l'instruction en famille sans la remplacer</span>
            </div>
          </div>
          <div class="concept-point">
            <div class="cp-icon">🤝</div>
            <div class="cp-text">
              <strong>Socialisation réelle et bienveillante</strong>
              <span>Des liens durables entre familles partageant les mêmes valeurs éducatives</span>
            </div>
          </div>
          <div class="concept-point">
            <div class="cp-icon">🏅</div>
            <div class="cp-text">
              <strong>Cadre sportif reconnu et structuré</strong>
              <span>Créneaux UNSS, encadrement qualifié, progression sportive visible</span>
            </div>
          </div>
          <div class="concept-point">
            <div class="cp-icon">📰</div>
            <div class="cp-text">
              <strong>Un média d'information dédié</strong>
              <span>Actualités sport, éducation, IEF, cadre institutionnel et conseils familles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     ACTIVITIES
============================================================ -->
<section class="activities" id="activities">
  <div class="container">
    <div class="activities-head reveal">
      <span class="label">✦ Activités</span>
      <h2 class="section-title">Trois piliers, une cohérence</h2>
      <p class="section-sub">Chaque activité est pensée pour s'articuler avec les autres et offrir aux enfants IEF un rythme structurant et épanouissant.</p>
    </div>

    <div class="act-grid">
      <!-- Card 1 -->
      <div class="act-card reveal">
        <div class="act-thumb blue">📚</div>
        <div class="act-body">
          <div class="act-tag">Lundi – Vendredi</div>
          <h3>Soutien Scolaire en Ligne</h3>
          <p>Des séances de soutien structurées, adaptées au rythme de chaque enfant instruit en famille. Exercices interactifs, cours en direct et suivi personnalisé par des enseignants expérimentés.</p>
          <div class="act-footer">
            <a href="#pricing">Explorer l'offre →</a>
            <span class="act-badge">📡 En ligne</span>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="act-card reveal" style="transition-delay:.1s">
        <div class="act-thumb gold">⚽</div>
        <div class="act-body">
          <div class="act-tag">Mercredi après-midi</div>
          <h3>Mercredi Multisports</h3>
          <p>Entraînements collectifs sur le modèle UNSS : football, basketball, athlétisme, arts martiaux… Un programme varié pour développer les compétences motrices et l'esprit d'équipe.</p>
          <div class="act-footer">
            <a href="#planning">Voir le planning →</a>
            <span class="act-badge">📍 Paris Ouest</span>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="act-card reveal" style="transition-delay:.2s">
        <div class="act-thumb slate">🏆</div>
        <div class="act-body">
          <div class="act-tag">Week-end & Vacances</div>
          <h3>Challenges & Compétitions</h3>
          <p>Tournois inter-familles, défis gamifiés, stages thématiques pendant les vacances scolaires avec compétitions de fin de stage. La compétition bienveillante au service de la progression.</p>
          <div class="act-footer">
            <a href="#gamification">Voir la gamification →</a>
            <span class="act-badge">🎮 Gamification</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     PLANNING
============================================================ -->
<section class="planning" id="planning">
  <div class="container">
    <div class="planning-head reveal">
      <span class="label" style="color:var(--gold-lt);border-color:rgba(232,160,32,.4)">✦ Organisation</span>
      <h2 class="section-title">La semaine type d'un adhérent</h2>
      <p class="section-sub">Un rythme clair, structurant et compatible avec l'instruction en famille.</p>
    </div>

    <div class="plan-grid">
      <!-- Semaine -->
      <div class="plan-day reveal">
        <span class="pd-dayname">Lundi → Vendredi</span>
        <span class="pd-icon">📚</span>
        <h3 class="pd-title">Soutien Scolaire en Ligne</h3>
        <p class="pd-desc">Séances de soutien adaptées, exercices interactifs et suivi individualisé depuis chez soi. Flexible et complémentaire au programme IEF de la famille.</p>
        <div class="pd-tags">
          <span class="pd-tag">En ligne</span>
          <span class="pd-tag">Flexible</span>
          <span class="pd-tag">Suivi personnalisé</span>
        </div>
      </div>

      <!-- Mercredi -->
      <div class="plan-day featured reveal" style="transition-delay:.15s">
        <span class="pd-dayname">Mercredi après-midi</span>
        <span class="pd-icon">⚽</span>
        <h3 class="pd-title">Entraînement Multisports</h3>
        <p class="pd-desc">Le temps fort de la semaine. Terrain ou gymnase, encadrement qualifié, format UNSS. Football, basket, athlétisme selon les cycles. Socialisation garantie.</p>
        <div class="pd-tags">
          <span class="pd-tag">Paris Ouest</span>
          <span class="pd-tag">Format UNSS</span>
          <span class="pd-tag">6 sports</span>
        </div>
      </div>

      <!-- Week-end -->
      <div class="plan-day reveal" style="transition-delay:.3s">
        <span class="pd-dayname">Week-end</span>
        <span class="pd-icon">🏆</span>
        <h3 class="pd-title">Challenge, Match ou Gamification</h3>
        <p class="pd-desc">Tournois entre familles adhérentes, défis en ligne avec points et badges, ou compétitions physiques. La fierté de progresser ensemble, en famille.</p>
        <div class="pd-tags">
          <span class="pd-tag">Optionnel</span>
          <span class="pd-tag">Compétition douce</span>
          <span class="pd-tag">En famille</span>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     MAGAZINE
============================================================ -->
<section class="magazine" id="magazine">
  <div class="container">
    <div class="magazine-head reveal">
      <span class="label">✦ Magazine</span>
      <h2 class="section-title">Le média des familles IEF sportives</h2>
      <p class="section-sub">Actualités, conseils, dossiers de fond et regard institutionnel : restez informés sur le sport, l'éducation et votre communauté.</p>
    </div>

    <div class="mag-grid">
      <!-- FEATURED -->
      <div class="mag-card featured reveal">
        <div class="mag-thumb t1">🏃‍♂️</div>
        <div class="mag-body">
          <div class="mag-cat">Sport & IEF · Dossier</div>
          <h3>Pourquoi le sport est essentiel dans le parcours de l'enfant instruit en famille</h3>
          <p class="mag-excerpt">Au-delà de la santé physique, la pratique sportive régulière développe la discipline, la résilience et les compétences sociales — des ressources précieuses pour les enfants qui apprennent hors des murs de l'école. Découvrez comment le sport peut transformer l'expérience IEF.</p>
          <div class="mag-meta">
            <span>Sport & santé</span>
            <span>8 min de lecture</span>
            <span>Équipe éditoriale</span>
          </div>
          <div class="mag-read">Lire le dossier <span>→</span></div>
        </div>
      </div>

      <!-- Article 2 -->
      <div class="mag-card reveal" style="transition-delay:.1s">
        <div class="mag-thumb t2">📅</div>
        <div class="mag-body">
          <div class="mag-cat">Éducation & IEF</div>
          <h3>Comment structurer la semaine d'un enfant instruit en famille</h3>
          <p class="mag-excerpt">Rythmes, temps de travail, pauses et activités extérieures : un guide pratique pour les parents.</p>
          <div class="mag-meta"><span>5 min de lecture</span></div>
          <div class="mag-read">Lire l'article <span>→</span></div>
        </div>
      </div>

      <!-- Article 3 -->
      <div class="mag-card reveal" style="transition-delay:.2s">
        <div class="mag-thumb t3">⚖️</div>
        <div class="mag-body">
          <div class="mag-cat">Cadre institutionnel</div>
          <h3>Comprendre le cadre juridique et institutionnel du sport en France</h3>
          <p class="mag-excerpt">Licences, assurances, fédérations, UNSS : tout ce que les familles IEF doivent savoir.</p>
          <div class="mag-meta"><span>6 min de lecture</span></div>
          <div class="mag-read">Lire l'article <span>→</span></div>
        </div>
      </div>

      <!-- Article 4 -->
      <div class="mag-card reveal" style="transition-delay:.3s">
        <div class="mag-thumb t4">🌱</div>
        <div class="mag-body">
          <div class="mag-cat">Conseils parents</div>
          <h3>Les bienfaits du multisports chez les enfants et adolescents</h3>
          <p class="mag-excerpt">Pas de spécialisation précoce : la science confirme l'importance de diversifier les pratiques sportives.</p>
          <div class="mag-meta"><span>4 min de lecture</span></div>
          <div class="mag-read">Lire l'article <span>→</span></div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     GAMIFICATION
============================================================ -->
<section class="gamification" id="gamification">
  <div class="container">
    <div class="gami-head reveal">
      <span class="label">✦ Gamification</span>
      <h2 class="section-title">Progresser en s'amusant</h2>
      <p class="section-sub">Un système de progression motivant qui valorise l'effort, l'assiduité et l'esprit d'équipe — pour les enfants comme pour les familles.</p>
    </div>

    <div class="gami-grid">
      <div class="gami-card reveal">
        <span class="gami-icon">🏅</span>
        <h3>Badges</h3>
        <p>Des badges collectionnables récompensent chaque étape : premier entraînement, premier défi remporté, assiduité…</p>
        <div class="gami-bar"><div class="gami-fill" style="width:78%"></div></div>
      </div>
      <div class="gami-card reveal" style="transition-delay:.1s">
        <span class="gami-icon">⭐</span>
        <h3>Points</h3>
        <p>Chaque participation, défi et progression sportive génère des points qui alimentent le classement familial.</p>
        <div class="gami-bar"><div class="gami-fill" style="width:62%"></div></div>
      </div>
      <div class="gami-card reveal" style="transition-delay:.2s">
        <span class="gami-icon">🎯</span>
        <h3>Défis</h3>
        <p>Des défis hebdomadaires et mensuels en ligne ou en physique pour maintenir l'engagement toute l'année.</p>
        <div class="gami-bar"><div class="gami-fill" style="width:55%"></div></div>
      </div>
      <div class="gami-card reveal" style="transition-delay:.3s">
        <span class="gami-icon">🥇</span>
        <h3>Classements</h3>
        <p>Des tableaux de classement transparents par catégorie d'âge, sport, assiduité et score communautaire.</p>
        <div class="gami-bar"><div class="gami-fill" style="width:85%"></div></div>
      </div>
    </div>

    <div class="gami-cta reveal">
      <a href="#pricing" class="btn btn-navy">Rejoindre le jeu dès septembre →</a>
    </div>
  </div>
</section>


<!-- ============================================================
     PRICING
============================================================ -->
<section class="pricing" id="pricing">
  <div class="container">
    <div class="pricing-inner">
      <!-- Left text -->
      <div class="pricing-left reveal">
        <span class="label" style="color:var(--gold-lt);border-color:rgba(232,160,32,.4)">✦ Offre annuelle</span>
        <h2 class="section-title" style="color:var(--white)">Tout ce dont votre famille a besoin, dans une seule cotisation.</h2>

        <div class="included-list" style="margin-top:32px">
          <div class="included-item">Accès illimité au soutien scolaire en ligne</div>
          <div class="included-item">Entraînements multisports tous les mercredis</div>
          <div class="included-item">Participation aux challenges et tournois week-end</div>
          <div class="included-item">Stages pendant les vacances scolaires</div>
          <div class="included-item">Accès au magazine et aux ressources éducatives</div>
          <div class="included-item">Participation à la communauté de familles IEF</div>
          <div class="included-item">Système de badges, points et classements</div>
          <div class="included-item">Assurance sportive et encadrement qualifié</div>
        </div>
      </div>

      <!-- Pricing card -->
      <div class="pricing-card reveal">
        <div>
          <div class="pc-tag">✦ Programme Pilote – Offre de lancement</div>
          <div class="pc-name">Adhésion Famille Annuelle</div>
        </div>

        <div class="pc-price">
          <span class="pc-currency">€</span>
          <span class="pc-amount">450</span>
          <span class="pc-period">&nbsp;/ an<br><small style="font-size:.72rem;color:var(--muted)">soit 37,50 €/mois</small></span>
        </div>

        <div class="pc-features">
          <div class="pc-feat">Pour les familles pratiquant l'IEF</div>
          <div class="pc-feat">Enfants de 6 à 18 ans</div>
          <div class="pc-feat">1 à 3 enfants par cotisation familiale</div>
          <div class="pc-feat">Paris et Île-de-France</div>
          <div class="pc-feat">Association loi 1901 – Reçu fiscal possible</div>
        </div>

        <div class="pc-warning">
          ⚡ Programme pilote limité à <strong>30 familles</strong><br>Démarrage septembre 2025
        </div>

        <a href="#" class="btn btn-primary" style="width:100%;justify-content:center;font-size:1rem;padding:16px">
          🏅 Demander ma préinscription
        </a>

        <p style="font-size:.78rem;color:var(--muted);text-align:center">
          Sans engagement immédiat · Confirmation sous 48h · Paiement à l'inscription
        </p>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     COMMUNITY
============================================================ -->
<section class="community" id="community">
  <div class="container">
    <div class="community-inner">
      <!-- Content -->
      <div class="comm-content reveal">
        <span class="label">✦ Communauté</span>
        <h2 class="section-title">Une vraie communauté de familles IEF</h2>
        <p class="section-sub">
          CS Ternes Paris Ouest, c'est avant tout des rencontres. Des familles partageant les mêmes convictions éducatives, qui se retrouvent chaque semaine pour construire ensemble un réseau solide et bienveillant.
        </p>

        <div class="testimonials">
          <div class="testi">
            <p class="testi-text">"Enfin un cadre sportif sérieux qui respecte notre choix d'instruction en famille. Mes enfants ont trouvé leur groupe d'amis et moi une communauté de parents qui me ressemblent."</p>
            <div class="testi-author">
              <div class="testi-avatar">MF</div>
              <div class="testi-info">
                <strong>Marie F.</strong>
                <span>Mère de 3 enfants IEF · Paris 17e</span>
              </div>
            </div>
          </div>
          <div class="testi">
            <p class="testi-text">"Le mercredi multisports est devenu le moment préféré de la semaine de mon fils. Il progresse, il socialise, et il est fier de ses badges."</p>
            <div class="testi-author">
              <div class="testi-avatar">PT</div>
              <div class="testi-info">
                <strong>Pierre T.</strong>
                <span>Père de 2 enfants IEF · Neuilly-sur-Seine</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div class="comm-cards reveal">
        <div class="comm-card">
          <div class="cc-icon">👨‍👩‍👧‍👦</div>
          <div class="cc-title">Familles adhérentes</div>
          <div class="cc-desc">30 familles pilotes partageant les mêmes valeurs éducatives et sportives.</div>
        </div>
        <div class="comm-card">
          <div class="cc-icon">🤝</div>
          <div class="cc-title">Socialisation</div>
          <div class="cc-desc">Des liens authentiques forgés dans le sport et les projets communs.</div>
        </div>
        <div class="comm-card">
          <div class="cc-icon">🎉</div>
          <div class="cc-title">Événements</div>
          <div class="cc-desc">Tournois, pique-niques, fêtes de fin de stage et rencontres inter-clubs.</div>
        </div>
        <div class="comm-card">
          <div class="cc-icon">💬</div>
          <div class="cc-title">Entraide</div>
          <div class="cc-desc">Un espace d'échange entre parents : conseils, ressources, soutien.</div>
        </div>
        <div class="comm-card wide">
          <div class="cc-icon">📱</div>
          <div>
            <div class="cc-title">Plateforme communautaire dédiée</div>
            <div class="cc-desc">Application, fil d'actualité de la communauté, messagerie entre familles et suivi de progression en temps réel.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     CTA STRIP
============================================================ -->
<section class="cta-strip">
  <div class="container">
    <div class="cta-strip-inner">
      <div>
        <h2>🏅 30 places pour les familles pionnières.</h2>
        <p>Rejoignez le programme pilote dès septembre. Préinscription sans engagement, confirmation sous 48h.</p>
      </div>
      <a href="#pricing" class="btn btn-navy">Demander ma préinscription →</a>
    </div>
  </div>
</section>


<!-- ============================================================
     FAQ
============================================================ -->
<section class="faq" id="faq">
  <div class="container">
    <div class="faq-head reveal">
      <span class="label">✦ FAQ</span>
      <h2 class="section-title">Questions fréquentes</h2>
      <p class="section-sub">Tout ce que vous devez savoir avant de rejoindre la communauté CS Ternes Paris Ouest.</p>
    </div>

    <div class="faq-list">
      <!-- Q1 -->
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">
          Mon enfant doit-il être scolarisé hors contrat ou peut-il être totalement instruit en famille ?
          <div class="faq-icon">+</div>
        </button>
        <div class="faq-a">
          <p>CS Ternes Paris Ouest est ouvert à toutes les familles pratiquant l'instruction en famille (IEF) quelle que soit leur configuration : instruction complète à domicile, école hors contrat, CNED, co-schooling… L'essentiel est que votre enfant ne soit pas inscrit dans un établissement scolaire classique et qu'il soit disponible le mercredi après-midi.</p>
        </div>
      </div>

      <!-- Q2 -->
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">
          Quels sports sont pratiqués lors des mercredis multisports ?
          <div class="faq-icon">+</div>
        </button>
        <div class="faq-a">
          <p>Le programme multisports varie selon les cycles et les saisons : football, basketball, athlétisme, badminton, arts martiaux, acrosport, natation selon les accès. L'idée est de ne pas spécialiser trop tôt et de permettre à chaque enfant de découvrir différentes disciplines. Les cycles sont communiqués en début de trimestre.</p>
        </div>
      </div>

      <!-- Q3 -->
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">
          La cotisation de 450 € couvre-t-elle vraiment tout, y compris les stages ?
          <div class="faq-icon">+</div>
        </button>
        <div class="faq-a">
          <p>La cotisation annuelle de 450 € inclut l'accès aux entraînements du mercredi, au soutien scolaire en ligne, aux challenges du week-end et à la plateforme communautaire. Les stages de vacances font l'objet d'une participation aux frais séparée (hébergement, repas) dans la limite du tarif solidaire. Aucun frais caché, tout est transparent dès l'adhésion.</p>
        </div>
      </div>

      <!-- Q4 -->
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">
          Mon enfant est très jeune (6 ans) ou adolescent (15 ans) — est-il le bienvenu ?
          <div class="faq-icon">+</div>
        </button>
        <div class="faq-a">
          <p>Tout à fait. CS Ternes Paris Ouest accueille les enfants de 6 à 18 ans. Les entraînements sont organisés par groupes d'âge et de niveau pour que chacun progresse à son rythme dans un environnement adapté. Le soutien scolaire en ligne s'adapte également au niveau et au programme de chaque enfant.</p>
        </div>
      </div>

      <!-- Q5 -->
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">
          Comment fonctionne la préinscription et quand aura lieu la rentrée ?
          <div class="faq-icon">+</div>
        </button>
        <div class="faq-a">
          <p>La préinscription est sans engagement financier immédiat. Elle vous permet de réserver votre place parmi les 30 familles pilotes. Nous vous contactons sous 48h pour confirmer votre admission et vous envoyer le dossier complet. La rentrée du programme pilote est prévue pour septembre 2025. Le paiement de la cotisation interviendra à la signature de l'adhésion associative.</p>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     FOOTER
============================================================ -->
<footer id="contact">
  <div class="container">
    <div class="footer-grid">
      <!-- Brand -->
      <div class="footer-brand">
        <a href="#" class="logo">
          <div class="logo-mark">CS</div>
          <div class="logo-text">
            <div class="logo-name">CS Ternes Paris Ouest</div>
            <div class="logo-tagline">Sport & Éducation IEF</div>
          </div>
        </a>
        <p>Association loi 1901 dédiée aux familles pratiquant l'instruction en famille. Sport, éducation, communauté et progression pour les enfants de 6 à 18 ans.</p>
        <div class="social-links">
          <a href="#" class="social-link" title="Instagram">📸</a>
          <a href="#" class="social-link" title="Facebook">👥</a>
          <a href="#" class="social-link" title="YouTube">▶️</a>
          <a href="#" class="social-link" title="Email">✉️</a>
        </div>
      </div>

      <!-- Le Projet -->
      <div class="footer-col">
        <h4>Le Projet</h4>
        <ul>
          <li><a href="#">Vision</a></li>
          <li><a href="#">Sport & Éducation</a></li>
          <li><a href="#">Familles IEF</a></li>
          <li><a href="#">Organisation annuelle</a></li>
        </ul>
      </div>

      <!-- Activités -->
      <div class="footer-col">
        <h4>Activités</h4>
        <ul>
          <li><a href="#">Soutien scolaire en ligne</a></li>
          <li><a href="#">Mercredi multisports</a></li>
          <li><a href="#">Challenges week-end</a></li>
          <li><a href="#">Stages vacances</a></li>
          <li><a href="#">Tournois & compétitions</a></li>
        </ul>
      </div>

      <!-- Communauté & Contact -->
      <div class="footer-col">
        <h4>Communauté</h4>
        <ul>
          <li><a href="#">Familles adhérentes</a></li>
          <li><a href="#">Événements</a></li>
          <li><a href="#">Magazine</a></li>
          <li><a href="#">Classements & badges</a></li>
        </ul>
        <h4 style="margin-top:24px">Contact</h4>
        <ul>
          <li><a href="mailto:contact@csternes.fr">contact@csternes.fr</a></li>
          <li><a href="#">Paris 17e – Île-de-France</a></li>
          <li><a href="#">Préinscription</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 CS Ternes Paris Ouest · Association loi 1901 · Tous droits réservés</p>
      <p>Mentions légales · Politique de confidentialité · CGU</p>
    </div>
  </div>
</footer>


<!-- ============================================================
     JAVASCRIPT
============================================================ -->
<script>
// --- Mobile nav toggle ---
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// --- Sticky header shadow ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 20
    ? '0 4px 32px rgba(0,0,0,.25)'
    : 'none';
});

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// --- FAQ accordion ---
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q.open').forEach(b => {
    b.classList.remove('open');
    b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}
</script>
</body>
</html>
