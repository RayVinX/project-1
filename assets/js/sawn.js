/* ==========================================================================
   SAWN — Burgundy flagship · interaction engine (EN / AR)
   One rAF loop drives: smooth scroll, cursor, spotlight, full-page vortex +
   floating logo/letter field (single background canvas), preview panel, HUD,
   marquee and manifesto illumination.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

  const { CONTACT, STR, CURSOR_AR, MARQUEE, TATTOO, PRACTICES } = window.SAWN_I18N;
  const root = document.documentElement;
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) root.classList.add('no-hover');
  const EASE = 'cubic-bezier(.22,1,.36,1)';

  /* ---------------------------------------------------------------------
     Language state
     --------------------------------------------------------------------- */
  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = ['en', 'ar'].includes(urlLang) ? urlLang
    : ['en', 'ar'].includes(storage.get('sawn-lang')) ? storage.get('sawn-lang')
    : (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const T = (k) => (STR[lang] && STR[lang][k] != null ? STR[lang][k] : (STR.en[k] != null ? STR.en[k] : ''));

  /* ---------------------------------------------------------------------
     Pointer & spotlight state
     --------------------------------------------------------------------- */
  const P = { x: innerWidth * 0.62, y: innerHeight * 0.42, px: 0, py: 0, speed: 0, touchAt: -1e9 };
  addEventListener('pointermove', (e) => {
    P.x = e.clientX; P.y = e.clientY;
    if (e.pointerType !== 'mouse') P.touchAt = performance.now();
  }, { passive: true });
  addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { P.x = e.clientX; P.y = e.clientY; P.touchAt = performance.now(); } }, { passive: true });

  /* ---------------------------------------------------------------------
     Bespoke geometric art (SVG, 300×300)
     --------------------------------------------------------------------- */
  const ART = {
    genesis() {
      let s = '';
      for (let i = 0; i < 13; i++) s += `<circle pathLength="1" style="--d:${i}" cx="150" cy="232" r="${10 + i * 17}"/>`;
      s += `<line pathLength="1" class="faint" style="--d:2" x1="20" y1="232" x2="280" y2="232"/>`;
      s += `<line pathLength="1" style="--d:4" x1="150" y1="30" x2="150" y2="270"/>`;
      s += `<circle class="fill" cx="150" cy="232" r="3"/>`;
      return `<defs><clipPath id="cg"><rect x="18" y="18" width="264" height="264"/></clipPath></defs><g clip-path="url(#cg)">${s}</g>`;
    },
    convergence() {
      let s = '';
      for (let i = 0; i < 21; i++) { const y = 40 + i * 11; s += `<path pathLength="1" style="--d:${i}" d="M24 ${y} C 120 ${y}, 150 150, 214 150"/>`; }
      s += `<line pathLength="1" style="--d:22" x1="214" y1="150" x2="282" y2="150"/>`;
      s += `<circle pathLength="1" style="--d:20" cx="214" cy="150" r="9"/>`;
      s += `<circle class="fill" cx="214" cy="150" r="2.6"/>`;
      s += `<rect pathLength="1" class="faint" style="--d:1" x="18" y="24" width="264" height="252"/>`;
      return s;
    },
    signature() {
      let s = '';
      for (let i = 0; i < 16; i++) {
        const o = i * 3.2;
        s += `<path pathLength="1" style="--d:${i}" d="M ${228 - o} ${46 + o * 0.4} C ${110 - o} ${30 + o}, ${48 + o} ${112 + o * 0.3}, 150 ${150 + o * 0.2} S ${250 - o} ${236 - o * 0.3}, ${72 + o} ${258 - o * 0.4}"/>`;
      }
      s += `<line pathLength="1" class="faint" style="--d:3" x1="150" y1="20" x2="150" y2="280"/>`;
      return s;
    },
    framework() {
      let s = '';
      for (let i = 0; i < 15; i++) {
        const h = 118 * Math.pow(0.86, i);
        s += `<rect pathLength="1" style="--d:${i}" x="${150 - h}" y="${150 - h}" width="${h * 2}" height="${h * 2}" transform="rotate(${i * 6.5} 150 150)"/>`;
      }
      s += `<line pathLength="1" class="faint" style="--d:2" x1="18" y1="150" x2="282" y2="150"/>`;
      s += `<line pathLength="1" class="faint" style="--d:2" x1="150" y1="18" x2="150" y2="282"/>`;
      return s;
    },
  };
  // drawn strokes get class "ln" (attribute selectors on camel-case SVG attrs don't invalidate reliably)
  const svgArt = (key) => `<svg class="art" viewBox="0 0 300 300" aria-hidden="true" data-art="${key}">${
    ART[key]().replace(/pathLength="1"( class="([^"]*)")?/g, (m, c, k) => `pathLength="1" class="ln ${k || ''}"`)
  }</svg>`;

  /* ---------------------------------------------------------------------
     Practice index (rendered per language)
     --------------------------------------------------------------------- */
  const indexEl = $('.js-index');
  let rows = [];
  const preview = document.createElement('aside');
  preview.className = 'preview';
  preview.setAttribute('aria-hidden', 'true');
  const PV = { x: 0, y: 0, tx: 0, ty: 0, rot: 0, on: false, key: null, row: null };

  function setPreview(row) {
    indexEl.classList.toggle('has-preview', !!row);
    if (!row) { preview.classList.remove('is-on'); PV.on = false; return; }
    PV.row = row;
    const k = row.dataset.art;
    if (PV.key !== k) {
      $$('.preview__art svg', preview).forEach((s) => s.classList.toggle('is-active', s.dataset.art === k));
      $('.js-pv-title', preview).textContent = row.dataset.title;
      $('.js-pv-desc', preview).textContent = row.dataset.tag;
      PV.key = k;
    }
    if (!PV.on) {
      const r = indexEl.getBoundingClientRect();
      const tr = $('.row__tag', row).getBoundingClientRect();
      PV.x = PV.tx = tr.left - r.left; PV.y = PV.ty = P.y - r.top - preview.offsetHeight * 0.5;
    }
    preview.classList.add('is-on'); PV.on = true;
  }

  function renderIndex() {
    const open = rows.map((r, i) => (r.classList.contains('is-open') ? i : -1)).filter((i) => i >= 0);
    let n = 0;
    indexEl.innerHTML = PRACTICES.map((p) => {
      const L = p[lang];
      const disc = L.d.map(([t, s, b]) => {
        n++;
        return `<li><span class="disc__n mono ltr">${pad(n)} / 14</span><h4>${t}</h4><p class="disc__s">${s}</p><ul>${b.map((x) => `<li>${x}</li>`).join('')}</ul></li>`;
      }).join('');
      return `
      <div class="row" role="listitem" data-art="${p.art}" data-id="${p.id}" data-title="${L.title}" data-n="${L.d.length}" data-focus="${L.focus}" data-fig="${L.fig}" data-tag="${L.tag}">
        <button class="row__head" type="button" aria-expanded="false" aria-controls="practice-${p.id}" data-cursor="Open">
          <span class="row__num mono ltr">${p.id}</span>
          <span class="row__title">${L.title}<em>${L.em}</em></span>
          <span class="row__tag">${L.tag}</span>
          <span class="row__count mono">${pad(L.d.length)} ${T('prac.disciplines')}</span>
          <span class="row__plus" aria-hidden="true"></span>
        </button>
        <div class="row__body" id="practice-${p.id}" role="region" aria-label="${L.title}">
          <div class="row__inner"><div class="row__content">
            <div class="row__art">${svgArt(p.art)}</div>
            <ol class="disc">${disc}</ol>
          </div></div>
        </div>
      </div>`;
    }).join('');

    // hover box: drawn art + title + explanation only
    preview.innerHTML = `
      <div class="preview__inner">
        <div class="preview__art">${Object.keys(ART).map((k) => svgArt(k)).join('')}</div>
        <h4 class="preview__title js-pv-title"></h4>
        <p class="preview__desc js-pv-desc"></p>
      </div>`;
    indexEl.appendChild(preview);
    PV.key = null; setPreview(null);

    rows = $$('.row', indexEl);
    rows.forEach((row, i) => {
      const head = $('.row__head', row);
      if (open.includes(i)) { row.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
      head.addEventListener('pointerenter', () => { row.classList.add('is-hot'); if (fine && innerWidth > 860) setPreview(row); });
      head.addEventListener('pointerleave', () => { row.classList.remove('is-hot'); setPreview(null); });
      head.addEventListener('focus', () => row.classList.add('is-hot'));
      head.addEventListener('blur', () => row.classList.remove('is-hot'));
      head.addEventListener('click', () => {
        const isOpen = !row.classList.contains('is-open');
        row.classList.toggle('is-open', isOpen);
        head.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) setPreview(null);
        setTimeout(() => scroller.refresh(), 1150);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Contact ledger (email + two phones, copy feedback, LTR-isolated digits)
     --------------------------------------------------------------------- */
  const reachEl = $('.js-reach');
  const srEl = $('.js-sr');
  const fmtPhone = (p) => p.replace(/^00964(\d{3})(\d{3})(\d{4})$/, '00964 $1 $2 $3');
  const telHref = (p) => 'tel:+' + p.replace(/^00/, '');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderContact() {
    const copyChip = (val) => `<button class="chip mono js-copy" type="button" data-copy="${esc(val)}" data-cursor="Copy"><span class="chip__lbl">${T('con.copy')}</span><span class="chip__ok">${T('con.copied')} <i>✓</i></span></button>`;
    let html = '';
    if (CONTACT.email) {
      const e = esc(CONTACT.email);
      html += `<li><span class="reach__k mono">${T('con.email')}</span>
        <a class="reach__v reach__v--email fill ltr" dir="ltr" href="mailto:${e}" data-text="${e}" data-cursor="Write">${e}</a>
        <span class="reach__act"><a class="chip mono" href="mailto:${e}" data-cursor="Write">${T('con.write')} <i>↗</i></a>${copyChip(CONTACT.email)}</span></li>`;
    } else {
      html += `<li><span class="reach__k mono">${T('con.email')}</span><span class="reach__v reach__v--pending">${T('con.pending')}</span><span class="reach__act"></span></li>`;
    }
    CONTACT.phones.forEach((p, i) => {
      const shown = fmtPhone(p);
      html += `<li><span class="reach__k mono"><b class="ltr">${pad(i + 1)}</b>${T('con.phone')}</span>
        <a class="reach__v fill ltr" dir="ltr" href="${telHref(p)}" data-text="${shown}" data-cursor="Call">${shown}</a>
        <span class="reach__act"><a class="chip mono" href="${telHref(p)}" data-cursor="Call">${T('con.call')} <i>↗</i></a>${copyChip(p)}</span></li>`;
    });
    reachEl.innerHTML = html;
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove(); return ok;
    }
  }
  reachEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('.js-copy');
    if (!btn) return;
    const ok = await copyText(btn.dataset.copy);
    if (!ok) return;
    btn.classList.add('is-copied');
    srEl.textContent = `${T('con.copiedSr')}: ${btn.dataset.copy}`;
    clearTimeout(btn._t);
    btn._t = setTimeout(() => btn.classList.remove('is-copied'), 1800);
  });

  /* ---------------------------------------------------------------------
     Split words (statement reveal + manifesto illumination)
     --------------------------------------------------------------------- */
  function splitWords(el, { wrap = true, cls = 'w' } = {}) {
    let i = 0;
    const walk = (node, inherit) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = cls + (inherit ? ' ' + inherit : '');
            s.style.setProperty('--wi', i++);
            if (wrap) { const inner = document.createElement('span'); inner.textContent = part; s.appendChild(inner); } else s.textContent = part;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          if (n.tagName === 'B') { walk(n, 'g'); n.replaceWith(...n.childNodes); } else walk(n, inherit);
        }
      });
    };
    walk(el, '');
  }
  const manifesto = $('.js-manifesto');
  let mWords = [];
  const steps = $$('.js-steps li');

  /* ---------------------------------------------------------------------
     Marquee (velocity-coupled; direction follows reading direction)
     --------------------------------------------------------------------- */
  const mq = $('.js-marquee');
  let mqX = 0, mqW = 0;
  function renderMarquee() {
    const set = `<div class="marquee__set">${MARQUEE[lang].map((w, i) => `<span class="${i % 2 ? 'o' : ''}">${w}</span><i></i>`).join('')}</div>`;
    mq.innerHTML = set + set;
    measureMarquee();
    mqX = lang === 'ar' ? -mqW : 0;
  }
  const measureMarquee = () => { const s = $('.marquee__set', mq); mqW = s ? s.getBoundingClientRect().width : 0; };

  /* ---------------------------------------------------------------------
     Reveal on view
     --------------------------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---------------------------------------------------------------------
     Weighted inertial scroll — one damped timeline drives the whole page.
     Wheel / trackpad / keyboard feed a virtual target (capped per tick); the
     page glides toward it with frame-rate-independent damping (~0.062/frame).
     Touch and the native scrollbar stay native and simply re-sync it.
     --------------------------------------------------------------------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  const SC = { target: 0, current: 0, locked: true, damp: 0.062, cap: 110 };
  const maxScroll = () => Math.max(0, root.scrollHeight - innerHeight);
  const scroller = {
    to(y) { SC.target = clamp(y, 0, maxScroll()); if (reduce) this.jump(SC.target); },
    jump(y) { SC.target = SC.current = clamp(y, 0, maxScroll()); scrollTo(0, SC.current); },
    refresh() { SC.target = clamp(SC.target, 0, maxScroll()); SC.current = clamp(SC.current, 0, maxScroll()); },
    lock(v) { SC.locked = v; root.style.overflow = v ? 'hidden' : ''; if (!v) SC.target = SC.current = scrollY; },
    tick(dt) {
      if (reduce || SC.locked) return;
      const diff = SC.target - SC.current;
      if (Math.abs(diff) < 0.05) { if (diff) { SC.current = SC.target; scrollTo(0, SC.current); } return; }
      SC.current += diff * (1 - Math.pow(1 - SC.damp, dt * 60));
      scrollTo(0, SC.current);
    },
  };
  // anything that scrolls natively (touch, scrollbar, find-in-page, focus) re-syncs the timeline
  addEventListener('scroll', () => { if (Math.abs(scrollY - SC.current) > 2) SC.current = SC.target = scrollY; }, { passive: true });
  addEventListener('touchstart', () => { SC.current = SC.target = scrollY; }, { passive: true });
  addEventListener('wheel', (e) => {
    if (e.ctrlKey || reduce) return;                    // keep pinch-zoom + reduced-motion native
    e.preventDefault();
    if (SC.locked || menuOpen) return;
    const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1;
    const dy = e.deltaY * unit, dx = e.deltaX * unit;
    // a sideways trackpad swipe travels along the active horizontal stage (sign follows reading direction)
    let d = Math.abs(dx) > Math.abs(dy) ? (activeStage() ? dx * (isRTL() ? -1 : 1) : 0) : dy;
    d = clamp(d * 0.9, -SC.cap, SC.cap);
    SC.target = clamp(SC.target + d, 0, maxScroll());
  }, { passive: false });
  addEventListener('keydown', (e) => {
    if (reduce || SC.locked || menuOpen || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    const vh = innerHeight;
    let d = null;
    switch (e.key) {
      case 'ArrowDown': d = 90; break;
      case 'ArrowUp': d = -90; break;
      case 'PageDown': d = vh * 0.85; break;
      case 'PageUp': d = -vh * 0.85; break;
      case ' ': if (/BUTTON|^A$/.test(tag)) return; d = (e.shiftKey ? -1 : 1) * vh * 0.85; break;
      case 'Home': d = -SC.target; break;
      case 'End': d = maxScroll() - SC.target; break;
      default: return;
    }
    e.preventDefault();
    SC.target = clamp(SC.target + d, 0, maxScroll());
  });
  window.SAWN = { scroller, setLang: (l) => switchLang(l) };
  const scrollToEl = (target) => {
    if (!target) return;
    scroller.to(target.getBoundingClientRect().top + scrollY);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = id === '#top' ? $('#overview') : $(id);
    if (!target) return;
    e.preventDefault();
    if (menuOpen) setMenu(false, false);
    scrollToEl(target);
  });

  /* ---------------------------------------------------------------------
     Index overlay menu
     --------------------------------------------------------------------- */
  const menuBtn = $('.hud__index');
  const menu = $('#menu');
  const menuLabel = $('.hud__index-label');
  let menuOpen = false;
  function setMenu(open, restoreFocus = true) {
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    menuLabel.textContent = T(open ? 'idx.close' : 'idx.open');
    menuBtn.setAttribute('aria-label', T(open ? 'idx.close' : 'idx.open'));
    if (open) {
      scroller.lock(true);
      setTimeout(() => { if (menuOpen) $('a', menu).focus({ preventScroll: true }); }, 450);
    } else {
      scroller.lock(false);
      if (restoreFocus) menuBtn.focus({ preventScroll: true });
    }
  }
  menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) { e.preventDefault(); setMenu(false); }
    if (e.key === 'Tab' && menuOpen) {
      const f = [menuBtn, ...$$('a', menu)];
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i === f.length - 1 ? 0 : i + 1)].focus();
    }
  });

  /* ---------------------------------------------------------------------
     Magnetic targets
     --------------------------------------------------------------------- */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate3d(${(e.clientX - (r.left + r.width / 2)) * 0.3}px, ${(e.clientY - (r.top + r.height / 2)) * 0.42}px, 0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------------
     Cursor
     --------------------------------------------------------------------- */
  const cursor = $('.cursor');
  const cDot = $('.cursor__dot');
  const cRing = $('.cursor__ring');
  const cLabel = $('.cursor__label');
  const C = { x: P.x, y: P.y };
  if (fine) {
    root.classList.add('has-cursor');
    addEventListener('pointermove', () => cursor.classList.add('is-live'), { once: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button');
      if (t) {
        const key = t.dataset.cursor || 'Explore';
        cLabel.textContent = lang === 'ar' ? (CURSOR_AR[key] || key) : key;
        cursor.classList.add('is-active');
      } else cursor.classList.remove('is-active');
    });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-live'));
    document.addEventListener('pointerenter', () => cursor.classList.add('is-live'));
    addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  }

  /* ---------------------------------------------------------------------
     Background canvas: full-page vortex + static "tattoo" (cursor-reveal only)
     --------------------------------------------------------------------- */
  const bgc = $('.js-bg-canvas');
  const bx = bgc.getContext('2d');
  const spot = $('.spot');
  const B = { w: 0, h: 0, dpr: 1 };
  const R = { time: 0, rotY: -0.5, rotX: -0.12, drag: 0, dragV: 0, ripple: 0, intro: 0, LINES: 36, SEG: 240 };
  const ALPHAS = [0.07, 0.12, 0.19, 0.28, 0.4, 0.54, 0.7, 0.9];
  let PX, PY, BR;
  const motes = Array.from({ length: 90 }, () => ({
    a: Math.random() * Math.PI * 2, r: 0.55 + Math.random() * 0.75, y: (Math.random() - 0.5) * 2.6, s: 0.04 + Math.random() * 0.1, z: Math.random(),
  }));
  // vortex is drawn on its own layer, feathered with an elliptical alpha falloff,
  // then composited sharp + a soft low-res bloom
  const vl = document.createElement('canvas');
  const vc = vl.getContext('2d');
  const bl = document.createElement('canvas');
  const bc = bl.getContext('2d');

  function sizeBg() {
    B.dpr = Math.min(devicePixelRatio || 1, 2);          // full device pixel ratio (up to 2×) for clean anti-aliasing
    B.w = innerWidth; B.h = innerHeight;
    bgc.width = vl.width = Math.round(B.w * B.dpr);
    bgc.height = vl.height = Math.round(B.h * B.dpr);
    bl.width = Math.max(1, Math.round(B.w / 5)); bl.height = Math.max(1, Math.round(B.h / 5));
    R.LINES = B.w < 860 ? 28 : 36;
    R.SEG = B.w < 860 ? 170 : 240;
    const n = R.LINES * (R.SEG + 1);
    PX = new Float32Array(n); PY = new Float32Array(n); BR = new Float32Array(R.SEG + 1);
  }

  function drawVortex(scrollY) {
    const { w, h, dpr } = B;
    const time = R.time;
    const mobile = w < 860;
    const k = easeIO(clamp(scrollY / (h * 0.9)));   // 0 in hero → 1 for the rest of the page
    const LINES = k > 0.6 ? Math.max(16, Math.round(R.LINES * 0.75)) : R.LINES;
    const SEG = k > 0.6 ? Math.round(R.SEG * 0.8) : R.SEG;
    const side = mobile ? 0.6 : 0.705;
    const cx0 = lerp(w * (lang === 'ar' ? 1 - side : side), w * 0.5, k); // mirrored in RTL
    const cy0 = lerp(mobile ? h * 0.3 : h * 0.5, h * 0.5, k);
    const heroS = (mobile ? Math.min(w * 0.5, h * 0.2) : Math.min(w * 0.27, h * 0.36)) * 1.16;
    const fullS = (mobile ? Math.min(h * 0.4, w * 0.78) : Math.min(h * 0.41, w * 0.34)) * 1.12;
    const S = lerp(heroS, fullS, k) * (0.92 + 0.08 * R.intro);
    const fade = lerp(mobile ? 0.9 : 1, 0.34, k) * R.intro;
    if (fade <= 0.01) return;
    const rotY = R.rotY + scrollY * 0.00045;
    const cY = Math.cos(rotY), sY = Math.sin(rotY);
    const cX = Math.cos(R.rotX), sX = Math.sin(R.rotX);
    const breathe = 1 + Math.sin(time * 0.55) * 0.035;
    const F = 3.6, Lx = -0.45, Ly = 0.55, Lz = 0.7;

    for (let j = 0; j <= SEG; j++) {
      const t = j / SEG;
      const a = t * Math.PI * 1.9 + 0.2;
      const ccx = Math.sin(a) * 0.62 * breathe, ccy = (0.5 - t) * 2.35, ccz = Math.cos(a) * 0.5;
      const tx = Math.cos(a) * 0.62 * 1.9 * Math.PI, ty = -2.35, tz = -Math.sin(a) * 0.5 * 1.9 * Math.PI;
      const wave = R.ripple * Math.sin(t * 13 - time * 4.2) * 0.55;
      const th = t * Math.PI * 1.55 + time * 0.16 + wave;
      const width = 0.44 * (0.5 + 0.5 * Math.sin(Math.PI * clamp(t * 1.04 - 0.02))) * breathe;
      const wx = Math.cos(th), wy = Math.sin(th) * 0.22, wz = Math.sin(th);
      let nx = ty * wz - tz * wy, ny = tz * wx - tx * wz, nz = tx * wy - ty * wx;
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const nx1 = nx * cY + nz * sY, nz1 = -nx * sY + nz * cY;
      const ny2 = ny * cX - nz1 * sX, nz2 = ny * sX + nz1 * cX;
      const lam = Math.abs(nx1 * Lx + ny2 * Ly + nz2 * Lz);
      const spec = Math.pow(lam, 10);
      for (let i = 0; i < LINES; i++) {
        const u = -1 + (2 * i) / (LINES - 1);
        const flutter = Math.sin(u * 3.1 + time * 1.3 + t * 7) * 0.012 * (1 + R.ripple * 2);
        const x = ccx + wx * u * width, y = ccy + wy * u * width + flutter, z = ccz + wz * u * width;
        const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
        const y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
        const kk = F / (F - z2);
        const idx = i * (SEG + 1) + j;
        PX[idx] = cx0 + x1 * S * kk; PY[idx] = cy0 - y2 * S * kk;
        if (i === 0) BR[j] = clamp((0.1 + 0.42 * Math.abs(nz2) + 0.75 * spec) * (0.62 + 0.38 * ((z2 + 1.2) / 2.4)));
      }
    }

    vc.setTransform(dpr, 0, 0, dpr, 0, 0);
    vc.globalCompositeOperation = 'source-over';
    vc.clearRect(0, 0, w, h);
    vc.lineCap = 'round'; vc.lineJoin = 'round';
    // continuous polylines, split only where the sheen band changes → silk-smooth curves
    vc.lineWidth = 0.8;
    const bucket = (j) => Math.min(ALPHAS.length - 1, (((BR[j] + BR[j + 1]) * 0.5) * ALPHAS.length) | 0);
    const paths = ALPHAS.map(() => new Path2D());
    for (let i = 1; i < LINES - 1; i++) {
      const base = i * (SEG + 1);
      let cur = -1, p = null;
      for (let j = 0; j < SEG; j++) {
        const bi = bucket(j);
        if (bi !== cur) { p = paths[bi]; p.moveTo(PX[base + j], PY[base + j]); cur = bi; }
        p.lineTo(PX[base + j + 1], PY[base + j + 1]);
      }
    }
    paths.forEach((p, i) => { vc.strokeStyle = `rgba(214,178,124,${ALPHAS[i] * fade})`; vc.stroke(p); });
    // weft — faint cross threads
    const step = Math.max(4, Math.round(SEG / 26));
    vc.strokeStyle = `rgba(243,236,226,${0.07 * fade})`;
    vc.beginPath();
    for (let j = 0; j <= SEG; j += step) {
      vc.moveTo(PX[j], PY[j]);
      for (let i = 1; i < LINES; i++) { const idx = i * (SEG + 1) + j; vc.lineTo(PX[idx], PY[idx]); }
    }
    vc.stroke();
    // selvedge
    vc.lineWidth = 1.1;
    vc.strokeStyle = `rgba(243,236,226,${0.55 * fade})`;
    [0, LINES - 1].forEach((i) => {
      const base = i * (SEG + 1);
      vc.beginPath(); vc.moveTo(PX[base], PY[base]);
      for (let j = 1; j <= SEG; j++) vc.lineTo(PX[base + j], PY[base + j]);
      vc.stroke();
    });
    if (k < 0.6) {
      for (const m of motes) {
        const a = m.a + time * m.s;
        const x = Math.cos(a) * m.r, z = Math.sin(a) * m.r, y = m.y + Math.sin(time * 0.3 + m.a) * 0.05;
        const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
        const y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
        const kk = F / (F - z2);
        vc.fillStyle = `rgba(214,178,124,${(0.15 + 0.55 * ((z2 + 1.4) / 2.8)) * fade * (0.5 + m.z * 0.5)})`;
        const sz = 0.6 + m.z * 1.1;
        vc.beginPath(); vc.arc(cx0 + x1 * S * kk, cy0 - y2 * S * kk, sz * 0.6, 0, Math.PI * 2); vc.fill();
      }
    }

    // feather: elliptical radial falloff (solid to 42 %, gone by 74 %), sized so it is
    // fully transparent before any viewport edge → the arms dissolve, never clip
    const edgeX = Math.min(cx0, w - cx0) - 70, edgeY = Math.min(cy0, h - cy0) - 70;
    const rx = Math.max(40, Math.min(S * 1.6, edgeX / 0.74));
    const ry = Math.max(40, Math.min(S * 1.95, edgeY / 0.74));
    vc.globalCompositeOperation = 'destination-in';
    vc.setTransform(dpr, 0, 0, dpr * (ry / rx), cx0 * dpr, cy0 * dpr);
    const g = vc.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.42, 'rgba(0,0,0,1)');
    g.addColorStop(0.58, 'rgba(0,0,0,.55)'); g.addColorStop(0.74, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    vc.fillStyle = g;
    vc.fillRect(-cx0, -cy0 * (rx / ry), w, h * (rx / ry));
    vc.setTransform(1, 0, 0, 1, 0, 0);
    vc.globalCompositeOperation = 'source-over';

    // composite: crisp layer + delicate low-res bloom
    bx.drawImage(vl, 0, 0, w, h);
    bc.clearRect(0, 0, bl.width, bl.height);
    bc.imageSmoothingQuality = 'high';
    bc.drawImage(vl, 0, 0, bl.width, bl.height);
    bx.save();
    bx.globalCompositeOperation = 'lighter';
    bx.globalAlpha = 0.3;
    bx.imageSmoothingQuality = 'high';
    bx.drawImage(bl, 0, 0, w, h);
    bx.restore();
  }

  /* ---------------------------------------------------------------------
     Horizontal stages with blended axis transitions.
     No hard pin: entering a stage, vertical speed eases out (smoothstep) while
     horizontal glide eases in over a blend zone, then the reverse on exit —
     the motion curves from one axis to the other, C¹-continuous, with no snap.
     LTR travels left→right; RTL mirrors to right→left. The layer is positioned
     by translate3d from the same damped scroll timeline (no position:sticky).
     --------------------------------------------------------------------- */
  if (reduce) root.classList.add('reduce');
  const hstages = $$('.js-hstage').map((el) => ({
    el, layer: $('.hstage__sticky', el), track: $('.js-htrack', el), panels: $$('.hpanel', el), num: $('.js-hnum', el), bar: $('.js-hbar', el),
    dist: 0, blend: 0, off: 0, X: 0, p: -1, idx: -1,
  }));
  const isRTL = () => lang === 'ar';
  function layoutH() {
    if (reduce) return;
    hstages.forEach((st) => {
      st.dist = Math.max(0, Math.ceil(st.track.scrollWidth - innerWidth));
      st.blend = Math.min(innerHeight * 0.7, st.dist * 0.7);
      st.el.style.height = `${st.dist + innerHeight}px`;
      st.layer.style.height = `${innerHeight}px`;
      st.p = -1; st.idx = -1;
    });
    scroller.refresh();
  }
  // s = how far the stage top has scrolled past the viewport top.
  // Returns the layer's vertical hold inside the stage (off) and the horizontal travel (X).
  function stageState(st, s) {
    const D = st.dist, Bl = st.blend, h = Bl / 2;
    if (!D || s <= -h) return { off: 0, X: 0 };
    if (s >= D + h) return { off: D, X: D };
    let y, X;
    if (s < h) {                 // entry: vertical decelerates into horizontal glide
      const t = (s + h) / Bl, t3 = t * t * t, t4 = t3 * t;
      y = h - Bl * (t - t3 + t4 / 2); X = Bl * (t3 - t4 / 2);
    } else if (s <= D - h) {     // pure horizontal glide
      y = 0; X = s;
    } else {                     // exit: horizontal decelerates back into vertical
      const t = (s - (D - h)) / Bl, t3 = t * t * t, t4 = t3 * t;
      y = -Bl * (t3 - t4 / 2); X = (D - h) + Bl * (t - t3 + t4 / 2);
    }
    return { off: y + s, X };
  }
  function updateH() {
    if (reduce) return;
    const vw = innerWidth, vh = innerHeight, rtl = isRTL();
    for (const st of hstages) {
      const r = st.el.getBoundingClientRect();
      const { off, X } = stageState(st, -r.top);
      st.off = off; st.X = X;
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
      st.layer.style.transform = `translate3d(0,${off.toFixed(2)}px,0)`;
      const x = X * (rtl ? 1 : -1);
      st.track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      // panel parallax by physical position → naturally mirrored in RTL
      const left0 = rtl ? vw - st.track.offsetWidth : 0;
      let best = 0, bestD = 1e9;
      st.panels.forEach((pn, i) => {
        const cx = left0 + x + pn.offsetLeft + pn.offsetWidth / 2;
        const rel = (cx - vw / 2) / vw;
        pn.style.setProperty('--rel', rel.toFixed(3));
        const d = Math.abs(rel); if (d < bestD) { bestD = d; best = i; }
      });
      const p = st.dist ? X / st.dist : 0;
      if (p !== st.p) {
        st.bar.style.transform = `scaleX(${p.toFixed(4)})`;
        st.el.classList.toggle('is-done', p > 0.98);
        st.p = p;
      }
      const idx = p >= 0.995 ? st.panels.length - 1 : best;
      if (idx !== st.idx) { st.num.textContent = pad(idx + 1); st.idx = idx; }
    }
  }
  // the stage currently in its horizontal zone (used for sideways trackpad / touch swipes)
  function activeStage() {
    for (const st of hstages) {
      if (!st.dist) continue;
      const s = -st.el.getBoundingClientRect().top, h = st.blend / 2;
      if (s > -h && s < st.dist + h) return st;
    }
    return null;
  }
  // touch side-swipe on an active stage (native scroll; the timeline re-syncs from it)
  hstages.forEach((st) => {
    let t = null;
    st.el.addEventListener('touchstart', (e) => { const p = e.touches[0]; t = { x: p.clientX, y: p.clientY, sy: scrollY, mode: null }; }, { passive: true });
    st.el.addEventListener('touchmove', (e) => {
      if (!t || reduce) return;
      const p = e.touches[0], dx = p.clientX - t.x, dy = p.clientY - t.y;
      if (!t.mode) { if (Math.abs(dx) > Math.abs(dy) + 6) t.mode = activeStage() === st ? 'h' : 'v'; else if (Math.abs(dy) > 8) t.mode = 'v'; }
      if (t.mode === 'h') { e.preventDefault(); scrollTo(0, t.sy - dx * (isRTL() ? -1 : 1) * 1.15); }
    }, { passive: false });
    st.el.addEventListener('touchend', () => { t = null; }, { passive: true });
  });
  // 2D camera: vertical distance held back by stages vs. horizontal distance travelled
  function camera(sy) {
    let held = 0, cx = 0;
    if (!reduce) for (const st of hstages) { held += st.off; cx += st.X; }
    return { x: cx * (isRTL() ? -1 : 1), y: sy - held };
  }

  /* ---- Page-wide tattoo: one seamless etched tile (rules, column grid,
     SAWN / صَوْن) repeated across the whole 2D journey and anchored to the
     content — it travels down with vertical sections and sideways with the
     horizontal tracks. Invisible at rest; revealed only in a soft lens
     around a moving cursor. */
  const tile = document.createElement('canvas');
  const tc = tile.getContext('2d');
  const lens = document.createElement('canvas');
  const lc = lens.getContext('2d');
  let tilePattern = null;
  const SP2 = { x: P.x, y: P.y };
  const TT = { a: 0, lastMove: -1e9 };
  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen' || e.buttons) TT.lastMove = performance.now(); }, { passive: true });
  addEventListener('pointerdown', () => { TT.lastMove = performance.now(); }, { passive: true });

  function buildTattoo() {
    const { w, h, dpr } = B;
    if (!w) return;
    const W = Math.round(w), H = Math.round(h);
    tile.width = Math.round(W * dpr); tile.height = Math.round(H * dpr);
    tc.setTransform(dpr, 0, 0, dpr, 0, 0);
    tc.clearRect(0, 0, W, H);
    const ar = lang === 'ar';
    const cfg = TATTOO[lang];
    const gold = (a) => `rgba(214,178,124,${a})`;
    const bone = (a) => `rgba(243,236,226,${a})`;
    const cols = 4, cw = W / cols, gap = 13;
    const px = (v) => Math.round(v) + 0.5;
    tc.lineWidth = 1;
    // double rule straddling the tile seam (top & bottom halves meet when tiled)
    tc.strokeStyle = bone(0.34);
    [gap, H - gap].forEach((y) => { tc.beginPath(); tc.moveTo(0, px(y)); tc.lineTo(W, px(y)); tc.stroke(); });
    // running engraved text on the seam (drawn at both edges so halves join)
    tc.fillStyle = bone(0.55);
    tc.textBaseline = 'middle';
    tc.direction = ar ? 'rtl' : 'ltr';
    tc.textAlign = 'left';
    tc.font = ar ? '400 12px "IBM Plex Sans Arabic", sans-serif' : '400 10px "JetBrains Mono", monospace';
    if (!ar && 'letterSpacing' in tc) tc.letterSpacing = '3px';
    const run = cfg.row.repeat(16);
    [0, H].forEach((y) => { tc.fillText(run, -cw * 0.25, y); });
    if ('letterSpacing' in tc) tc.letterSpacing = '0px';
    // column grid — x = 0 doubles as the seam with the neighbouring tile
    tc.strokeStyle = bone(0.18);
    for (let i = 0; i < cols; i++) { tc.beginPath(); tc.moveTo(px(i * cw), gap); tc.lineTo(px(i * cw), H - gap); tc.stroke(); }
    tc.strokeStyle = gold(0.7);
    for (let i = 0; i < cols; i++) {
      [gap, H - gap].forEach((y) => { const x = px(i * cw), yy = px(y); tc.beginPath(); tc.moveTo(x - 6, yy); tc.lineTo(x + 6, yy); tc.moveTo(x, yy - 6); tc.lineTo(x, yy + 6); tc.stroke(); });
    }
    tc.fillStyle = gold(0.75);
    tc.font = '400 10px "JetBrains Mono", monospace';
    tc.textAlign = 'center'; tc.direction = 'ltr';
    for (let i = 0; i < cols; i++) tc.fillText(pad(ar ? cols - i : i + 1), cw * (i + 0.5), gap + 22);
    // the etched word
    const mid = H / 2;
    tc.lineWidth = 1.15;
    tc.strokeStyle = gold(0.9);
    tc.textBaseline = 'alphabetic';
    tc.textAlign = 'center';
    if (!ar) {
      const fs = Math.min(H * 0.6, cw * 1.0);
      tc.font = `400 ${fs}px "Instrument Serif", Georgia, serif`;
      cfg.word.forEach((ch, i) => tc.strokeText(ch, cw * (i + 0.5), mid + fs * 0.35));
    } else {
      tc.direction = 'rtl';
      tc.font = '400 100px Amiri, serif';
      const w100 = tc.measureText(cfg.word[0]).width || 160;
      const fs = Math.min(((W * 0.62) / w100) * 100, H * 0.56);
      tc.font = `400 ${fs}px Amiri, serif`;
      tc.strokeText(cfg.word[0], W / 2, mid + fs * 0.22);
    }
    tc.strokeStyle = gold(0.35);
    tc.beginPath(); tc.moveTo(0, px(mid + H * 0.24)); tc.lineTo(W, px(mid + H * 0.24)); tc.stroke();
    tilePattern = lc.createPattern(tile, 'repeat');
  }

  function drawTattoo(dt, now, cam) {
    SP2.x = lerp(SP2.x, P.x, reduce ? 1 : 0.2); SP2.y = lerp(SP2.y, P.y, reduce ? 1 : 0.2);
    const moving = now - TT.lastMove < 650;
    TT.a = lerp(TT.a, moving ? 1 : 0, clamp(dt * (moving ? 4 : 1.5)));
    if (TT.a < 0.01 || !tilePattern) return;
    const Rr = B.w < 860 ? 190 : 280;
    const d = Rr * 2, dp = Math.round(d * B.dpr);
    if (lens.width !== dp) { lens.width = dp; lens.height = dp; }
    const tw = tile.width, th = tile.height;
    const wx = (SP2.x - Rr + cam.x) * B.dpr, wy = (SP2.y - Rr + cam.y) * B.dpr;
    const ox = -(((wx % tw) + tw) % tw), oy = -(((wy % th) + th) % th);
    lc.setTransform(1, 0, 0, 1, 0, 0);
    lc.globalCompositeOperation = 'source-over';
    lc.clearRect(0, 0, dp, dp);
    lc.save(); lc.translate(ox, oy); lc.fillStyle = tilePattern; lc.fillRect(-ox, -oy, dp, dp); lc.restore();
    lc.globalCompositeOperation = 'destination-in';
    const g = lc.createRadialGradient(dp / 2, dp / 2, 0, dp / 2, dp / 2, dp / 2);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.45, 'rgba(0,0,0,.62)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    lc.fillStyle = g; lc.fillRect(0, 0, dp, dp);
    bx.globalAlpha = TT.a;
    bx.drawImage(lens, SP2.x - Rr, SP2.y - Rr, d, d);
    bx.globalAlpha = 1;
  }

  /* ---- Single logo, dormant: anchored still in the bottom HUD band (never
     over text) at ~10% opacity. Hover / click / drag wakes it — it brightens,
     tilts in 3D, spins with a spring pop, can be pulled around — then it
     springs home and falls quiet again. */
  const buddy = $('.js-buddy');
  const bBody = $('.js-buddy-body');
  const bRing = $('.js-buddy-ring');
  const BD = { x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0, s: 1, sv: 0, rx: 0, ry: 0, rz: 0, spin: 0, spinV: 0, op: 0, wake: 0,
    hover: false, grab: false, moved: 0, gx: 0, gy: 0, lx: 0, ly: 0, lt: 0, size: 46 };
  const REST_OP = 0.1;
  function homeBuddy() {
    BD.size = buddy.offsetWidth || 46;
    BD.hx = B.w / 2;
    BD.hy = B.h - 16 - 30;              // centred in the bottom HUD band, between chapter + progress
  }
  function placeBuddy() { homeBuddy(); BD.x = BD.hx; BD.y = BD.hy; }
  function keepBuddyInside() { homeBuddy(); if (!BD.grab) { BD.x = BD.hx; BD.y = BD.hy; } }
  function popBuddy() {
    BD.spinV += (lang === 'ar' ? -1 : 1) * 1080;
    BD.sv += 6; BD.wake = 1.6;
    bRing.classList.remove('is-pop'); void bRing.offsetWidth; bRing.classList.add('is-pop');
  }
  buddy.addEventListener('pointerenter', () => { BD.hover = true; });
  buddy.addEventListener('pointerleave', () => { BD.hover = false; BD.wake = Math.max(BD.wake, 0.5); });
  buddy.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    BD.grab = true; BD.moved = 0;
    BD.gx = e.clientX - BD.x; BD.gy = e.clientY - BD.y;
    BD.lx = e.clientX; BD.ly = e.clientY; BD.lt = performance.now();
    BD.vx = BD.vy = 0;
    try { buddy.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  });
  buddy.addEventListener('pointermove', (e) => {
    if (!BD.grab) return;
    const now = performance.now();
    const dts = Math.max(8, now - BD.lt) / 1000;
    const dx = e.clientX - BD.lx, dy = e.clientY - BD.ly;
    BD.moved += Math.hypot(dx, dy);
    BD.vx = lerp(BD.vx, dx / dts, 0.5); BD.vy = lerp(BD.vy, dy / dts, 0.5);
    BD.lx = e.clientX; BD.ly = e.clientY; BD.lt = now;
    BD.x = clamp(e.clientX - BD.gx, 30, B.w - 30); BD.y = clamp(e.clientY - BD.gy, 30, B.h - 30);
  });
  const releaseBuddy = () => {
    if (!BD.grab) return;
    BD.grab = false; BD.wake = 1.4;
    if (BD.moved < 6) { BD.vx = BD.vy = 0; popBuddy(); return; }
    const sp = Math.hypot(BD.vx, BD.vy);
    if (sp > 2200) { BD.vx *= 2200 / sp; BD.vy *= 2200 / sp; }
  };
  buddy.addEventListener('pointerup', releaseBuddy);
  buddy.addEventListener('pointercancel', releaseBuddy);
  buddy.addEventListener('click', (e) => { e.preventDefault(); if (e.detail === 0) popBuddy(); });

  function updateBuddy(dt) {
    if (!dt) return;
    BD.wake = Math.max(0, BD.wake - dt);
    const active = BD.hover || BD.grab || BD.wake > 0;
    if (!BD.grab) {
      // weighted spring back to its anchor (only moves when it was disturbed)
      BD.vx += (BD.hx - BD.x) * 120 * dt; BD.vy += (BD.hy - BD.y) * 120 * dt;
      const damp = Math.exp(-dt * 11);
      BD.vx *= damp; BD.vy *= damp;
      BD.x += BD.vx * dt; BD.y += BD.vy * dt;
      if (Math.abs(BD.hx - BD.x) < 0.05 && Math.abs(BD.vx) < 0.5) { BD.x = BD.hx; BD.vx = 0; }
      if (Math.abs(BD.hy - BD.y) < 0.05 && Math.abs(BD.vy) < 0.5) { BD.y = BD.hy; BD.vy = 0; }
    }
    let trx = 0, try_ = 0, trz = 0;
    if (BD.hover || BD.grab) {
      const nx = clamp((P.x - BD.x) / (BD.size * 0.9), -1, 1), ny = clamp((P.y - BD.y) / (BD.size * 0.9), -1, 1);
      try_ = nx * 26; trx = -ny * 26;
    }
    if (!BD.hover) { trz = clamp(BD.vx * 0.015, -18, 18); try_ += clamp(BD.vx * 0.02, -24, 24); trx += clamp(-BD.vy * 0.02, -24, 24); }
    const k = clamp(dt * 9);
    BD.rx = lerp(BD.rx, trx, k); BD.ry = lerp(BD.ry, try_, k); BD.rz = lerp(BD.rz, trz, k);
    const ts = BD.grab ? 1.9 : BD.hover ? 1.7 : 1;
    BD.sv += (ts - BD.s) * 170 * dt; BD.sv *= Math.exp(-dt * 10); BD.s += BD.sv * dt;
    BD.spin += BD.spinV * dt; BD.spinV *= Math.exp(-dt * 2.4);
    if (Math.abs(BD.spinV) < 50) BD.spin = lerp(BD.spin, Math.round(BD.spin / 360) * 360, clamp(dt * 5));
    BD.op = lerp(BD.op, active ? 1 : (body.classList.contains('is-ready') ? REST_OP : 0), clamp(dt * (active ? 8 : 2.2)));
    const half = BD.size / 2;
    buddy.style.opacity = BD.op.toFixed(3);
    buddy.style.transform = `translate3d(${(BD.x - half).toFixed(1)}px,${(BD.y - half).toFixed(1)}px,0)`;
    bBody.style.transform = `perspective(600px) rotateX(${BD.rx.toFixed(2)}deg) rotateY(${(BD.ry + BD.spin).toFixed(2)}deg) rotateZ(${BD.rz.toFixed(2)}deg) scale(${BD.s.toFixed(3)})`;
  }

  // drag the vortex from the hero stage
  const stage = $('#overview');
  let dragging = false, lastDX = 0;
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a,button')) return;
    dragging = true; lastDX = e.clientX;
  });
  addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastDX; lastDX = e.clientX; R.dragV = dx * 0.006 * (lang === 'ar' ? -1 : 1); R.drag += R.dragV; }, { passive: true });
  addEventListener('pointerup', () => { dragging = false; });
  addEventListener('pointercancel', () => { dragging = false; });

  /* ---------------------------------------------------------------------
     HUD — chapter + progress
     --------------------------------------------------------------------- */
  const chapters = $$('[data-chapter]');
  const chNum = $('.js-chapter-num');
  const chName = $('.js-chapter-name');
  const bar = $('.js-bar');
  let curChapter = '01', curSection = chapters[0], atTop = null;
  const roll = (el, text) => {
    el.getAnimations().forEach((a) => a.cancel());
    if (reduce || !el.animate) { el.textContent = text; return; }
    const token = (el._rollToken = (el._rollToken || 0) + 1);
    el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-110%)', opacity: 0 }], { duration: 260, easing: EASE }).onfinish = () => {
      if (token !== el._rollToken) return;
      el.textContent = text;
      el.animate([{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 560, easing: EASE });
    };
    setTimeout(() => { if (token === el._rollToken && el.textContent !== text) el.textContent = text; }, 900);
  };
  function updateHUD(sy) {
    const mid = innerHeight * 0.5;
    let cur = chapters[0];
    for (const s of chapters) if (s.getBoundingClientRect().top <= mid) cur = s;
    curSection = cur;
    if (cur.dataset.chapter !== curChapter) {
      curChapter = cur.dataset.chapter;
      roll(chNum, curChapter);
      roll(chName, T('ch.' + Number(curChapter)));
    }
    const max = Math.max(1, root.scrollHeight - innerHeight);
    const p = clamp(sy / max);
    bar.style.transform = `scaleX(${p})`;
    const top = sy < innerHeight * 0.6;
    if (top !== atTop) { root.classList.toggle('at-top', top); atTop = top; }
  }

  /* ---------------------------------------------------------------------
     Manifesto illumination
     --------------------------------------------------------------------- */
  const methodTrack = $('.js-method');
  const methodBar = $('.js-method-bar');
  const mqMobile = matchMedia('(max-width: 860px)');
  let lastLit = -1, lastStep = -1;
  function updateManifesto() {
    const vh = innerHeight;
    let p;
    if (!mqMobile.matches) { const r = methodTrack.getBoundingClientRect(); p = clamp(-r.top / (r.height - vh)); }
    else { const r = manifesto.getBoundingClientRect(); p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.25)); }
    methodBar.style.transform = `scaleX(${p})`;
    const lit = Math.round(clamp(p * 1.12) * mWords.length);
    if (lit !== lastLit) { mWords.forEach((w, i) => w.classList.toggle('lit', i < lit)); lastLit = lit; }
    const step = Math.min(3, Math.floor(p * 4.0001));
    if (step !== lastStep) { steps.forEach((s, i) => { s.classList.toggle('is-active', i === step); s.classList.toggle('is-done', i < step); }); lastStep = step; }
  }

  /* ---------------------------------------------------------------------
     Apply language (content, direction, fonts, sprites)
     --------------------------------------------------------------------- */
  function applyLang(next) {
    lang = next;
    root.lang = next;
    root.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.title = T('doc.title');
    $$('[data-i18n]').forEach((el) => { el.innerHTML = T(el.dataset.i18n); });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => { const [a, k] = pair.split(':'); el.setAttribute(a, T(k)); });
    });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
    menuLabel.textContent = T(menuOpen ? 'idx.close' : 'idx.open');
    menuBtn.setAttribute('aria-label', T(menuOpen ? 'idx.close' : 'idx.open'));
    $$('.split').forEach((el) => splitWords(el));
    splitWords(manifesto, { wrap: false, cls: 'mw' });
    mWords = $$('.mw', manifesto); lastLit = -1; lastStep = -1;
    renderIndex();
    renderMarquee();
    renderContact();
    layoutH();
    chName.getAnimations().forEach((a) => a.cancel());
    chName.textContent = T('ch.' + Number(curChapter));
    buildTattoo();
    storage.set('sawn-lang', next);
    if (document.fonts) document.fonts.ready.then(() => { measureMarquee(); buildTattoo(); layoutH(); });
    scroller.refresh();
  }

  const veil = $('.veil');
  let switching = false;
  async function switchLang(next) {
    if (next === lang || switching) return;
    switching = true;
    const sec = curSection || chapters[0];
    const off = sec.getBoundingClientRect().top;
    if (!reduce) { veil.classList.remove('is-off'); veil.classList.add('is-on'); await wait(620); }
    applyLang(next);
    if (document.fonts) await Promise.race([document.fonts.ready, wait(600)]);
    const delta = sec.getBoundingClientRect().top - off;
    scroller.jump(scrollY + delta);
    await wait(80);
    if (!reduce) { veil.classList.remove('is-on'); veil.classList.add('is-off'); await wait(800); veil.classList.remove('is-off'); }
    switching = false;
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => switchLang(b.dataset.lang)));

  /* ---------------------------------------------------------------------
     Main loop
     --------------------------------------------------------------------- */
  const stageTitle = () => $('.stage__title');
  const S = { x: P.x, y: P.y };
  let last = performance.now(), lastSY = scrollY, scrollVel = 0, frameN = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    frameN++;
    scroller.tick(dt);
    const sy = scrollY;
    scrollVel = lerp(scrollVel, sy - lastSY, 0.2); lastSY = sy;

    const dx = P.x - P.px, dy = P.y - P.py; P.px = P.x; P.py = P.y;
    P.speed = lerp(P.speed, Math.hypot(dx, dy), 0.18);

    if (fine) {
      C.x = lerp(C.x, P.x, 0.17); C.y = lerp(C.y, P.y, 0.17);
      cDot.style.transform = `translate3d(${P.x}px,${P.y}px,0)`;
      cRing.style.transform = `translate3d(${C.x}px,${C.y}px,0)`;
    }

    // ambient velvet light follows the pointer (round-1 behaviour)
    S.x = lerp(S.x, P.x, 0.06); S.y = lerp(S.y, P.y, 0.06);
    spot.style.transform = `translate3d(${S.x}px,${S.y}px,0)`;

    // background canvas: vortex + tattoo lens
    if (!reduce) R.time += dt;
    if (body.classList.contains('is-ready')) R.intro = Math.min(1, R.intro + dt * (reduce ? 100 : 0.7));
    const mx = P.x / innerWidth - 0.5, my = P.y / innerHeight - 0.5;
    R.dragV *= 0.94; if (!dragging) R.drag += R.dragV;
    R.rotY = lerp(R.rotY, -0.5 + R.time * 0.07 + mx * 0.7 + R.drag, 0.05);
    R.rotX = lerp(R.rotX, -0.12 + my * 0.32, 0.05);
    R.ripple = lerp(R.ripple, Math.min(1.1, P.speed * 0.028 + Math.abs(R.dragV) * 4), 0.05);
    bx.setTransform(B.dpr, 0, 0, B.dpr, 0, 0);
    bx.clearRect(0, 0, B.w, B.h);
    drawVortex(sy);
    updateH();
    drawTattoo(dt, now, camera(sy));

    updateBuddy(dt);

    if (sy < innerHeight) {
      const st = stageTitle(); if (st) st.style.setProperty('--py', `${sy * -0.12}px`);
    }

    if (PV.on && PV.row) {
      const r = indexEl.getBoundingClientRect();
      const ph = preview.offsetHeight;
      const tr = $('.row__tag', PV.row).getBoundingClientRect();
      PV.tx = tr.left - r.left + (P.x - (tr.left + tr.width / 2)) * 0.06;
      PV.ty = clamp(P.y - r.top - ph * 0.5, -ph * 0.35, r.height - ph * 0.65);
      const vx = PV.tx - PV.x;
      PV.x = lerp(PV.x, PV.tx, 0.11); PV.y = lerp(PV.y, PV.ty, 0.11);
      PV.rot = lerp(PV.rot, clamp(vx * 0.03, -6, 6), 0.1);
      preview.style.transform = `translate3d(${PV.x}px,${PV.y}px,0) rotate(${PV.rot}deg)`;
    }

    if (!reduce && mqW) {
      const dirS = lang === 'ar' ? 1 : -1;
      mqX += dirS * (40 + Math.abs(scrollVel) * 5) * dt * (scrollVel < -0.5 ? -1 : 1);
      if (mqX <= -mqW) mqX += mqW;
      if (mqX > 0) mqX -= mqW;
      mq.style.transform = `translate3d(${mqX}px,0,0) skewX(${clamp(scrollVel * -0.25, -8, 8)}deg)`;
    }

    updateHUD(sy);
    updateManifesto();
    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------------------
     Curtain → stage choreography
     --------------------------------------------------------------------- */
  const curtain = $('.curtain');
  const counts = $$('.js-count');
  function runCurtain() {
    const D = reduce ? 150 : 900;
    const t0 = performance.now();
    const logo = $('.js-curtain-logo');
    const ready = Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), logo && logo.decode ? logo.decode().catch(() => {}) : Promise.resolve()]),
      wait(2400),
    ]);
    return new Promise((resolve) => {
      const tick = (now) => {
        const p = clamp((now - t0) / D);
        const e = easeIO(p);
        counts.forEach((c) => { c.textContent = pad(Math.round(e * 100)); });
        curtain.style.setProperty('--p', e.toFixed(3));
        if (p < 1) requestAnimationFrame(tick);
        else ready.then(() => {
          body.classList.remove('is-loading');
          body.classList.add('is-ready');
          scroller.lock(false);
          setTimeout(() => { curtain.remove(); resolve(); }, reduce ? 50 : 1400);
        });
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  sizeBg();
  applyLang(lang);
  placeBuddy();
  let rT;
  addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => { sizeBg(); buildTattoo(); measureMarquee(); layoutH(); keepBuddyInside(); }, 120);
  });
  requestAnimationFrame(loop);
  runCurtain();
})();
