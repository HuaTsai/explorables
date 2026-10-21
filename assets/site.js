/* explorables 共用腳本：主題切換、右側註解、術語提示、逐步型 workbench 的控制列。
   每頁在 <head> 用 <script src="../assets/site.js"></script> 引入（放 head 是為了主題不閃一下）；
   頁面自己的 <script> 放在 </body> 前。 */
(function () {
  'use strict';
  const site = {};

  /* ---- 主題：自動（跟系統）、深色、淺色，記在 localStorage ---- */
  const THEMES = [['auto', '自動'], ['dark', '深色'], ['light', '淺色']];
  const ICON = {
    auto: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 2.5a7.5 7.5 0 0 1 0 15z" fill="currentColor"/></svg>',
    dark: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 12.8A7 7 0 0 1 7.2 4.5a7 7 0 1 0 8.3 8.3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    light: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 1.8v2.2M10 16v2.2M1.8 10H4M16 10h2.2M4.2 4.2l1.6 1.6M14.2 14.2l1.6 1.6M4.2 15.8l1.6-1.6M14.2 5.8l1.6-1.6"/></g></svg>',
  };
  const getTheme = () => { try { return localStorage.getItem('theme') || 'auto'; } catch (e) { return 'auto'; } };
  const applyTheme = t => {
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  };
  applyTheme(getTheme());
  function themeToggle() {
    const header = document.querySelector('.page > header');
    if (!header) return;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'theme';
    const label = () => { const t = getTheme(), name = THEMES.find(x => x[0] === t)[1]; btn.innerHTML = ICON[t]; btn.title = `主題：${name}（點一下切換）`; btn.setAttribute('aria-label', `切換主題，目前是${name}`); };
    btn.addEventListener('click', () => {
      const i = THEMES.findIndex(x => x[0] === getTheme());
      const next = THEMES[(i + 1) % THEMES.length][0];
      try { if (next === 'auto') localStorage.removeItem('theme'); else localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next); label();
    });
    label();
    header.appendChild(btn);
  }

  /* ---- 右側註解：正文裡 <span class="sn">…</span>，自動加編號和展開鈕 ---- */
  function sidenotes() {
    const notes = document.querySelectorAll('.sn');
    if (!notes.length) return;
    const wide = window.matchMedia('(min-width: 96rem)');
    const pairs = [];
    notes.forEach((sn, i) => {
      const n = i + 1;
      const ref = document.createElement('button');
      ref.type = 'button'; ref.className = 'sn-ref'; ref.textContent = n;
      ref.setAttribute('aria-expanded', 'false');
      ref.setAttribute('aria-label', `註解 ${n}`);
      const label = document.createElement('span');
      label.className = 'sn-n'; label.textContent = n;
      sn.insertBefore(label, sn.firstChild);
      sn.parentNode.insertBefore(ref, sn);
      pairs.push({ sn, ref, host: sn.closest('.page > *') || sn.parentElement });
      ref.addEventListener('click', () => {
        if (wide.matches) return;
        const open = sn.classList.toggle('open');
        ref.setAttribute('aria-expanded', String(open));
      });
    });
    // 寬螢幕：註解絕對定位在所屬段落右側，對齊編號那一行，和上一條重疊就往下推
    const place = () => {
      if (!wide.matches) { pairs.forEach(p => { p.host.style.position = ''; p.sn.style.top = ''; }); return; }
      let prevBottom = -Infinity;
      pairs.forEach(p => {
        p.host.style.position = 'relative';
        let top = p.ref.getBoundingClientRect().top - p.host.getBoundingClientRect().top;
        p.sn.style.top = top + 'px';
        const abs = p.sn.getBoundingClientRect().top + window.scrollY;
        if (abs < prevBottom + 8) { top += prevBottom + 8 - abs; p.sn.style.top = top + 'px'; }
        prevBottom = p.sn.getBoundingClientRect().bottom + window.scrollY;
      });
    };
    place();
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  }

  /* ---- 術語提示：<span class="term" data-def="定義">詞</span> ---- */
  function terms() {
    const terms = document.querySelectorAll('.term[data-def]');
    if (!terms.length) return;
    const tip = document.createElement('div');
    tip.className = 'tip'; tip.id = 'site-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
    document.body.appendChild(tip);
    let current = null;
    const show = el => {
      current = el;
      tip.innerHTML = el.dataset.def;
      tip.hidden = false;
      const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
      let x = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
      let y = r.bottom + 6;
      if (y + h > window.innerHeight - 8) y = r.top - h - 6;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    };
    const hide = () => { current = null; tip.hidden = true; };
    terms.forEach(el => {
      el.tabIndex = 0;
      el.setAttribute('aria-describedby', 'site-tip');
      el.addEventListener('mouseenter', () => show(el));
      el.addEventListener('mouseleave', hide);
      el.addEventListener('focus', () => show(el));
      el.addEventListener('blur', hide);
      el.addEventListener('click', e => { e.preventDefault(); current === el && !tip.hidden ? hide() : show(el); });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* ---- 逐步型控制列 ----
     <div class="controls" data-stepper>
       <button data-step="reset">重來</button> <button data-step="prev">上一步</button>
       <button data-step="next" class="primary">下一步</button> <button data-step="play">播放</button>
       <input type="range"> <span class="count"></span>
     </div>
     const st = site.stepper(el, { onChange: k => render() });  st.setTotal(n); st.set(k); st.k; st.total */
  site.stepper = function (el, opts) {
    const q = s => el.querySelector(s);
    const btn = { reset: q('[data-step="reset"]'), prev: q('[data-step="prev"]'), next: q('[data-step="next"]'), play: q('[data-step="play"]') };
    const range = q('input[type="range"]'), count = q('.count');
    const st = { k: 0, total: 0, playing: false, timer: null };
    const onChange = opts && opts.onChange ? opts.onChange : () => {};
    const sync = () => {
      if (range) { range.max = st.total; range.value = st.k; }
      if (count) count.textContent = `第 ${st.k} / ${st.total} 步`;
      const atEnd = st.k >= st.total;
      if (btn.reset) btn.reset.disabled = st.k === 0;
      if (btn.prev) btn.prev.disabled = st.k === 0;
      if (btn.next) btn.next.disabled = atEnd;
      if (btn.play) { btn.play.disabled = atEnd; btn.play.textContent = st.playing ? '暫停' : '播放'; btn.play.classList.toggle('playing', st.playing); }
    };
    const pause = () => { st.playing = false; if (st.timer) { clearInterval(st.timer); st.timer = null; } sync(); };
    const set = (k, fromPlay) => {
      if (!fromPlay) pause();
      st.k = Math.max(0, Math.min(st.total, k));
      sync();
      onChange(st.k);
      if (fromPlay && st.k >= st.total) pause();
    };
    const play = () => {
      if (st.k >= st.total) return;
      st.playing = true; sync();
      st.timer = setInterval(() => set(st.k + 1, true), 1000);
    };
    st.set = k => set(k);
    st.setTotal = n => { pause(); st.total = Math.max(0, n); st.k = Math.min(st.k, st.total); sync(); };
    st.pause = pause;
    st.play = play;
    if (btn.reset) btn.reset.addEventListener('click', () => set(0));
    if (btn.prev) btn.prev.addEventListener('click', () => set(st.k - 1));
    if (btn.next) btn.next.addEventListener('click', () => set(st.k + 1));
    if (btn.play) btn.play.addEventListener('click', () => st.playing ? pause() : play());
    if (range) range.addEventListener('input', e => set(+e.target.value));
    document.addEventListener('keydown', e => {
      if (['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { set(st.k + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { set(st.k - 1); e.preventDefault(); }
    });
    sync();
    return st;
  };

  document.addEventListener('DOMContentLoaded', () => { themeToggle(); sidenotes(); terms(); });
  window.site = site;
})();
